import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../types';

export const getSalesOrders = async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;

  const whereClause: any = {};
  if (status && typeof status === 'string' && status !== 'ALL') {
    whereClause.status = status;
  }

  const salesOrders = await prisma.salesOrder.findMany({
    where: whereClause,
    include: {
      customer: true,
      quotation: {
        select: {
          id: true,
          quotationNumber: true,
          enquiry: {
            select: { id: true, enquiryNumber: true },
          },
        },
      },
      confirmedByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: {
            include: { inventory: true },
          },
        },
      },
      dispatches: {
        include: {
          items: { include: { product: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Attach dynamic stock availability check to each item for frontend display
  const enriched = salesOrders.map((so) => {
    let canFulfill = true;
    const enrichedItems = so.items.map((item) => {
      const inv = item.product?.inventory;
      const physical = inv?.physicalQuantity || 0;
      const reserved = inv?.reservedQuantity || 0;
      const damaged = inv?.damagedQuantity || 0;
      const available = Math.max(0, physical - reserved - damaged);

      // If order is already confirmed, this order's own reservation is already part of reservedQuantity
      const sufficient = so.status === 'CONFIRMED' || so.status === 'DISPATCHED' ? true : available >= item.quantity;
      if (!sufficient) canFulfill = false;

      return {
        ...item,
        stockStatus: {
          physicalQuantity: physical,
          reservedQuantity: reserved,
          damagedQuantity: damaged,
          availableQuantity: available,
          sufficient,
        },
      };
    });

    return {
      ...so,
      canFulfill,
      items: enrichedItems,
    };
  });

  return res.json({ success: true, data: enriched });
};

export const getSalesOrderById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const order = await prisma.salesOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      quotation: {
        include: {
          enquiry: true,
        },
      },
      confirmedByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: {
            include: { inventory: true },
          },
        },
      },
      dispatches: {
        include: {
          items: { include: { product: true } },
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ success: false, error: 'Sales Order not found.' });
  }

  return res.json({ success: true, data: order });
};

/**
 * Confirm Sales Order & Reserve Inventory
 * Mandatory Test 4: Cannot reserve more than available inventory!
 * Concurrency Challenge: Atomic check-and-reserve in transaction so simultaneous requests cannot both succeed
 */
export const confirmSalesOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: { include: { inventory: true } },
            },
          },
        },
      });

      if (!order) {
        throw new Error('Sales Order not found.');
      }

      if (order.status !== 'PENDING') {
        throw new Error(`Only PENDING sales orders can be confirmed. Current status is '${order.status}'.`);
      }

      // MANDATORY TEST 4 & CONCURRENCY: Check and reserve stock atomically for each line item
      for (const item of order.items) {
        // Fetch latest inventory inside transaction
        const inv = await tx.inventory.findUnique({
          where: { productId: item.productId },
          include: { product: true },
        });

        if (!inv) {
          throw new Error(`Inventory record not found for product ${item.productId}`);
        }

        const available = inv.physicalQuantity - inv.reservedQuantity - inv.damagedQuantity;

        if (available < item.quantity) {
          throw new Error(
            `Cannot reserve more than available inventory. Product "${inv.product.productName}" (${inv.product.productCode}) requires ${item.quantity} units, but only ${available} units are currently available (Physical: ${inv.physicalQuantity}, Reserved: ${inv.reservedQuantity}).`
          );
        }

        // Reserve stock: Physical quantity DOES NOT decrease; Reserved quantity increases!
        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        });
      }

      // Update Sales Order status to CONFIRMED
      const confirmedOrder = await tx.salesOrder.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          confirmedByUserId: req.user?.userId || null,
        },
        include: {
          customer: true,
          items: { include: { product: { include: { inventory: true } } } },
        },
      });

      return confirmedOrder;
    });

    return res.json({
      success: true,
      message: `Sales Order ${result.orderNumber} successfully confirmed. Stock has been reserved.`,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to confirm sales order.',
    });
  }
};

