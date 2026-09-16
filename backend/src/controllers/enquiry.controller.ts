import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../types';

export const getEnquiries = async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;

  const whereClause: any = {};
  if (status && typeof status === 'string' && status !== 'ALL') {
    whereClause.status = status;
  }

  const enquiries = await prisma.enquiry.findMany({
    where: whereClause,
    include: {
      customer: true,
      createdByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: {
            include: { inventory: true },
          },
        },
      },
      quotations: {
        select: {
          id: true,
          quotationNumber: true,
          status: true,
          grandTotal: true,
          validUntil: true,
          salesOrder: {
            select: { id: true, orderNumber: true, status: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: enquiries });
};

export const getEnquiryById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      customer: true,
      createdByUser: { select: { id: true, name: true, email: true, role: true } },
      items: {
        include: {
          product: {
            include: { inventory: true },
          },
        },
      },
      quotations: {
        include: {
          salesOrder: true,
        },
      },
    },
  });

  if (!enquiry) {
    return res.status(404).json({ success: false, error: 'Enquiry not found.' });
  }

  return res.json({ success: true, data: enquiry });
};

export const createEnquiry = async (req: AuthenticatedRequest, res: Response) => {
  const { customerId, customer, requiredDate, notes, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Enquiry must contain at least one product item.',
    });
  }

  let finalCustomerId = customerId;

  // If new customer details provided inline, create customer
  if (!finalCustomerId && customer) {
    if (!customer.companyName || !customer.contactPerson || !customer.mobile || !customer.email || !customer.city) {
      return res.status(400).json({
        success: false,
        error: 'Complete customer details (companyName, contactPerson, mobile, email, city) are required.',
      });
    }
    const newCustomer = await prisma.customer.create({
      data: {
        companyName: customer.companyName,
        contactPerson: customer.contactPerson,
        mobile: customer.mobile,
        email: customer.email,
        city: customer.city,
      },
    });
    finalCustomerId = newCustomer.id;
  }

  if (!finalCustomerId) {
    return res.status(400).json({
      success: false,
      error: 'Either customerId or customer object is required.',
    });
  }

  // Validate items
  for (const item of items) {
    if (!item.productId || !item.quantity || Number(item.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Each item must have a valid productId and quantity > 0.',
      });
    }
  }

  // Generate sequence number: ENQ-2026-XXXX
  const count = await prisma.enquiry.count();
  const year = new Date().getFullYear();
  const enquiryNumber = `ENQ-${year}-${String(count + 1).padStart(3, '0')}`;

  const enquiry = await prisma.enquiry.create({
    data: {
      enquiryNumber,
      customerId: finalCustomerId,
      requiredDate: requiredDate ? new Date(requiredDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: notes || null,
      status: 'NEW',
      createdByUserId: req.user?.userId || null,
      items: {
        create: items.map((i: any) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
      },
    },
    include: {
      customer: true,
      items: {
        include: {
          product: { include: { inventory: true } },
        },
      },
    },
  });

  return res.status(201).json({ success: true, data: enquiry });
};

export const updateEnquiryStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['NEW', 'QUOTED', 'WON', 'LOST'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Valid values are: ${validStatuses.join(', ')}`,
    });
  }

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { status },
    include: { customer: true, items: true },
  });

  return res.json({ success: true, data: enquiry });
};
