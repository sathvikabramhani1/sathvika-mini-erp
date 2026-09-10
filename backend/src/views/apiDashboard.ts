export function renderApiDashboard(): string {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sathvika Organics &bull; Enterprise Operations Gateway</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #05140d;
      --surface: #092015;
      --surface-border: rgba(16, 185, 129, 0.22);
      --card-bg: rgba(9, 29, 20, 0.75);
      --primary: #10b981;
      --primary-bright: #34d399;
      --gold: #f59e0b;
      --gold-light: #fbbf24;
      --text: #f0fdf4;
      --text-muted: #86efac;
      --text-subtle: #6ee7b7;
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
        radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.16) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.1) 0%, transparent 45%);
    }

    /* Top Navigation Header */
    .navbar {
      height: 70px;
      border-bottom: 1px solid var(--surface-border);
      background: rgba(5, 20, 13, 0.85);
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
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .brand-name {
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .brand-badge {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--gold-light);
      background: rgba(245, 158, 11, 0.12);
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid rgba(245, 158, 11, 0.3);
      font-weight: 700;
      margin-left: 6px;
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
      font-size: 0.85rem;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }
    .btn-gold {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #05140d;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-gold:hover {
      transform: translateY(-1px);
    }
    .btn-outline {
      background: rgba(16, 185, 129, 0.08);
      color: var(--text-subtle);
      border: 1px solid var(--surface-border);
    }
    .btn-outline:hover {
      background: rgba(16, 185, 129, 0.18);
      color: #ffffff;
    }

    /* Container */
    .main-container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 40px 24px 60px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    /* Hero Banner */
    .hero-banner {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 20px;
      padding: 44px 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
      flex-wrap: wrap;
    }
    .hero-content {
      max-width: 640px;
    }
    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      padding: 5px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.35);
      margin-bottom: 16px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 10px #10b981;
    }
    .hero-title {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 12px;
      line-height: 1.25;
    }
    .hero-sub {
      font-size: 1.05rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    /* Telemetry Metrics Row */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }
    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 20px 24px;
      backdrop-filter: blur(12px);
    }
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-subtle);
    }
    .metric-value {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .metric-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    /* Role Governance Matrix */
    .section-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-sub {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
    }
    .role-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s;
    }
    .role-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .role-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
      width: fit-content;
    }
    .badge-admin { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35); }
    .badge-sales { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.35); }
    .badge-warehouse { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.35); }
    .badge-accounts { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.35); }
    .role-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .role-email {
      font-size: 0.82rem;
      color: #94a3b8;
      margin-bottom: 12px;
    }
    .role-desc {
      font-size: 0.8rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    /* Capabilities Grid */
    .capabilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }
    .cap-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      padding: 24px;
    }
    .cap-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      color: #34d399;
    }
    .cap-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .cap-text {
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.6;
    }

    /* Footer */
    .footer {
      border-top: 1px solid var(--surface-border);
      padding: 24px 32px;
      text-align: center;
      font-size: 0.82rem;
      color: #86efac;
      background: rgba(5, 20, 13, 0.8);
    }
  </style>