/**
 * Dispatch Confirmed Sales Order
 * Rule: Decreases BOTH Physical Quantity AND Reserved Quantity
 * Rule: Prevents duplicate dispatch, dispatch of cancelled order, or dispatch beyond reserved quantity
 */
export const dispatchSalesOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { vehicleNumber, driverName } = req.body;

  if (!vehicleNumber || !driverName) {
    return res.status(400).json({
      success: false,
      error: 'Both vehicleNumber and driverName are required for dispatch.',
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: { include: { inventory: true } },
            },
          },
        },
      });

      if (!order) {
        throw new Error('Sales Order not found.');
      }

      if (order.status !== 'CONFIRMED') {
        throw new Error(
          `Cannot dispatch order. Only CONFIRMED sales orders can be dispatched. Current status is '${order.status}'.`
        );
      }

      // Deduct stock: BOTH physicalQuantity and reservedQuantity decrease
      const dispatchItemsData = [];
      for (const item of order.items) {
        const inv = await tx.inventory.findUnique({
          where: { productId: item.productId },
          include: { product: true },
        });

        if (!inv) {
          throw new Error(`Inventory not found for product ${item.productId}`);
        }

        if (inv.reservedQuantity < item.quantity) {
          throw new Error(
            `Cannot dispatch. Reserved quantity (${inv.reservedQuantity}) is less than dispatch quantity (${item.quantity}) for product "${inv.product.productName}".`
          );
        }

        if (inv.physicalQuantity < item.quantity) {
          throw new Error(
            `Cannot dispatch. Physical quantity (${inv.physicalQuantity}) is less than dispatch quantity (${item.quantity}) for product "${inv.product.productName}".`
          );
        }

        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            physicalQuantity: { decrement: item.quantity },
            reservedQuantity: { decrement: item.quantity },
          },
        });

        dispatchItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      // Generate sequence: DSP-YYYY-XXX
      const count = await tx.dispatch.count();
      const year = new Date().getFullYear();
      const dispatchNumber = `DSP-${year}-${String(count + 1).padStart(3, '0')}`;

      const dispatch = await tx.dispatch.create({
        data: {
          dispatchNumber,
          salesOrderId: order.id,
          dispatchDate: new Date(),
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
          driverName: driverName.trim(),
          createdByUserId: req.user?.userId || null,
          items: {
            create: dispatchItemsData,
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      // Update Sales Order status to DISPATCHED
      const updatedOrder = await tx.salesOrder.update({
        where: { id },
        data: {
          status: 'DISPATCHED',
        },
        include: {
          customer: true,
          items: { include: { product: { include: { inventory: true } } } },
          dispatches: true,
        },
      });

      return { dispatch, order: updatedOrder };
    });

    return res.status(201).json({
      success: true,
      message: `Sales Order ${result.order.orderNumber} successfully dispatched via ${result.dispatch.vehicleNumber} (${result.dispatch.driverName}). Physical and reserved stock decremented.`,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to dispatch sales order.',
    });
  }
};

/**
 * Cancel Sales Order (Live Verification readiness)
 * If the order was CONFIRMED, correctly releases its reserved inventory!
 */
export const cancelSalesOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new Error('Sales Order not found.');
      }

      if (order.status === 'DISPATCHED') {
        throw new Error('Cannot cancel an order that has already been dispatched.');
      }

      if (order.status === 'CANCELLED') {
        throw new Error('Sales order is already cancelled.');
      }

      // If the order was CONFIRMED, release the reserved stock!
      if (order.status === 'CONFIRMED') {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      const cancelledOrder = await tx.salesOrder.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
        include: { customer: true, items: true },
      });

      return cancelledOrder;
    });

    return res.json({
      success: true,
      message: `Sales Order ${result.orderNumber} cancelled. Any reserved stock has been released back to available.`,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to cancel sales order.',
    });
  }
};
