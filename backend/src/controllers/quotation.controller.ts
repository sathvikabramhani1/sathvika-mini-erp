import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../types';

export const getQuotations = async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;

  const whereClause: any = {};
  if (status && typeof status === 'string' && status !== 'ALL') {
    whereClause.status = status;
  }

  const quotations = await prisma.quotation.findMany({
    where: whereClause,
    include: {
      customer: true,
      enquiry: {
        select: { id: true, enquiryNumber: true, status: true, requiredDate: true },
      },
      createdByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: { include: { inventory: true } },
        },
      },
      salesOrder: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          orderDate: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: quotations });
};

export const getQuotationById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      customer: true,
      enquiry: {
        include: {
          items: { include: { product: true } },
        },
      },
      createdByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: { include: { inventory: true } },
        },
      },
      salesOrder: {
        include: {
          items: { include: { product: true } },
          dispatches: true,
        },
      },
    },
  });

  if (!quotation) {
    return res.status(404).json({ success: false, error: 'Quotation not found.' });
  }

  return res.json({ success: true, data: quotation });
};

export const createQuotation = async (req: AuthenticatedRequest, res: Response) => {
  const { enquiryId, customerId, validUntil, items, discountPercent = 0, gstPercent = 18 } = req.body;

  if (!enquiryId) {
    return res.status(400).json({ success: false, error: 'enquiryId is required.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Quotation must have at least one product item.',
    });
  }

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: { customer: true },
  });

  if (!enquiry) {
    return res.status(404).json({ success: false, error: 'Referenced Enquiry not found.' });
  }

  const finalCustomerId = customerId || enquiry.customerId;

  // Backend authoritative calculation (Do not trust client-side arithmetic)
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      return res.status(400).json({
        success: false,
        error: `Product with id ${item.productId} not found.`,
      });
    }

    const qty = Number(item.quantity);
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid quantity ${qty} for product ${product.productCode}. Must be > 0.`,
      });
    }

    const unitPrice = item.unitPrice !== undefined ? Number(item.unitPrice) : product.basePrice;
    const itemDiscPct = item.discountPercent !== undefined ? Number(item.discountPercent) : Number(discountPercent);
    const itemGstPct = item.gstPercent !== undefined ? Number(item.gstPercent) : Number(gstPercent);

    const baseAmount = qty * unitPrice;
    const itemDiscount = baseAmount * (itemDiscPct / 100);
    const taxableAmount = baseAmount - itemDiscount;
    const itemGst = taxableAmount * (itemGstPct / 100);
    const lineAmount = Math.round((taxableAmount + itemGst) * 100) / 100;

    subtotal += baseAmount;

    processedItems.push({
      productId: product.id,
      quantity: qty,
      unitPrice,
      discountPercent: itemDiscPct,
      gstPercent: itemGstPct,
      lineAmount,
    });
  }

  const overallDiscount = subtotal * (Number(discountPercent) / 100);
  const taxableTotal = subtotal - overallDiscount;
  const overallGst = taxableTotal * (Number(gstPercent) / 100);
  const grandTotal = Math.round((taxableTotal + overallGst) * 100) / 100;

  // Generate sequence number: QTN-2026-XXX
  const count = await prisma.quotation.count();
  const year = new Date().getFullYear();
  const quotationNumber = `QTN-${year}-${String(count + 1).padStart(3, '0')}`;

  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber,
      enquiryId: enquiry.id,
      customerId: finalCustomerId,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: Math.round(subtotal * 100) / 100,
      discountPercent: Number(discountPercent),
      discountAmount: Math.round(overallDiscount * 100) / 100,
      gstPercent: Number(gstPercent),
      gstAmount: Math.round(overallGst * 100) / 100,
      grandTotal,
      status: 'DRAFT',
      createdByUserId: req.user?.userId || null,
      items: {
        create: processedItems,
      },
    },
    include: {
      customer: true,
      enquiry: true,
      items: { include: { product: true } },
    },
  });

  // Update Enquiry status to QUOTED if it was NEW
  if (enquiry.status === 'NEW') {
    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: { status: 'QUOTED' },
    });
  }

  return res.status(201).json({ success: true, data: quotation });
};

export const updateQuotationStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
    });
  }

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { enquiry: true },
  });

  if (!quotation) {
    return res.status(404).json({ success: false, error: 'Quotation not found.' });
  }

  const updated = await prisma.quotation.update({
    where: { id },
    data: { status },
    include: {
      customer: true,
      enquiry: true,
      items: { include: { product: true } },
      salesOrder: true,
    },
  });

  // Update linked enquiry status
  if (status === 'ACCEPTED') {
    await prisma.enquiry.update({
      where: { id: quotation.enquiryId },
      data: { status: 'WON' },
    });
  }

  return res.json({ success: true, data: updated });
};

/**
 * Quotation -> Sales Order Conversion
 * Mandatory Test 2: DRAFT or REJECTED quotation CANNOT create a Sales Order!
 * Mandatory Test 3: Same quotation cannot generate duplicate Sales Orders!
 */
export const convertQuotationToOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      items: true,
      salesOrder: true,
    },
  });

  if (!quotation) {
    return res.status(404).json({ success: false, error: 'Quotation not found.' });
  }

  // MANDATORY TEST 2: Only ACCEPTED quotation can create a Sales Order!
  if (quotation.status !== 'ACCEPTED') {
    return res.status(400).json({
      success: false,
      error: `Cannot convert quotation to Sales Order. Quotation must be in ACCEPTED status, but is currently '${quotation.status}'.`,
    });
  }

  // MANDATORY TEST 3: Prevent duplicate Sales Orders from same quotation
  if (quotation.salesOrder) {
    return res.status(400).json({
      success: false,
      error: `A Sales Order (${quotation.salesOrder.orderNumber}) has already been generated from this Quotation. Duplicate orders are prevented.`,
    });
  }

  // Generate sequence: SO-2026-XXX
  const count = await prisma.salesOrder.count();
  const year = new Date().getFullYear();
  const orderNumber = `SO-${year}-${String(count + 1).padStart(3, '0')}`;

  const salesOrder = await prisma.salesOrder.create({
    data: {
      orderNumber,
      quotationId: quotation.id,
      customerId: quotation.customerId,
      totalAmount: quotation.grandTotal,
      status: 'PENDING',
      items: {
        create: quotation.items.map((qi) => ({
          productId: qi.productId,
          quantity: qi.quantity,
          unitPrice: qi.unitPrice,
          lineAmount: qi.lineAmount,
        })),
      },
    },
    include: {
      customer: true,
      quotation: true,
      items: {
        include: {
          product: { include: { inventory: true } },
        },
      },
    },
  });

  return res.status(201).json({
    success: true,
    message: `Sales Order ${salesOrder.orderNumber} successfully created. Status is PENDING confirmation.`,
    data: salesOrder,
  });
};
