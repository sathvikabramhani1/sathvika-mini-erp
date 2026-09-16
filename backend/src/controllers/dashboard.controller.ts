import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getDashboardMetrics = async (_req: Request, res: Response) => {
  const [
    totalCustomers,
    totalProducts,
    totalEnquiries,
    totalQuotations,
    totalSalesOrders,
    totalDispatches,
    enquiryStats,
    quotationStats,
    orderStats,
    inventories,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.product.count(),
    prisma.enquiry.count(),
    prisma.quotation.count(),
    prisma.salesOrder.count(),
    prisma.dispatch.count(),
    prisma.enquiry.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.quotation.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.salesOrder.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.inventory.findMany({ include: { product: true } }),
  ]);

  let totalPhysicalStock = 0;
  let totalReservedStock = 0;
  let totalDamagedStock = 0;

  for (const inv of inventories) {
    totalPhysicalStock += inv.physicalQuantity;
    totalReservedStock += inv.reservedQuantity;
    totalDamagedStock += inv.damagedQuantity;
  }

  const totalAvailableStock = Math.max(0, totalPhysicalStock - totalReservedStock - totalDamagedStock);

  return res.json({
    success: true,
    data: {
      counts: {
        customers: totalCustomers,
        products: totalProducts,
        enquiries: totalEnquiries,
        quotations: totalQuotations,
        salesOrders: totalSalesOrders,
        dispatches: totalDispatches,
      },
      inventory: {
        totalPhysical: totalPhysicalStock,
        totalReserved: totalReservedStock,
        totalDamaged: totalDamagedStock,
        totalAvailable: totalAvailableStock,
      },
      breakdowns: {
        enquiries: enquiryStats.reduce((acc: any, curr) => {
          acc[curr.status] = curr._count.id;
          return acc;
        }, {}),
        quotations: quotationStats.reduce((acc: any, curr) => {
          acc[curr.status] = curr._count.id;
          return acc;
        }, {}),
        salesOrders: orderStats.reduce((acc: any, curr) => {
          acc[curr.status] = curr._count.id;
          return acc;
        }, {}),
      },
    },
  });
};
