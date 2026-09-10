export function renderApiDashboard(): string {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sathvika Organics Operations Engine &bull; REST API Server</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #05140d;
      --surface: #092015;
      --surface-border: rgba(16, 185, 129, 0.25);
      --card-bg: rgba(9, 29, 20, 0.85);
      --primary: #10b981;
      --primary-hover: #059669;
      --gold: #f59e0b;
      --gold-light: #fbbf24;
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.35);
      --text: #f0fdf4;
      --text-muted: #86efac;
      --text-dim: #6ee7b7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      padding: 2.5rem 1.5rem;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
        radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
    }
    .container {
      max-width: 1040px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .brand-title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .brand-subtitle {
      font-size: 0.85rem;
      color: var(--text-dim);
      font-weight: 500;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 16px var(--success-glow);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #34d399;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .4; transform: scale(0.9); }
    }
    .hero-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 1.25rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
    }
    .hero-card h2 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: #ffffff;
    }
    .hero-card p {
      color: #d1fae5;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      max-width: 800px;
    }
    .action-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 0.6rem;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
    }
    .btn-gold {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0f172a;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(16, 185, 129, 0.1);
      color: #a7f3d0;
      border: 1px solid var(--surface-border);
    }
    .btn-secondary:hover {
      background: rgba(16, 185, 129, 0.2);
      color: #ffffff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 1rem;
      padding: 1.5rem;
    }
    .card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffffff;
    }
    .stat-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(16, 185, 129, 0.12);
    }
    .stat-label {
      color: #a7f3d0;
    }
    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #ffffff;
    }
    .endpoints-card {
      background: var(--card-bg);
      border: 1px solid var(--surface-border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .endpoint-row {
      display: flex;
      align-items: center;
      padding: 0.65rem 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      background: rgba(5, 20, 13, 0.6);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.83rem;
      gap: 0.75rem;
      border: 1px solid rgba(16, 185, 129, 0.1);
    }
    .method {
      padding: 0.2rem 0.5rem;
      border-radius: 0.35rem;
      font-weight: 700;
      font-size: 0.72rem;
      min-width: 58px;
      text-align: center;
    }
    .get { background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .post { background: rgba(245, 158, 11, 0.25); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .put { background: rgba(59, 130, 246, 0.25); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .patch { background: rgba(168, 85, 247, 0.25); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
    .delete { background: rgba(244, 63, 94, 0.25); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.4); }
    .path { color: #f0fdf4; flex: 1; }
    .desc { color: #a7f3d0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; }
    .footer {
      text-align: center;
      font-size: 0.82rem;
      color: #6ee7b7;
      border-top: 1px solid var(--surface-border);
      padding-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="brand">
        <div class="logo-box">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
        </div>
        <div>
          <div class="brand-title">Sathvika Organics &bull; API Server</div>
          <div class="brand-subtitle">Production Operations Backend &bull; Node.js 18 + Express + Prisma ORM</div>
        </div>
      </div>
      <div class="status-badge">
        <div class="status-dot"></div>
        SYSTEM OPERATIONAL &bull; CLUSTER LIVE
      </div>
    </header>

    <div class="hero-card">
      <h2>🌿 Sathvika Organics & Specialty Goods Wholesale Engine</h2>
      <p>
        High-throughput backend powering Customer CRM, Arabica & Gourmet catalog inventory tracking, sequential sales challan generation, atomic stock deductions, and chronological audit timelines.
      </p>
      <div class="action-links">
        <a href="https://sathvika-frontend.onrender.com" target="_blank" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Launch Web Portal (Frontend UI)
        </a>
        <a href="/postman" class="btn btn-gold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Postman Collection
        </a>
        <a href="/health" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Cluster Health Dashboard
        </a>
        <a href="https://github.com/sathvikabramhani1/mini-erp-crm" target="_blank" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub Repository
        </a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Server Infrastructure
        </h3>
        <div class="stat-list">
          <div class="stat-item">
            <span class="stat-label">Hosting Platform</span>
            <span class="stat-value">Render Cloud (Oregon)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Runtime Engine</span>
            <span class="stat-value">Node.js 18 + TypeScript</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Primary Database</span>
            <span class="stat-value" style="color: #34d399;">PostgreSQL 15 (Active)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Authentication Mode</span>
            <span class="stat-value">JWT Bearer (RBAC)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Server Telemetry</span>
            <span class="stat-value">${timestamp.slice(11, 19)} UTC</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Test Login Credentials (@sathvika.com)
        </h3>
        <div class="stat-list">
          <div class="stat-item">
            <span class="stat-label">Default Password</span>
            <span class="stat-value" style="color: #fbbf24;">Password123!</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Admin Role</span>
            <span class="stat-value">admin@sathvika.com</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Sales Role</span>
            <span class="stat-value">sales@sathvika.com</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Warehouse Role</span>
            <span class="stat-value">warehouse@sathvika.com</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Accounts Role</span>
            <span class="stat-value">accounts@sathvika.com</span>
          </div>
        </div>
      </div>
    </div>

    <div class="endpoints-card">
      <h3 style="margin-bottom: 1rem; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        Documented REST API Endpoints
      </h3>

      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/auth/login</span>
        <span class="desc">Authenticate user & issue JWT bearer token</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/auth/me</span>
        <span class="desc">Retrieve authenticated user profile & role</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/customers</span>
        <span class="desc">List customers with search, type & status filters</span>
      </div>
      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/customers</span>
        <span class="desc">Create new wholesale/retail customer profile</span>
      </div>
      <div class="endpoint-row">
        <span class="method put">PUT</span>
        <span class="path">/api/customers/:id</span>
        <span class="desc">Update customer contact & business details</span>
      </div>
      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/customers/:id/notes</span>
        <span class="desc">Append CRM follow-up note with target date</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/products</span>
        <span class="desc">List organic catalog with stock & category filters</span>
      </div>
      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/products</span>
        <span class="desc">Add new organic SKU with alert threshold</span>
      </div>
      <div class="endpoint-row">
        <span class="method put">PUT</span>
        <span class="path">/api/products/:id</span>
        <span class="desc">Update price, location bay, or alert quantity</span>
      </div>
      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/products/:id/adjust-stock</span>
        <span class="desc">Inward/Outward stock movement with audit reason</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/inventory/logs</span>
        <span class="desc">Chronological stock audit trail with user tracking</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/challans</span>
        <span class="desc">List sales challans with status & client filters</span>
      </div>
      <div class="endpoint-row">
        <span class="method post">POST</span>
        <span class="path">/api/challans</span>
        <span class="desc">Generate challan (Draft/Confirmed) with stock deduction</span>
      </div>
      <div class="endpoint-row">
        <span class="method patch">PATCH</span>
        <span class="path">/api/challans/:id/status</span>
        <span class="desc">Confirm or cancel challan with atomic balance check</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/challans/:id/invoice-html</span>
        <span class="desc">Official formatted printable Goods Delivery Tax Invoice</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="path">/api/dashboard</span>
        <span class="desc">Real-time KPI telemetry, revenue, & stock warnings</span>
      </div>
    </div>

    <footer class="footer">
      Sathvika Organics &bull; Mini ERP + CRM Portal &bull; Full Stack Developer Case Study &bull; Built by Swayampakam Sathvika Bramhani
    </footer>
  </div>
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
  <title>Cluster Health &bull; Sathvika Organics Engine</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #05140d;
      --surface: #092015;
      --surface-border: rgba(16, 185, 129, 0.25);
      --primary: #10b981;
      --success: #10b981;
      --text: #f0fdf4;
      --text-muted: #86efac;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
    }
    .card {
      background: rgba(9, 29, 20, 0.88);
      border: 1px solid var(--surface-border);
      border-radius: 1.5rem;
      padding: 2.5rem;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.2);
      text-align: center;
      backdrop-filter: blur(16px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.4);
      margin-bottom: 1.5rem;
    }
    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #34d399;
      box-shadow: 0 0 10px #10b981;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    p {
      color: #a7f3d0;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }
    .metrics {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      text-align: left;
      background: rgba(5, 20, 13, 0.6);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 2rem;
      font-size: 0.88rem;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .metric-label {
      color: #a7f3d0;
    }
    .metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #ffffff;
    }
    .btn {
      display: inline-block;
      width: 100%;
      padding: 0.8rem;
      border-radius: 0.6rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <div class="pulse"></div>
      ALL SYSTEMS GREEN
    </div>
    <h1>Sathvika Operations Cluster</h1>
    <p>Operational Node.js / Express REST API and PostgreSQL cluster are active and healthy.</p>
    <div class="metrics">
      <div class="metric-row">
        <span class="metric-label">Status</span>
        <span class="metric-val" style="color: #34d399;">HEALTHY (200 OK)</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Cluster Timestamp</span>
        <span class="metric-val">${timestamp}</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">PostgreSQL Database</span>
        <span class="metric-val" style="color: #34d399;">CONNECTED</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Service Name</span>
        <span class="metric-val">sathvika-backend</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Platform</span>
        <span class="metric-val">Render Cloud</span>
      </div>
    </div>
    <a href="/" class="btn">View API Operations Dashboard &rarr;</a>
  </div>
</body>
</html>`;
}
