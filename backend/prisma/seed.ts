import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning existing database tables ---');
  // Delete in reverse dependency order
  await prisma.dispatchItem.deleteMany();
  await prisma.dispatch.deleteMany();
  await prisma.salesOrderItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.enquiryItem.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- Seeding Users ---');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@sathvika.com',
      name: 'Sathvika Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@sathvika.com',
      name: 'Sathvika Sales',
      passwordHash,
      role: 'SALES',
    },
  });

  console.log(`Created users: Admin (${adminUser.email}), Sales (${salesUser.email})`);

  console.log('--- Seeding Customers ---');
  const customer1 = await prisma.customer.create({
    data: {
      companyName: 'ABC Engineering Pvt. Ltd.',
      contactPerson: 'Rajesh Sharma',
      mobile: '+91 98765 43210',
      email: 'purchase@abcengineering.com',
      city: 'Mumbai',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyName: 'Apex Industrial Manufacturing Ltd.',
      contactPerson: 'Sunita Patel',
      mobile: '+91 98234 56789',
      email: 'spatel@apexindustrial.in',
      city: 'Pune',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      companyName: 'Titan Heavy Machineries Corp',
      contactPerson: 'Amit Verma',
      mobile: '+91 98111 22334',
      email: 'averma@titanmachineries.com',
      city: 'Hyderabad',
    },
  });

  console.log('--- Seeding 6 Industrial Products & Inventory ---');
  const productsData = [
    {
      productCode: 'IND-BRG-101',
      productName: 'Heavy-Duty Flange Ball Bearing (UCF 208)',
      category: 'Bearings & Bushings',
      unit: 'PCS',
      basePrice: 450.0,
      physical: 200,
      reserved: 0,
    },
    {
      productCode: 'IND-VLV-202',
      productName: 'High-Pressure Hydraulic Directional Control Valve',
      category: 'Valves & Actuators',
      unit: 'PCS',
      basePrice: 1850.0,
      physical: 100,
      reserved: 0,
    },
    {
      productCode: 'IND-PMP-303',
      productName: 'Industrial Cast-Iron Rotary Gear Pump (15 GPM)',
      category: 'Pumps & Motors',
      unit: 'SET',
      basePrice: 6200.0,
      physical: 50,
      reserved: 0,
    },
    {
      productCode: 'IND-FLG-404',
      productName: 'Carbon Steel ANSI Class 150 Weld Neck Flange 4"',
      category: 'Piping & Flanges',
      unit: 'NOS',
      basePrice: 720.0,
      physical: 150,
      reserved: 0,
    },
    {
      productCode: 'IND-CYL-505',
      productName: 'Double-Acting ISO Standard Pneumatic Cylinder 50x100',
      category: 'Pneumatics',
      unit: 'PCS',
      basePrice: 2400.0,
      physical: 80,
      reserved: 0,
    },
    {
      productCode: 'IND-FST-606',
      productName: 'Grade 8.8 Galvanized High-Tensile Hex Bolt Fastener Kit',
      category: 'Fasteners & Hardware',
      unit: 'SET',
      basePrice: 350.0,
      physical: 300,
      reserved: 0,
    },
  ];

  const createdProducts: any = {};
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        productCode: p.productCode,
        productName: p.productName,
        category: p.category,
        unit: p.unit,
        basePrice: p.basePrice,
        inventory: {
          create: {
            physicalQuantity: p.physical,
            reservedQuantity: p.reserved,
            damagedQuantity: 0,
          },
        },
      },
      include: { inventory: true },
    });
    createdProducts[p.productCode] = product;
    console.log(`Product: ${p.productCode} - Physical: ${p.physical}, Reserved: ${p.reserved}`);
  }

  console.log('--- Seeding Sample Enquiries, Quotations & Sales Orders ---');
  // Enquiry 1: NEW
  const enq1 = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-001',
      customerId: customer1.id,
      requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Urgent requirement for upcoming plant maintenance overhaul in Mumbai.',
      status: 'NEW',
      createdByUserId: salesUser.id,
      items: {
        create: [
          { productId: createdProducts['IND-BRG-101'].id, quantity: 40 },
          { productId: createdProducts['IND-VLV-202'].id, quantity: 15 },
        ],
      },
    },
  });

  // Enquiry 2: QUOTED with Quotation in SENT
  const enq2 = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-002',
      customerId: customer2.id,
      requiredDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: 'Quarterly procurement for Pune assembly facility.',
      status: 'QUOTED',
      createdByUserId: salesUser.id,
      items: {
        create: [
          { productId: createdProducts['IND-PMP-303'].id, quantity: 5 },
          { productId: createdProducts['IND-CYL-505'].id, quantity: 10 },
        ],
      },
    },
  });

  const quote2Subtotal = 5 * 6200.0 + 10 * 2400.0; // 31000 + 24000 = 55000
  const quote2Discount = quote2Subtotal * 0.05; // 5% discount = 2750
  const quote2Taxable = quote2Subtotal - quote2Discount; // 52250
  const quote2Gst = quote2Taxable * 0.18; // 18% GST = 9405
  const quote2GrandTotal = quote2Taxable + quote2Gst; // 61655

  await prisma.quotation.create({
    data: {
      quotationNumber: 'QTN-2026-001',
      enquiryId: enq2.id,
      customerId: customer2.id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: quote2Subtotal,
      discountPercent: 5,
      discountAmount: quote2Discount,
      gstPercent: 18,
      gstAmount: quote2Gst,
      grandTotal: quote2GrandTotal,
      status: 'SENT',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: createdProducts['IND-PMP-303'].id,
            quantity: 5,
            unitPrice: 6200.0,
            discountPercent: 5,
            gstPercent: 18,
            lineAmount: (5 * 6200.0 * 0.95) * 1.18,
          },
          {
            productId: createdProducts['IND-CYL-505'].id,
            quantity: 10,
            unitPrice: 2400.0,
            discountPercent: 5,
            gstPercent: 18,
            lineAmount: (10 * 2400.0 * 0.95) * 1.18,
          },
        ],
      },
    },
  });

  // Enquiry 3: WON with ACCEPTED Quotation and CONFIRMED Sales Order (Stock Reserved)
  const enq3 = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-003',
      customerId: customer3.id,
      requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: 'Immediate supply required for Hyderabad engineering project.',
      status: 'WON',
      createdByUserId: salesUser.id,
      items: {
        create: [
          { productId: createdProducts['IND-FLG-404'].id, quantity: 30 },
          { productId: createdProducts['IND-FST-606'].id, quantity: 50 },
        ],
      },
    },
  });

  const quote3Subtotal = 30 * 720.0 + 50 * 350.0; // 21600 + 17500 = 39100
  const quote3Discount = quote3Subtotal * 0.10; // 10% discount = 3910
  const quote3Taxable = quote3Subtotal - quote3Discount; // 35190
  const quote3Gst = quote3Taxable * 0.18; // 18% GST = 6334.2
  const quote3GrandTotal = quote3Taxable + quote3Gst; // 41524.2

  const quote3 = await prisma.quotation.create({
    data: {
      quotationNumber: 'QTN-2026-002',
      enquiryId: enq3.id,
      customerId: customer3.id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: quote3Subtotal,
      discountPercent: 10,
      discountAmount: quote3Discount,
      gstPercent: 18,
      gstAmount: quote3Gst,
      grandTotal: quote3GrandTotal,
      status: 'ACCEPTED',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: createdProducts['IND-FLG-404'].id,
            quantity: 30,
            unitPrice: 720.0,
            discountPercent: 10,
            gstPercent: 18,
            lineAmount: (30 * 720.0 * 0.90) * 1.18,
          },
          {
            productId: createdProducts['IND-FST-606'].id,
            quantity: 50,
            unitPrice: 350.0,
            discountPercent: 10,
            gstPercent: 18,
            lineAmount: (50 * 350.0 * 0.90) * 1.18,
          },
        ],
      },
    },
  });

  // Sales Order converted from ACCEPTED quotation, now CONFIRMED with stock reserved
  await prisma.salesOrder.create({
    data: {
      orderNumber: 'SO-2026-001',
      quotationId: quote3.id,
      customerId: customer3.id,
      totalAmount: quote3GrandTotal,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
      confirmedByUserId: adminUser.id,
      items: {
        create: [
          {
            productId: createdProducts['IND-FLG-404'].id,
            quantity: 30,
            unitPrice: 720.0,
            lineAmount: (30 * 720.0 * 0.90) * 1.18,
          },
          {
            productId: createdProducts['IND-FST-606'].id,
            quantity: 50,
            unitPrice: 350.0,
            lineAmount: (50 * 350.0 * 0.90) * 1.18,
          },
        ],
      },
    },
  });

  // Reserve stock for IND-FLG-404 (30 units) and IND-FST-606 (50 units)
  await prisma.inventory.update({
    where: { productId: createdProducts['IND-FLG-404'].id },
    data: { reservedQuantity: 30 },
  });
  await prisma.inventory.update({
    where: { productId: createdProducts['IND-FST-606'].id },
    data: { reservedQuantity: 50 },
  });

  console.log('--- Database successfully seeded! ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
