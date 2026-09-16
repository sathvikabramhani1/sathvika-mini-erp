import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: { productCode: 'asc' },
    include: {
      inventory: true,
    },
  });

  const formatted = products.map((p) => {
    const physical = p.inventory?.physicalQuantity || 0;
    const reserved = p.inventory?.reservedQuantity || 0;
    const damaged = p.inventory?.damagedQuantity || 0;
    const available = Math.max(0, physical - reserved - damaged);
    return {
      ...p,
      inventory: {
        physicalQuantity: physical,
        reservedQuantity: reserved,
        damagedQuantity: damaged,
        availableQuantity: available,
      },
    };
  });

  return res.json({ success: true, data: formatted });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const physical = product.inventory?.physicalQuantity || 0;
  const reserved = product.inventory?.reservedQuantity || 0;
  const damaged = product.inventory?.damagedQuantity || 0;
  const available = Math.max(0, physical - reserved - damaged);

  return res.json({
    success: true,
    data: {
      ...product,
      inventory: {
        physicalQuantity: physical,
        reservedQuantity: reserved,
        damagedQuantity: damaged,
        availableQuantity: available,
      },
    },
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const { productCode, productName, category, unit, basePrice, initialPhysicalQuantity } = req.body;

  if (!productCode || !productName || !category || !unit || basePrice === undefined) {
    return res.status(400).json({
      success: false,
      error: 'productCode, productName, category, unit, and basePrice are required.',
    });
  }

  const existing = await prisma.product.findUnique({ where: { productCode } });
  if (existing) {
    return res.status(400).json({
      success: false,
      error: `Product with code "${productCode}" already exists.`,
    });
  }

  const product = await prisma.product.create({
    data: {
      productCode,
      productName,
      category,
      unit,
      basePrice: Number(basePrice),
      inventory: {
        create: {
          physicalQuantity: Number(initialPhysicalQuantity) || 0,
          reservedQuantity: 0,
          damagedQuantity: 0,
        },
      },
    },
    include: { inventory: true },
  });

  return res.status(201).json({ success: true, data: product });
};
