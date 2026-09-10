import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sathvika Organics B2B Distribution database...');

  // Clean existing records in cascade order
  await prisma.salesChallanItem.deleteMany();
  await prisma.salesChallan.deleteMany();
  await prisma.stockMovementLog.deleteMany();
  await prisma.customerFollowUpNote.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Sathvika Administrator',
      email: 'admin@sathvika.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      name: 'Ananya Deshmukh',
      email: 'sales@sathvika.com',
      passwordHash,
      role: 'SALES',
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      name: 'Karthik Reddy',
      email: 'warehouse@sathvika.com',
      passwordHash,
      role: 'WAREHOUSE',
    },
  });

  const accountsUser = await prisma.user.create({
    data: {
      name: 'Meera Nambiar',
      email: 'accounts@sathvika.com',
      passwordHash,
      role: 'ACCOUNTS',
    },
  });

  console.log('Seeded 4 Sathvika Organics staff members.');

  // 2. Seed Specialty Gourmet & Organic Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Arjun Somani',
      mobile: '+91 98450 11223',
      email: 'arjun@greenleafsupermarts.in',
      businessName: 'GreenLeaf Gourmet Supermarkets Pvt Ltd',
      gstNumber: '29AABCG5512D1Z3',
      customerType: 'DISTRIBUTOR',
      address: 'Plot 45-B, Export Promotion Zone, Whitefield, Bangalore - 560066',
      status: 'ACTIVE',
      followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      notes: 'Premium organic grocery chain across South India. Fortnightly bulk coffee & cold-pressed oil dispatch.',
      followUpNotes: {
        create: [
          {
            note: 'Confirmed Q4 seasonal distribution contract for Single-Origin Arabica and A2 Bilona Ghee.',
            createdByUserId: salesUser.id,
          },
          {
            note: 'Scheduled quarterly dispatch review meeting for Bangalore retail outlets.',
            createdByUserId: salesUser.id,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Srinivas Murthy',
      mobile: '+91 98850 33445',
      email: 'procurement@hyderabadorganic.org',
      businessName: 'Hyderabad Organic Co-Operative Society',
      gstNumber: '36AAACH7789E1Z8',
      customerType: 'WHOLESALE',
      address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034',
      status: 'ACTIVE',
      followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: 'Large cooperative of specialty health outlets. Regular bulk buyer of Quinoa grains and Himalayan Honey.',
      followUpNotes: {
        create: [
          {
            note: 'Negotiated 10% volume discount tier for 50+ sack orders of artisanal flours.',
            createdByUserId: salesUser.id,
          },
        ],
      },
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Farhan Contractor',
      mobile: '+91 98200 66778',
      email: 'farhan@naturespantry.co.in',
      businessName: 'Nature\'s Pantry Artisan Gourmet Stores',
      gstNumber: '27AABCN3344F1Z2',
      customerType: 'RETAIL',
      address: 'Shop 4, Hill Road, Bandra West, Mumbai, Maharashtra - 400050',
      status: 'ACTIVE',
      followUpDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      notes: 'Boutique artisanal foods retailer in Mumbai. High demand for Ceremonial Matcha and Royal Medjool Dates.',
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Devraj Menon',
      mobile: '+91 94430 88990',
      email: 'devraj@bluemountainhospitality.com',
      businessName: 'Blue Mountain Hospitality & Cafes',
      gstNumber: '33AAACB9900G1Z6',
      customerType: 'WHOLESALE',
      address: '18 Club Road, Ooty, The Nilgiris, Tamil Nadu - 643001',
      status: 'ACTIVE',
      followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: 'Luxury resort and specialty cafe chain. Weekly coffee bean intake and Kashmiri saffron requisitions.',
      followUpNotes: {
        create: [
          {
            note: 'Dispatched custom roast sample batch for resort winter dining menu.',
            createdByUserId: salesUser.id,
          },
        ],
      },
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      name: 'Lakshmi Narayanan',
      mobile: '+91 98400 22334',
      email: 'lakshmi@soultreeorganics.in',
      businessName: 'SoulTree Organics & Wellness Hub',
      customerType: 'RETAIL',
      address: '32 Khader Nawaz Khan Road, Nungambakkam, Chennai - 600006',
      status: 'LEAD',
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: 'New wellness store opening in central Chennai. Interested in A2 Ghee and Wildflower Honey trial shipment.',
      followUpNotes: {
        create: [
          {
            note: 'Forwarded B2B wholesale pricing brochure and certification lab reports.',
            createdByUserId: salesUser.id,
          },
        ],
      },
    },
  });

  const customer6 = await prisma.customer.create({
    data: {
      name: 'Vikramaditya Oberoi',
      mobile: '+91 98110 55667',
      email: 'vikram@vedicrootsdelhi.com',
      businessName: 'Vedic Roots Gourmet Provisions',
      gstNumber: '07AABCV1122H1Z1',
      customerType: 'DISTRIBUTOR',
      address: 'Building 14, Okhla Industrial Area Phase III, New Delhi - 110020',
      status: 'ACTIVE',
      followUpDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      notes: 'North India primary distributor. Quarterly dispatch of pink mineral salt and cold-pressed edible oils.',
    },
  });

  console.log('Seeded 6 specialty organic & gourmet accounts.');

  // 3. Seed Organic SKUs
  const p1 = await prisma.product.create({
    data: {
      sku: 'ORG-COF-ARA',
      name: 'Single-Origin Arabica Coffee Beans (1kg)',
      category: 'Gourmet Beverages',
      unitPrice: 1450,
      currentStock: 220,
      minStockAlert: 30,
      location: 'Warehouse Bay A-1',
    },
  });

  const p2 = await prisma.product.create({
    data: {
      sku: 'ORG-OIL-ALM',
      name: 'Cold-Pressed Extra Virgin Almond Oil (500ml)',
      category: 'Oils & Ghee',
      unitPrice: 980,
      currentStock: 180,
      minStockAlert: 25,
      location: 'Warehouse Bay B-2',
    },
  });

  const p3 = await prisma.product.create({
    data: {
      sku: 'ORG-SAF-KSH',
      name: 'Royal Kashmiri Mogra Saffron (10g Tin)',
      category: 'Spices & Herbs',
      unitPrice: 3600,
      currentStock: 35,
      minStockAlert: 10,
      location: 'Vault Safe-01',
    },
  });

  const p4 = await prisma.product.create({
    data: {
      sku: 'ORG-GHE-GIR',
      name: 'Pure A2 Vedic Gir Cow Bilona Ghee (1L)',
      category: 'Oils & Ghee',
      unitPrice: 2100,
      currentStock: 160,
      minStockAlert: 25,
      location: 'Warehouse Bay B-1',
    },
  });

  const p5 = await prisma.product.create({
    data: {
      sku: 'ORG-GRN-QNA',
      name: 'Organic White Quinoa Grain Sacks (25kg)',
      category: 'Grains & Flours',
      unitPrice: 4800,
      currentStock: 75,
      minStockAlert: 15,
      location: 'Warehouse Bay C-3',
    },
  });

  const p6 = await prisma.product.create({
    data: {
      sku: 'ORG-HON-WLD',
      name: 'Himalayan Wild Blossom Organic Honey (1kg)',
      category: 'Specialty Foods',
      unitPrice: 1200,
      currentStock: 250,
      minStockAlert: 35,
      location: 'Warehouse Bay D-1',
    },
  });

  const p7 = await prisma.product.create({
    data: {
      sku: 'ORG-FLR-SPL',
      name: 'Artisanal Stone-Ground Spelt Flour (10kg)',
      category: 'Grains & Flours',
      unitPrice: 1650,
      currentStock: 110,
      minStockAlert: 20,
      location: 'Warehouse Bay C-1',
    },
  });

  const p8 = await prisma.product.create({
    data: {
      sku: 'ORG-BEV-MTC',
      name: 'Organic Ceremonial Grade Matcha (250g)',
      category: 'Gourmet Beverages',
      unitPrice: 2850,
      currentStock: 50,
      minStockAlert: 15,
      location: 'Warehouse Bay A-3',
    },
  });

  const p9 = await prisma.product.create({
    data: {
      sku: 'ORG-SLT-PNK',
      name: 'Himalayan Pink Mineral Rock Salt (50kg Bag)',
      category: 'Spices & Herbs',
      unitPrice: 2250,
      currentStock: 280,
      minStockAlert: 40,
      location: 'Warehouse Bay E-1',
    },
  });

  const p10 = await prisma.product.create({
    data: {
      sku: 'ORG-DRF-MDJ',
      name: 'Premium Royal Medjool Date Boxes (5kg)',
      category: 'Specialty Foods',
      unitPrice: 3400,
      currentStock: 90,
      minStockAlert: 20,
      location: 'Warehouse Bay D-2',
    },
  });

  console.log('Seeded 10 organic SKUs.');

  // 4. Initial Stock Logs
  const products = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
  for (const prod of products) {
    await prisma.stockMovementLog.create({
      data: {
        productId: prod.id,
        quantityChanged: prod.currentStock,
        movementType: 'IN',
        reason: 'Initial harvest intake & B2B warehouse lot verification',
        createdByUserId: warehouseUser.id,
      },
    });
  }

  // 5. Seed Real Sales Challans with SAT-2026-80XX sequential IDs
  // Challan 1: Confirmed
  const ch1 = await prisma.salesChallan.create({
    data: {
      challanNumber: 'SAT-2026-8001',
      customerId: customer1.id,
      totalQuantity: 70,
      totalAmount: 148500,
      status: 'CONFIRMED',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: p1.id,
            productNameSnapshot: p1.name,
            skuSnapshot: p1.sku,
            unitPriceSnapshot: p1.unitPrice,
            quantity: 40,
            subtotal: 58000,
          },
          {
            productId: p4.id,
            productNameSnapshot: p4.name,
            skuSnapshot: p4.sku,
            unitPriceSnapshot: p4.unitPrice,
            quantity: 25,
            subtotal: 52500,
          },
          {
            productId: p3.id,
            productNameSnapshot: p3.name,
            skuSnapshot: p3.sku,
            unitPriceSnapshot: p3.unitPrice,
            quantity: 5,
            subtotal: 38000,
          },
        ],
      },
    },
  });

  // Challan 2: Confirmed
  const ch2 = await prisma.salesChallan.create({
    data: {
      challanNumber: 'SAT-2026-8002',
      customerId: customer2.id,
      totalQuantity: 45,
      totalAmount: 92400,
      status: 'CONFIRMED',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: p5.id,
            productNameSnapshot: p5.name,
            skuSnapshot: p5.sku,
            unitPriceSnapshot: p5.unitPrice,
            quantity: 12,
            subtotal: 57600,
          },
          {
            productId: p6.id,
            productNameSnapshot: p6.name,
            skuSnapshot: p6.sku,
            unitPriceSnapshot: p6.unitPrice,
            quantity: 20,
            subtotal: 24000,
          },
          {
            productId: p2.id,
            productNameSnapshot: p2.name,
            skuSnapshot: p2.sku,
            unitPriceSnapshot: p2.unitPrice,
            quantity: 13,
            subtotal: 10800,
          },
        ],
      },
    },
  });

  // Challan 3: Confirmed
  const ch3 = await prisma.salesChallan.create({
    data: {
      challanNumber: 'SAT-2026-8003',
      customerId: customer4.id,
      totalQuantity: 35,
      totalAmount: 64800,
      status: 'CONFIRMED',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: p1.id,
            productNameSnapshot: p1.name,
            skuSnapshot: p1.sku,
            unitPriceSnapshot: p1.unitPrice,
            quantity: 20,
            subtotal: 29000,
          },
          {
            productId: p7.id,
            productNameSnapshot: p7.name,
            skuSnapshot: p7.sku,
            unitPriceSnapshot: p7.unitPrice,
            quantity: 10,
            subtotal: 16500,
          },
          {
            productId: p9.id,
            productNameSnapshot: p9.name,
            skuSnapshot: p9.sku,
            unitPriceSnapshot: p9.unitPrice,
            quantity: 5,
            subtotal: 19300,
          },
        ],
      },
    },
  });

  // Challan 4: Draft
  const ch4 = await prisma.salesChallan.create({
    data: {
      challanNumber: 'SAT-2026-8004',
      customerId: customer3.id,
      totalQuantity: 15,
      totalAmount: 36500,
      status: 'DRAFT',
      createdByUserId: salesUser.id,
      items: {
        create: [
          {
            productId: p8.id,
            productNameSnapshot: p8.name,
            skuSnapshot: p8.sku,
            unitPriceSnapshot: p8.unitPrice,
            quantity: 8,
            subtotal: 22800,
          },
          {
            productId: p10.id,
            productNameSnapshot: p10.name,
            skuSnapshot: p10.sku,
            unitPriceSnapshot: p10.unitPrice,
            quantity: 7,
            subtotal: 13700,
          },
        ],
      },
    },
  });

  console.log('Seeded 4 Sales Challans (SAT-2026-8001 through 8004) with total revenue ₹3,05,700.');
  console.log('Sathvika Organics database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
