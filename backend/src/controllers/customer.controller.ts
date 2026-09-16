import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getCustomers = async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany({
    orderBy: { companyName: 'asc' },
    include: {
      _count: {
        select: { enquiries: true, quotations: true, salesOrders: true },
      },
    },
  });
  return res.json({ success: true, data: customers });
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      enquiries: { orderBy: { createdAt: 'desc' } },
      quotations: { orderBy: { createdAt: 'desc' } },
      salesOrders: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!customer) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }
  return res.json({ success: true, data: customer });
};

export const createCustomer = async (req: Request, res: Response) => {
  const { companyName, contactPerson, mobile, email, city } = req.body;

  if (!companyName || !contactPerson || !mobile || !email || !city) {
    return res.status(400).json({
      success: false,
      error: 'All fields (companyName, contactPerson, mobile, email, city) are required.',
    });
  }

  const customer = await prisma.customer.create({
    data: {
      companyName,
      contactPerson,
      mobile,
      email,
      city,
    },
  });

  return res.status(201).json({ success: true, data: customer });
};