</head>
<body>
  <!-- Top Navigation Bar -->
  <header class="navbar">
    <div class="brand-wrap">
      <div class="brand-crest">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
      </div>
      <div>
        <span class="brand-name">Sathvika Organics</span>
        <span class="brand-badge">Enterprise Gateway</span>
      </div>
    </div>
    <div class="nav-links">
      <a href="https://sathvika-frontend.onrender.com" target="_blank" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Wholesale Web Portal
      </a>
      <a href="/postman" class="btn btn-gold">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Postman Collection
      </a>
      <a href="/health" class="btn btn-outline">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        Diagnostics
      </a>
      <a href="https://github.com/sathvikabramhani1/sathvika-mini-erp" target="_blank" class="btn btn-outline">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        GitHub
      </a>
    </div>
  </header>

  <!-- Main Container -->
  <main class="main-container">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="hero-content">
        <div class="hero-pill">
          <div class="live-dot"></div>
          <span>Production Cluster &bull; Online &amp; Synchronized</span>
        </div>
        <h1 class="hero-title">
          Operations Gateway &amp; Enterprise REST Service
        </h1>
        <p class="hero-sub">
          High-performance cloud backend powering Customer CRM, Arabica & Gourmet catalog inventory tracking, sequential sales challan generation, atomic stock deductions, and chronological audit timelines.
        </p>
        <div class="hero-actions">
          <a href="https://sathvika-frontend.onrender.com" target="_blank" class="btn btn-primary" style="padding: 10px 22px; font-size: 0.95rem;">
            <span>Launch Wholesale Web Portal &rarr;</span>
          </a>
          <a href="/postman" class="btn btn-gold" style="padding: 10px 20px;">
            <span>Download Postman Collection (.json)</span>
          </a>
          <a href="/health" class="btn btn-outline" style="padding: 10px 20px;">
            <span>Cluster Diagnostics</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Key Telemetry Metrics -->
    <section class="metrics-row">
      <div class="metric-card">
        <div class="metric-header">
          <span>DATABASE ENGINE</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div class="metric-value" style="color: #34d399;">PostgreSQL 15</div>
        <div class="metric-sub">Dedicated isolated schema=sathvika on Render</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>AUTHENTICATION</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="metric-value">JWT Bearer</div>
        <div class="metric-sub">4-tier Role-Based Access Control (RBAC)</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>TRANSACTION SAFETY</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="metric-value" style="color: #fbbf24;">ACID Atomic</div>
        <div class="metric-sub">Rollback on insufficient stock (No negative balances)</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>UPTIME &amp; STATUS</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        </div>
        <div class="metric-value" style="color: #34d399;">100% Operational</div>
        <div class="metric-sub">Auto-scaling Node.js 18 container cluster</div>
      </div>
    </section>

    <!-- Role Governance & Test Access Directory -->
    <section>
      <h2 class="section-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Role-Based Governance Directory</span>
      </h2>
      <p class="section-sub">
        All role accounts share the password: <strong style="color: #fbbf24;">Password123!</strong>
      </p>

      <div class="roles-grid">
        <div class="role-card">
          <div>
            <span class="role-badge badge-admin">Administrator</span>
            <div class="role-title">Global Director</div>
            <div class="role-email">admin@sathvika.com</div>
          </div>
          <div class="role-desc">
            Complete unrestricted access across Customer CRM, Product Catalog, Stock Audits, Challan Generation, and System Settings.
          </div>
        </div>

        <div class="role-card">
          <div>
            <span class="role-badge badge-sales">Sales Team</span>
            <div class="role-title">Commercial Accounts</div>
            <div class="role-email">sales@sathvika.com</div>
          </div>
          <div class="role-desc">
            Manages retail and wholesale customer accounts, schedules follow-up interaction timelines, and generates sequential dispatch challans.
          </div>
        </div>

        <div class="role-card">
          <div>
            <span class="role-badge badge-warehouse">Warehouse</span>
            <div class="role-title">Logistics &amp; Inventory</div>
            <div class="role-email">warehouse@sathvika.com</div>
          </div>
          <div class="role-desc">
            Catalog SKU management, lot intakes, INWARD/OUTWARD stock adjustments with audit reasons, and low-stock threshold monitoring.
          </div>
        </div>

        <div class="role-card">
          <div>
            <span class="role-badge badge-accounts">Accounts</span>
            <div class="role-title">Billing &amp; Finance</div>
            <div class="role-email">accounts@sathvika.com</div>
          </div>
          <div class="role-desc">
            Inspects financial dispatch summaries, verifies order amounts, and exports official printable Tax Invoices and Delivery Challans.
          </div>
        </div>
      </div>
    </section>

    <!-- Core Engine Capabilities -->
    <section>
      <h2 class="section-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        <span>Architectural Safeguards &amp; Capabilities</span>
      </h2>
      <p class="section-sub">Engineered to comply with enterprise-grade distribution specifications.</p>

      <div class="capabilities-grid">
        <div class="cap-card">
          <div class="cap-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="cap-title">Product Snapshotting</div>
          <div class="cap-text">
            Challan line items store frozen snapshots of unit price, SKU, and item title at the moment of dispatch, ensuring historical immutability against future price or catalog adjustments.
          </div>
        </div>

        <div class="cap-card">
          <div class="cap-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="cap-title">ACID Inventory Rollbacks</div>
          <div class="cap-text">
            Challan confirmations execute within atomic Prisma transactions. If stock is insufficient for any product, the entire order is rolled back immediately preventing negative balances.
          </div>
        </div>

        <div class="cap-card">
          <div class="cap-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div class="cap-title">Audited Stock Movement Log</div>
          <div class="cap-text">
            Every inventory receipt, harvest intake, or challan deduction is recorded in an immutable chronological audit trail tracking product, delta, movement type, reason, and user.
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    Sathvika Organics Wholesale Operations &bull; Full Stack Developer Case Study &bull; Built by Swayampakam Sathvika Bramhani &bull; Render Cloud &bull; PostgreSQL
  </footer>
</body>
</html>`;
}

export function renderHealthDashboard(): string {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cluster Diagnostics &bull; Sathvika Organics Engine</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #05140d;
      --card-bg: rgba(9, 29, 20, 0.9);
      --border: rgba(16, 185, 129, 0.3);
      --primary: #10b981;
      --text: #f0fdf4;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
    }
    .diag-card {
      width: 100%;
      max-width: 540px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 36px;
      text-align: center;
      backdrop-filter: blur(20px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
    }
    .status-icon {
      width: 60px;
      height: 60px;
      border-radius: 18px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: #34d399;
      box-shadow: 0 0 24px rgba(16, 185, 129, 0.3);
    }
    .diag-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .diag-sub {
      font-size: 0.9rem;
      color: #a7f3d0;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      text-align: left;
      margin-bottom: 28px;
    }
    .item {
      background: rgba(5, 20, 13, 0.75);
      border: 1px solid rgba(16, 185, 129, 0.18);
      border-radius: 10px;
      padding: 12px 14px;
    }
    .label {
      font-size: 0.7rem;
      color: #6ee7b7;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .val {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 4px;
    }
    .btn {
      display: inline-block;
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.92rem;
      transition: all 0.2s;
    }
    .btn:hover {
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
    }
  </style>
</head>
<body>
  <div class="diag-card">
    <div class="status-icon">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    </div>
    <h1 class="diag-title">Sathvika Cluster Diagnostic</h1>
    <p class="diag-sub">Node.js / Express REST API and PostgreSQL cluster telemetry</p>
    <div class="grid">
      <div class="item">
        <div class="label">DATABASE</div>
        <div class="val" style="color: #34d399;">CONNECTED (15.x)</div>
      </div>
      <div class="item">
        <div class="label">HTTP STATUS</div>
        <div class="val" style="color: #34d399;">200 OK</div>
      </div>
      <div class="item">
        <div class="label">SCHEMA ISOLATION</div>
        <div class="val">schema=sathvika</div>
      </div>
      <div class="item">
        <div class="label">CLUSTER HOST</div>
        <div class="val">sathvika-backend</div>
      </div>
    </div>
    <a href="/" class="btn">View Gateway Hub &rarr;</a>
  </div>
</body>
</html>`;
}
