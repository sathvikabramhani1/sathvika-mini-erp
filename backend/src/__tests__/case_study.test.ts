// Add clean process.exit(0) at end
import assert from 'node:assert';
import http from 'http';
import app from '../index';
import { prisma } from '../db/prisma';

let server: http.Server;
let port: number;
let baseUrl: string;

async function request(path: string, options: { method?: string; body?: any; token?: string } = {}) {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, body: json };
}

async function runAllTests() {
  console.log('===============================================================');
  console.log('       PERN TECHNICAL CASE STUDY AUTOMATED TEST SUITE          ');
  console.log('===============================================================');

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      port = address.port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });

  try {
    // 0. Authenticate Admin and Sales Users
    console.log('\n[SETUP] Logging in as Admin and Sales User...');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@sathvika.com', password: 'Password123!' },
    });
    assert.strictEqual(adminLogin.status, 200, 'Admin login should succeed');
    const adminToken = adminLogin.body.data.token;

    const salesLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'sales@sathvika.com', password: 'Password123!' },
    });
    assert.strictEqual(salesLogin.status, 200, 'Sales login should succeed');
    const salesToken = salesLogin.body.data.token;
    console.log('  ✔ Admin & Sales User tokens acquired');

    // Fetch sample customer & products
    const customersRes = await request('/customers', { token: salesToken });
    const customerId = customersRes.body.data[0].id;

    const productsRes = await request('/products', { token: salesToken });
    const products = productsRes.body.data;
    const prod1 = products[0]; // IND-BRG-101 (Base Price 450)
    const prod2 = products[1]; // IND-VLV-202 (Base Price 1850)

    // =========================================================================
    // TEST 1: Quotation total is calculated correctly (including discount & GST)
    // =========================================================================
    console.log('\n[TEST 1] Quotation total is calculated correctly (Discount & GST)...');
    const enqRes = await request('/enquiries', {
      method: 'POST',
      token: salesToken,
      body: {
        customerId,
        requiredDate: new Date(Date.now() + 10 * 86400000).toISOString(),
        items: [
          { productId: prod1.id, quantity: 10 },
          { productId: prod2.id, quantity: 2 },
        ],
      },
    });
    assert.strictEqual(enqRes.status, 201, 'Enquiry should be created');
    const enquiryId = enqRes.body.data.id;

    const quoteRes = await request('/quotations', {
      method: 'POST',
      token: salesToken,
      body: {
        enquiryId,
        customerId,
        discountPercent: 10,
        gstPercent: 18,
        items: [
          { productId: prod1.id, quantity: 10, unitPrice: 450 },
          { productId: prod2.id, quantity: 2, unitPrice: 1850 },
        ],
      },
    });

    assert.strictEqual(quoteRes.status, 201, 'Quotation should be created');
    const qData = quoteRes.body.data;
    assert.strictEqual(qData.subtotal, 8200, 'Subtotal should be 8200');
    assert.strictEqual(qData.discountAmount, 820, 'Discount amount should be 820 (10%)');
    assert.strictEqual(qData.gstAmount, 1328.4, 'GST amount should be 1328.40 (18%)');
    assert.strictEqual(qData.grandTotal, 8708.4, 'Grand total should be 8708.40');
    console.log('  ✔ PASS: Subtotal (8,200), Discount (820), GST (1,328.40), Grand Total (8,708.40) verified correctly.');

    // =========================================================================
    // TEST 2: Rejected / Draft quotation cannot create a Sales Order
    // =========================================================================
    console.log('\n[TEST 2] Rejected / Draft quotation cannot create a Sales Order...');
    const draftConvert = await request(`/quotations/${qData.id}/convert`, {
      method: 'POST',
      token: salesToken,
    });
    assert.strictEqual(draftConvert.status, 400, 'DRAFT quotation conversion should be rejected with 400');
    assert.match(draftConvert.body.error, /ACCEPTED status/i, 'Error message must state ACCEPTED status required');
    console.log('  ✔ DRAFT quotation conversion properly blocked');

    await request(`/quotations/${qData.id}/status`, {
      method: 'PATCH',
      token: salesToken,
      body: { status: 'REJECTED' },
    });

    const rejectedConvert = await request(`/quotations/${qData.id}/convert`, {
      method: 'POST',
      token: salesToken,
    });
    assert.strictEqual(rejectedConvert.status, 400, 'REJECTED quotation conversion should be rejected with 400');
    console.log('  ✔ REJECTED quotation conversion properly blocked');
    console.log('  ✔ PASS: Only ACCEPTED quotations can create a Sales Order.');

    // =========================================================================
    // TEST 3: Same quotation cannot generate duplicate Sales Orders
    // =========================================================================
    console.log('\n[TEST 3] Same quotation cannot generate duplicate Sales Orders...');
    await request(`/quotations/${qData.id}/status`, {
      method: 'PATCH',
      token: salesToken,
      body: { status: 'ACCEPTED' },
    });

    const firstConvert = await request(`/quotations/${qData.id}/convert`, {
      method: 'POST',
      token: salesToken,
    });
    assert.strictEqual(firstConvert.status, 201, 'First conversion must succeed');
    const createdOrder = firstConvert.body.data;
    assert.strictEqual(createdOrder.status, 'PENDING', 'New order must be PENDING');
    console.log(`  ✔ First conversion created Sales Order ${createdOrder.orderNumber}`);

    const secondConvert = await request(`/quotations/${qData.id}/convert`, {
      method: 'POST',
      token: salesToken,
    });
    assert.strictEqual(secondConvert.status, 400, 'Duplicate conversion must be rejected with 400');
    assert.match(secondConvert.body.error, /already been generated|duplicate/i);
    console.log('  ✔ PASS: Duplicate Sales Order creation strictly prevented.');

    // =========================================================================
    // TEST 4: Cannot reserve more than available inventory
    // =========================================================================
    console.log('\n[TEST 4] Cannot reserve more than available inventory...');
    const limitedProdRes = await request('/products', {
      method: 'POST',
      token: adminToken,
      body: {
        productCode: `TEST-LIM-${Date.now()}`,
        productName: 'Limited Stock Hydro Pump',
        category: 'Test',
        unit: 'PCS',
        basePrice: 1000,
        initialPhysicalQuantity: 10,
      },
    });
    const limitedProd = limitedProdRes.body.data;

    const enqOverRes = await request('/enquiries', {
      method: 'POST',
      token: salesToken,
      body: {
        customerId,
        items: [{ productId: limitedProd.id, quantity: 25 }],
      },
    });

    const quoteOverRes = await request('/quotations', {
      method: 'POST',
      token: salesToken,
      body: {
        enquiryId: enqOverRes.body.data.id,
        items: [{ productId: limitedProd.id, quantity: 25, unitPrice: 1000 }],
      },
    });
    const quoteOverId = quoteOverRes.body.data.id;

    await request(`/quotations/${quoteOverId}/status`, {
      method: 'PATCH',
      token: salesToken,
      body: { status: 'ACCEPTED' },
    });
    const orderOverRes = await request(`/quotations/${quoteOverId}/convert`, {
      method: 'POST',
      token: salesToken,
    });
    const orderOverId = orderOverRes.body.data.id;

    const confirmOverRes = await request(`/sales-orders/${orderOverId}/confirm`, {
      method: 'POST',
      token: adminToken,
    });

    assert.strictEqual(confirmOverRes.status, 400, 'Confirmation must fail with 400');
    assert.match(confirmOverRes.body.error, /Cannot reserve more than available inventory/i);

    const invCheck = await prisma.inventory.findUnique({ where: { productId: limitedProd.id } });
    assert.strictEqual(invCheck?.reservedQuantity, 0, 'Reserved quantity must remain 0 after rejected confirmation');
    console.log('  ✔ PASS: Stock check verified. Reservation beyond available quantity blocked.');

    // =========================================================================
    // TEST 5: Unauthorized user cannot perform restricted operation
    // =========================================================================
    console.log('\n[TEST 5] Unauthorized user cannot perform restricted operations (RBAC)...');
    const unauthorizedConfirm = await request(`/sales-orders/${createdOrder.id}/confirm`, {
      method: 'POST',
      token: salesToken,
    });
    assert.strictEqual(unauthorizedConfirm.status, 403, 'Sales user confirming order must return 403 Forbidden');
    assert.match(unauthorizedConfirm.body.error, /Forbidden/i);
    console.log('  ✔ Sales User blocked from confirming sales order (403 Forbidden)');

    const unauthorizedDispatch = await request(`/sales-orders/${createdOrder.id}/dispatch`, {
      method: 'POST',
      token: salesToken,
      body: { vehicleNumber: 'MH-01-AB-1234', driverName: 'Suresh' },
    });
    assert.strictEqual(unauthorizedDispatch.status, 403, 'Sales user dispatching order must return 403 Forbidden');
    assert.match(unauthorizedDispatch.body.error, /Forbidden/i);
    console.log('  ✔ Sales User blocked from dispatching sales order (403 Forbidden)');
    console.log('  ✔ PASS: Role-Based Access Control strictly enforced at backend level.');

    // =========================================================================
    // BONUS TEST: Simultaneous inventory reservations (Concurrency / Race Condition)
    // =========================================================================
    console.log('\n[BONUS TEST] Simultaneous inventory reservations (Concurrency race condition)...');
    const concProdRes = await request('/products', {
      method: 'POST',
      token: adminToken,
      body: {
        productCode: `CONC-PMP-${Date.now()}`,
        productName: 'Concurrent Test Valve',
        category: 'Pumps',
        unit: 'PCS',
        basePrice: 500,
        initialPhysicalQuantity: 100,
      },
    });
    const concProd = concProdRes.body.data;

    const enqARes = await request('/enquiries', {
      method: 'POST',
      token: salesToken,
      body: { customerId, items: [{ productId: concProd.id, quantity: 80 }] },
    });
    const quoteARes = await request('/quotations', {
      method: 'POST',
      token: salesToken,
      body: { enquiryId: enqARes.body.data.id, items: [{ productId: concProd.id, quantity: 80, unitPrice: 500 }] },
    });
    await request(`/quotations/${quoteARes.body.data.id}/status`, { method: 'PATCH', token: salesToken, body: { status: 'ACCEPTED' } });
    const orderARes = await request(`/quotations/${quoteARes.body.data.id}/convert`, { method: 'POST', token: salesToken });
    const orderAId = orderARes.body.data.id;

    const enqBRes = await request('/enquiries', {
      method: 'POST',
      token: salesToken,
      body: { customerId, items: [{ productId: concProd.id, quantity: 50 }] },
    });
    const quoteBRes = await request('/quotations', {
      method: 'POST',
      token: salesToken,
      body: { enquiryId: enqBRes.body.data.id, items: [{ productId: concProd.id, quantity: 50, unitPrice: 500 }] },
    });
    await request(`/quotations/${quoteBRes.body.data.id}/status`, { method: 'PATCH', token: salesToken, body: { status: 'ACCEPTED' } });
    const orderBRes = await request(`/quotations/${quoteBRes.body.data.id}/convert`, { method: 'POST', token: salesToken });
    const orderBId = orderBRes.body.data.id;

    console.log('  Firing simultaneous confirmations: Order A (80 units) & Order B (50 units) on stock of 100...');
    const [resA, resB] = await Promise.all([
      request(`/sales-orders/${orderAId}/confirm`, { method: 'POST', token: adminToken }),
      request(`/sales-orders/${orderBId}/confirm`, { method: 'POST', token: adminToken }),
    ]);

    const successes = [resA, resB].filter((r) => r.status === 200);
    const failures = [resA, resB].filter((r) => r.status === 400);

    assert.strictEqual(successes.length, 1, 'Exactly ONE order confirmation must succeed');
    assert.strictEqual(failures.length, 1, 'Exactly ONE order confirmation must fail due to stock depletion');

    const finalConcInv = await prisma.inventory.findUnique({ where: { productId: concProd.id } });
    assert.ok(
      finalConcInv?.reservedQuantity === 80 || finalConcInv?.reservedQuantity === 50,
      `Reserved quantity must be either 80 or 50, but got ${finalConcInv?.reservedQuantity}`
    );
    console.log(`  ✔ Successfully resolved race condition! One order succeeded, one safely rejected.`);
    console.log(`  ✔ Final reserved stock: ${finalConcInv?.reservedQuantity} / 100 (No over-allocation).`);
    console.log('  ✔ PASS: Database transaction concurrency handling verified.');

    console.log('\n===============================================================');
    console.log('       ALL 5 MANDATORY TESTS + CONCURRENCY BONUS PASSED!      ');
    console.log('===============================================================');

    // Clean exit
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    if (server) server.close();
    await prisma.$disconnect();
    process.exit(1);
  }
}

runAllTests();
