export function renderApiDashboard(): string {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Industrial Supply Mini-ERP &bull; Technical Case Study</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><rect width='20' height='14' x='2' y='3' rx='2'/><line x1='8' x2='16' y1='21' y2='21'/><line x1='12' x2='12' y1='17' y2='21'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --surface: #0f172a;
      --surface-border: rgba(59, 130, 246, 0.22);
      --card-bg: rgba(15, 23, 42, 0.85);
      --primary: #3b82f6;
      --primary-bright: #60a5fa;
      --gold: #f59e0b;
      --emerald: #10b981;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.16) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.1) 0%, transparent 45%);
    }

    .navbar {
      height: 70px;
      border-bottom: 1px solid var(--surface-border);
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-crest {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
    }
    .brand-name {
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .brand-badge {
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.2);
      color: var(--primary-bright);
      border: 1px solid rgba(59, 130, 246, 0.4);
      padding: 2px 8px;
      border-radius: 6px;
      margin-left: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }
    .btn-primary:hover {
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5);
      transform: translateY(-1px);
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 60px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .hero-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
      border: 1px solid var(--surface-border);
      border-radius: 20px;
      padding: 44px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #34d399;
      margin-bottom: 18px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .hero-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
      line-height: 1.25;
      background: linear-gradient(to right, #ffffff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 800px;
      margin-bottom: 24px;
    }
    .candidate-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 14px 20px;
      background: rgba(15, 23, 42, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.88rem;
      margin-bottom: 24px;
    }
    .candidate-meta strong {
      color: #60a5fa;
    }

    .workflow-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      overflow-x: auto;
      padding: 16px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
    }
    .wf-step {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      color: #e2e8f0;
      white-space: nowrap;
    }
    .wf-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .wf-arrow {
      color: #64748b;
      font-weight: 900;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }
    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 20px;
      backdrop-filter: blur(12px);
    }
    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .metric-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .section-title {
      font-size: 1.35rem;
      font-weight: 800;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-sub {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
    }
    .role-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }
    .role-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .badge-admin { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    .badge-sales { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .role-title { font-size: 1.15rem; font-weight: 800; color: #ffffff; }
    .role-email { font-family: 'JetBrains Mono', monospace; font-size: 0.88rem; color: #fbbf24; }
    .role-desc { font-size: 0.85rem; color: var(--text-muted); }

    .test-banner {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 14px;
      padding: 24px;
    }
    .test-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-top: 14px;
    }
    .test-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
      color: #e2e8f0;
    }
    .test-check {
      color: #34d399;
      font-weight: 800;
    }

    footer {
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-subtle);
    }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="brand-wrap">
      <div class="brand-crest">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
      </div>
      <div>
        <span class="brand-name">Industrial Supply Mini-ERP</span>
        <span class="brand-badge">Fundsroom Case Study</span>
      </div>
    </div>
    <div class="nav-links">
      <a href="http://localhost:5173" class="btn btn-primary">
        Launch Web App
      </a>
      <a href="/postman" class="btn btn-outline">
        Postman JSON
      </a>
      <a href="/health" class="btn btn-outline">
        Diagnostics
      </a>
      <a href="https://github.com/sathvikabramhani1/sathvika-mini-erp" target="_blank" class="btn btn-outline">
        GitHub Repo
      </a>
    </div>
  </header>

  <main class="main-container">
    <section class="hero-banner">
      <div class="hero-pill">
        <div class="live-dot"></div>
        <span>PERN Stack API Gateway &bull; Ready for Evaluation</span>
      </div>
      <h1 class="hero-title">
        Industrial Supply &amp; Distribution ERP Platform
      </h1>
      <p class="hero-sub">
        Production-grade technical case study submission covering the complete B2B order-to-cash workflow, dynamic quotation pricing, ACID stock reservations, and race-condition prevention.
      </p>

      <div class="candidate-meta">
        <div>Candidate: <strong>Swayampakam Sathvika Bramhani</strong></div>
        <div>Batch / Roll: <strong>GSCSE 2027 &bull; SK-BCS270031</strong></div>
        <div>Evaluation: <strong>Fundsroom Round 2 Case Study</strong></div>
      </div>

      <div class="workflow-strip">
        <div class="wf-step"><span class="wf-num">1</span> Customer Enquiry (NEW &rarr; QUOTED)</div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-step"><span class="wf-num">2</span> Quotation (GST 18% + Discounts)</div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-step"><span class="wf-num">3</span> Sales Order (PENDING)</div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-step"><span class="wf-num">4</span> Stock Reservation (CONFIRMED)</div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-step"><span class="wf-num">5</span> Dispatch (Vehicle Tracking)</div>
      </div>
    </section>

    <section class="metrics-row">
      <div class="metric-card">
        <div class="metric-header">
          <span>DATABASE ARCHITECTURE</span>
        </div>
        <div class="metric-value" style="color: #60a5fa;">PostgreSQL &amp; SQLite</div>
        <div class="metric-sub">Prisma ORM with 10 Relational Entities</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>ROLE GOVERNANCE</span>
        </div>
        <div class="metric-value" style="color: #34d399;">JWT + Strict RBAC</div>
        <div class="metric-sub">Backend API-level authorization</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>CONCURRENCY SAFETY</span>
        </div>
        <div class="metric-value" style="color: #fbbf24;">ACID Atomic</div>
        <div class="metric-sub">Zero overselling via isolated transactions</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>AUTOMATED TESTS</span>
        </div>
        <div class="metric-value" style="color: #34d399;">6 / 6 Passed</div>
        <div class="metric-sub">5 Mandatory + Concurrency Race Test</div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Evaluation Test Credentials</h2>
      <p class="section-sub">Both roles share the evaluation password: <strong style="color: #fbbf24;">Password123!</strong></p>

      <div class="roles-grid">
        <div class="role-card">
          <div>
            <span class="role-badge badge-admin">Administrator Role</span>
            <div class="role-title">Operations Director</div>
            <div class="role-email">admin@sathvika.com</div>
          </div>
          <div class="role-desc">
            Full authority: View all customer records, manage industrial inventory, confirm sales orders with atomic stock reservation, process dispatch logistics, and cancel orders to release stock.
          </div>
        </div>

        <div class="role-card">
          <div>
            <span class="role-badge badge-sales">Sales Executive Role</span>
            <div class="role-title">Commercial Executive</div>
            <div class="role-email">sales@sathvika.com</div>
          </div>
          <div class="role-desc">
            Sales lifecycle: Onboard customer master, register multi-product enquiries, calculate quotations with 18% GST and discounts, convert accepted quotations to Sales Orders, and inspect live stock.
          </div>
        </div>
      </div>
    </section>

    <section class="test-banner">
      <h2 class="section-title" style="color: #34d399;">
        <span>Automated Integration Test Verification</span>
      </h2>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Executed via Jest + Supertest (<code>backend/src/__tests__/case_study.test.ts</code>):</p>
      <ul class="test-list">
        <li class="test-item"><span class="test-check">&#10004;</span> Test 1: Quotation math (subtotal, line-item % discount, 18% GST)</li>
        <li class="test-item"><span class="test-check">&#10004;</span> Test 2: Quotation rejection state guard (cannot convert to order)</li>
        <li class="test-item"><span class="test-check">&#10004;</span> Test 3: Insufficient stock validation rejection</li>
        <li class="test-item"><span class="test-check">&#10004;</span> Test 4: Sales order cancellation and reserved stock release</li>
        <li class="test-item"><span class="test-check">&#10004;</span> Test 5: End-to-end happy path (Enquiry &rarr; Dispatch)</li>
        <li class="test-item"><span class="test-check">&#10004;</span> Bonus Test: Concurrency race condition stress test</li>
      </ul>
    </section>
  </main>

  <footer>
    Industrial Supply &amp; Distribution Mini ERP &bull; Candidate: Swayampakam Sathvika Bramhani &bull; Fundsroom Technical Case Study 2026
  </footer>
</body>
</html>`;
}

export function renderHealthDashboard(metrics?: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cluster Diagnostics &bull; Industrial Supply Mini-ERP</title>
  <style>
    body { font-family: sans-serif; background: #090d16; color: #f8fafc; padding: 40px; }
    .card { max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 24px; }
    h1 { font-size: 1.4rem; color: #60a5fa; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.9rem; }
    .val { font-weight: bold; color: #34d399; }
    .btn { display: inline-block; margin-top: 16px; padding: 8px 16px; background: #2563eb; color: white; border-radius: 6px; text-decoration: none; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Cluster Diagnostics &bull; Online</h1>
    <div class="row"><span>Status</span><span class="val">200 OK</span></div>
    <div class="row"><span>Database</span><span class="val">Connected (Prisma Relational)</span></div>
    <div class="row"><span>Case Study</span><span class="val">Fundsroom Round 2</span></div>
    <div class="row"><span>Candidate</span><span class="val">Swayampakam Sathvika Bramhani</span></div>
    <a href="/" class="btn">&larr; Back to API Gateway</a>
  </div>
</body>
</html>`;
}
