import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getInventory = async (req: Request, res: Response) => {
  const inventoryRecords = await prisma.inventory.findMany({
    include: {
      product: true,
    },
    orderBy: {
      product: { productCode: 'asc' },
    },
  });

  const formatted = inventoryRecords.map((inv) => {
    const physical = inv.physicalQuantity;
    const reserved = inv.reservedQuantity;
    const damaged = inv.damagedQuantity;
    const available = Math.max(0, physical - reserved - damaged);

    return {
      id: inv.id,
      productId: inv.productId,
      productCode: inv.product.productCode,
      productName: inv.product.productName,
      category: inv.product.category,
      unit: inv.product.unit,
      basePrice: inv.product.basePrice,
      physicalQuantity: physical,
      reservedQuantity: reserved,
      damagedQuantity: damaged,
      availableQuantity: available,
      updatedAt: inv.updatedAt,
    };
  });

  return res.json({ success: true, data: formatted });
};

export const updateInventory = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { physicalQuantity, damagedQuantity } = req.body;

  const current = await prisma.inventory.findUnique({
    where: { productId },
    include: { product: true },
  });

  if (!current) {
    return res.status(404).json({ success: false, error: 'Inventory record not found.' });
  }

  const newPhysical = physicalQuantity !== undefined ? Number(physicalQuantity) : current.physicalQuantity;
  const newDamaged = damagedQuantity !== undefined ? Number(damagedQuantity) : current.damagedQuantity;

  if (newPhysical < 0 || newDamaged < 0) {
    return res.status(400).json({
      success: false,
      error: 'Physical and Damaged quantities cannot be negative.',
    });
  }

  // Prevent physical stock dropping below currently reserved stock!
  if (newPhysical < current.reservedQuantity + newDamaged) {
    return res.status(400).json({
      success: false,
      error: `Cannot reduce physical quantity to ${newPhysical}. It must be at least the reserved quantity (${current.reservedQuantity}) + damaged (${newDamaged}).`,
    });
  }

  const updated = await prisma.inventory.update({
    where: { productId },
    data: {
      physicalQuantity: newPhysical,
      damagedQuantity: newDamaged,
    },
    include: { product: true },
  });

  const available = updated.physicalQuantity - updated.reservedQuantity - updated.damagedQuantity;

  return res.json({
    success: true,
    data: {
      ...updated,
      availableQuantity: available,
    },
  });
};
