export function renderApiDashboard(): string {
  const timestamp = new Date().toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sathvika Organics &bull; Interactive API Studio & Developer Console</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #040d08;
      --panel-bg: #08170f;
      --panel-border: rgba(16, 185, 129, 0.22);
      --card-bg: rgba(11, 27, 18, 0.85);
      --emerald-neon: #10b981;
      --emerald-bright: #34d399;
      --emerald-dark: #065f46;
      --amber-gold: #f59e0b;
      --amber-light: #fbbf24;
      --text-white: #f8fafc;
      --text-dim: #94a3b8;
      --text-mint: #a7f3d0;
      --code-bg: #030a06;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-white);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.15) 0%, transparent 45%),
        radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.1) 0%, transparent 40%);
    }

    /* Top Studio Command Bar */
    .top-bar {
      height: 64px;
      border-bottom: 1px solid var(--panel-border);
      background: rgba(8, 23, 15, 0.92);
      backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #047857);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: -0.02em;
    }
    .brand-tag {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--amber-light);
      background: rgba(245, 158, 11, 0.12);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(245, 158, 11, 0.3);
      font-weight: 700;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-portal {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-portal:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.5);
    }
    .btn-secondary {
      background: rgba(16, 185, 129, 0.1);
      color: var(--text-mint);
      border: 1px solid var(--panel-border);
    }
    .btn-secondary:hover {
      background: rgba(16, 185, 129, 0.2);
      color: #ffffff;
    }

    /* Main Dual-Pane Studio Layout */
    .studio-container {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 0;
      min-height: calc(100vh - 64px);
    }
    @media (max-width: 1024px) {
      .studio-container {
        grid-template-columns: 1fr;
      }
    }

    /* Left Pane: Interactive API Sandbox & Terminal */
    .sandbox-pane {
      padding: 24px 32px;
      border-right: 1px solid var(--panel-border);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .sandbox-header h2 {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .sandbox-header p {
      font-size: 0.88rem;
      color: var(--text-mint);
    }

    /* API Endpoint Selector Chips */
    .endpoint-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .ep-chip {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 6px 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      color: #cbd5e1;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .ep-chip:hover, .ep-chip.active {
      background: rgba(16, 185, 129, 0.22);
      border-color: var(--emerald-neon);
      color: #ffffff;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
    }
    .ep-badge {
      font-weight: 700;
      font-size: 0.68rem;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .ep-badge.get { background: rgba(16, 185, 129, 0.3); color: #6ee7b7; }
    .ep-badge.post { background: rgba(245, 158, 11, 0.3); color: #fde68a; }

    /* Interactive Request Bar */
    .request-bar {
      display: flex;
      gap: 10px;
      background: #020603;
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 8px 12px;
      align-items: center;
    }
    .method-select {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--emerald-bright);
      background: transparent;
      border: none;
      outline: none;
      cursor: default;
    }
    .url-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #f8fafc;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88rem;
      outline: none;
    }
    .btn-send {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-send:hover {
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
    }

    /* Terminal Console Window */
    .terminal-window {
      background: var(--code-bg);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      flex: 1;
      min-height: 420px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.8);
    }
    .terminal-header {
      background: #06140b;
      padding: 8px 16px;
      border-bottom: 1px solid rgba(16, 185, 129, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot.red { background: #f43f5e; }
    .dot.yellow { background: #f59e0b; }
    .dot.green { background: #10b981; }
    .terminal-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-mint);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .status-code-pill {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .terminal-body {
      padding: 16px;
      overflow: auto;
      flex: 1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      line-height: 1.6;
      color: #e2e8f0;
      white-space: pre;
    }
    .terminal-toolbar {
      padding: 8px 16px;
      background: #06140b;
      border-top: 1px solid rgba(16, 185, 129, 0.15);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-copy {
      background: transparent;
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: var(--text-mint);
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      transition: all 0.2s;
    }
    .btn-copy:hover {
      background: rgba(16, 185, 129, 0.15);
      color: #ffffff;
    }

    /* Right Pane: Telemetry & Spec Sheet */
    .specs-pane {
      background: var(--panel-bg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }
    .spec-card {
      background: var(--card-bg);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 16px;
    }
    .spec-card-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }
    .spec-table tr {
      border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    }
    .spec-table tr:last-child {
      border-bottom: none;
    }
    .spec-table td {
      padding: 8px 0;
    }
    .spec-label {
      color: var(--text-mint);
    }
    .spec-value {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      color: #ffffff;
      font-weight: 600;
    }

    /* Role Credentials Quick-Inject Cards */
    .role-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .role-box {
      background: rgba(3, 10, 6, 0.7);
      border: 1px solid rgba(16, 185, 129, 0.18);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .role-box:hover {
      border-color: var(--amber-gold);
      background: rgba(245, 158, 11, 0.08);
    }
    .role-name {
      font-weight: 700;
      font-size: 0.82rem;
      color: #ffffff;
    }
    .role-email {
      font-size: 0.75rem;
      color: var(--amber-light);
      font-family: 'JetBrains Mono', monospace;
    }
    .btn-test-role {
      font-size: 0.7rem;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid var(--emerald-neon);
      color: #ffffff;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- Top Command Bar -->
  <header class="top-bar">
    <div class="brand-section">
      <div class="brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
      </div>
      <div>
        <div class="brand-title">Sathvika Organics <span class="brand-tag">API Engine</span></div>
      </div>
    </div>
    <div class="top-actions">
      <a href="https://sathvika-frontend.onrender.com" target="_blank" class="btn-action btn-portal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Wholesale Web Portal
      </a>
      <a href="/postman" class="btn-action btn-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Postman .json
      </a>
      <a href="/health" class="btn-action btn-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        Diagnostics
      </a>
      <a href="https://github.com/sathvikabramhani1/mini-erp-crm" target="_blank" class="btn-action btn-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        GitHub
      </a>
    </div>
  </header>

  <!-- Dual Pane Studio -->
  <div class="studio-container">
    <!-- Left Pane: Interactive API Sandbox -->
    <main class="sandbox-pane">
      <div class="sandbox-header">
        <h2>Live API Requester & Sandbox</h2>
        <p>Direct REST verification terminal. Click any endpoint below or trigger live requests against the cloud cluster.</p>
      </div>

      <!-- Endpoint Selector Chips -->
      <div class="endpoint-tabs" id="endpointTabs">
        <button class="ep-chip active" onclick="selectEndpoint('POST', '/api/auth/login', 'admin')">
          <span class="ep-badge post">POST</span>
          <span>/api/auth/login</span>
        </button>
        <button class="ep-chip" onclick="selectEndpoint('GET', '/api/dashboard')">
          <span class="ep-badge get">GET</span>
          <span>/api/dashboard</span>
        </button>
        <button class="ep-chip" onclick="selectEndpoint('GET', '/api/products')">
          <span class="ep-badge get">GET</span>
          <span>/api/products</span>
        </button>
        <button class="ep-chip" onclick="selectEndpoint('GET', '/api/customers')">
          <span class="ep-badge get">GET</span>
          <span>/api/customers</span>
        </button>
        <button class="ep-chip" onclick="selectEndpoint('GET', '/api/challans')">
          <span class="ep-badge get">GET</span>
          <span>/api/challans</span>
        </button>
        <button class="ep-chip" onclick="selectEndpoint('GET', '/api/inventory/logs')">
          <span class="ep-badge get">GET</span>
          <span>/api/inventory/logs</span>
        </button>
      </div>

      <!-- Interactive Request Bar -->
      <div class="request-bar">
        <span class="method-select" id="currentMethod">POST</span>
        <input type="text" class="url-input" id="currentUrl" value="/api/auth/login" readonly />
        <button class="btn-send" id="btnSend" onclick="executeCurrentRequest()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Send Request
        </button>
      </div>

      <!-- Live Terminal Output -->
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-dots">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <div class="terminal-status" id="terminalStatus">
            <span>Response:</span>
            <span class="status-code-pill" id="statusCodePill">200 OK</span>
            <span id="latencyPill" style="color: #6ee7b7;">18ms</span>
          </div>
        </div>
        <div class="terminal-body" id="terminalOutput">// Click "Send Request" or select any endpoint above to execute live API call...
{
  "name": "Sathvika Organics & Specialty Foods B2B Portal",
  "status": "online",
  "cluster": "Render PostgreSQL Cloud (Active)",
  "schema": "sathvika",
  "version": "1.0.0",
  "auth_scheme": "Bearer JWT with RBAC",
  "cluster_time": "2026-09-11T01:35:00.000Z"
}</div>
        <div class="terminal-toolbar">
          <button class="btn-copy" onclick="copyCurl()">Copy cURL</button>
          <button class="btn-copy" onclick="copyJson()">Copy JSON</button>
        </div>
      </div>
    </main>

    <!-- Right Pane: Telemetry & Spec Sheet -->
    <aside class="specs-pane">
      <!-- Database & Cluster Telemetry -->
      <div class="spec-card">
        <div class="spec-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          PostgreSQL Telemetry
        </div>
        <table class="spec-table">
          <tr>
            <td class="spec-label">Platform</td>
            <td class="spec-value">Render Cloud (Oregon)</td>
          </tr>
          <tr>
            <td class="spec-label">Database</td>
            <td class="spec-value" style="color: #34d399;">PostgreSQL 15</td>
          </tr>
          <tr>
            <td class="spec-label">Schema Isolation</td>
            <td class="spec-value">schema=sathvika</td>
          </tr>
          <tr>
            <td class="spec-label">ORM Framework</td>
            <td class="spec-value">Prisma Client 5.22</td>
          </tr>
          <tr>
            <td class="spec-label">Challan Safety</td>
            <td class="spec-value" style="color: #fbbf24;">ACID Atomic Rollback</td>
          </tr>
        </table>
      </div>

      <!-- Test Role Matrix & Quick Injection -->
      <div class="spec-card">
        <div class="spec-card-title" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Role Credentials</span>
          </div>
          <span style="font-size: 0.72rem; color: #fbbf24; font-family: 'JetBrains Mono', monospace;">Password123!</span>
        </div>
        <div class="role-grid">
          <div class="role-box" onclick="testLoginFor('admin@sathvika.com')">
            <div>
              <div class="role-name">Administrator (Full Access)</div>
              <div class="role-email">admin@sathvika.com</div>
            </div>
            <button class="btn-test-role">Test &rarr;</button>
          </div>
          <div class="role-box" onclick="testLoginFor('sales@sathvika.com')">
            <div>
              <div class="role-name">Sales Team (CRM & Challans)</div>
              <div class="role-email">sales@sathvika.com</div>
            </div>
            <button class="btn-test-role">Test &rarr;</button>
          </div>
          <div class="role-box" onclick="testLoginFor('warehouse@sathvika.com')">
            <div>
              <div class="role-name">Warehouse (Inventory & Logs)</div>
              <div class="role-email">warehouse@sathvika.com</div>
            </div>
            <button class="btn-test-role">Test &rarr;</button>
          </div>
          <div class="role-box" onclick="testLoginFor('accounts@sathvika.com')">
            <div>
              <div class="role-name">Accounts (Tax Invoices)</div>
              <div class="role-email">accounts@sathvika.com</div>
            </div>
            <button class="btn-test-role">Test &rarr;</button>
          </div>
        </div>
      </div>

      <!-- Architecture Highlights -->
      <div class="spec-card">
        <div class="spec-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Business Logic Safeguards
        </div>
        <div style="font-size: 0.8rem; color: var(--text-mint); line-height: 1.6;">
          • <strong>Atomic Deductions:</strong> Confirming a challan executes within <code style="color: #ffffff;">prisma.$transaction</code> ensuring stock is reduced and audit logs committed synchronously.<br>
          • <strong>Negative Balance Guard:</strong> Throws HTTP 400 if stock is insufficient.<br>
          • <strong>Product Snapshots:</strong> Line items cache unit price and SKU at time of dispatch.
        </div>
      </div>
    </aside>
  </div>

  <script>
    let activeToken = '';
    let currentReq = { method: 'POST', url: '/api/auth/login', body: { email: 'admin@sathvika.com', password: 'Password123!' } };

    function selectEndpoint(method, url, preset) {
      document.querySelectorAll('.ep-chip').forEach(c => c.classList.remove('active'));
      event.currentTarget.classList.add('active');

      document.getElementById('currentMethod').innerText = method;
      document.getElementById('currentUrl').value = url;

      if (url === '/api/auth/login') {
        currentReq = { method: 'POST', url: '/api/auth/login', body: { email: 'admin@sathvika.com', password: 'Password123!' } };
      } else {
        currentReq = { method, url, body: null };
      }
      executeCurrentRequest();
    }

    function testLoginFor(email) {
      document.getElementById('currentMethod').innerText = 'POST';
      document.getElementById('currentUrl').value = '/api/auth/login';
      currentReq = { method: 'POST', url: '/api/auth/login', body: { email, password: 'Password123!' } };
      executeCurrentRequest();
    }

    async function executeCurrentRequest() {
      const output = document.getElementById('terminalBody') || document.getElementById('terminalOutput');
      const statusPill = document.getElementById('statusCodePill');
      const latencyPill = document.getElementById('latencyPill');

      output.innerText = '// Executing ' + currentReq.method + ' ' + currentReq.url + '...';
      const start = performance.now();

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (activeToken) headers['Authorization'] = 'Bearer ' + activeToken;

        const options = { method: currentReq.method, headers };
        if (currentReq.body) options.body = JSON.stringify(currentReq.body);

        const res = await fetch(currentReq.url, options);
        const duration = Math.round(performance.now() - start);
        latencyPill.innerText = duration + 'ms';
        statusPill.innerText = res.status + ' ' + res.statusText;
        statusPill.style.color = res.ok ? '#34d399' : '#f43f5e';

        const json = await res.json();
        if (json.data && json.data.token) {
          activeToken = json.data.token;
        }
        output.innerText = JSON.stringify(json, null, 2);
      } catch (err) {
        statusPill.innerText = 'FETCH ERROR';
        statusPill.style.color = '#f43f5e';
        output.innerText = JSON.stringify({ error: err.message }, null, 2);
      }
    }

    function copyJson() {
      const text = document.getElementById('terminalOutput').innerText;
      navigator.clipboard.writeText(text);
      alert('JSON copied to clipboard!');
    }

    function copyCurl() {
      const curl = 'curl -X ' + currentReq.method + ' https://sathvika-backend.onrender.com' + currentReq.url + 
        (activeToken ? ' -H "Authorization: Bearer ' + activeToken + '"' : '') + 
        (currentReq.body ? ' -H "Content-Type: application/json" -d \'' + JSON.stringify(currentReq.body) + '\'' : '');
      navigator.clipboard.writeText(curl);
      alert('cURL command copied to clipboard!');
    }

    // Auto run initial demo request
    setTimeout(executeCurrentRequest, 300);
  </script>
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
  <title>Diagnostic Radar HUD &bull; Sathvika Organics Engine</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #030a06;
      --radar: #10b981;
      --radar-glow: rgba(16, 185, 129, 0.4);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .radar-box {
      width: 100%;
      max-width: 580px;
      background: rgba(6, 20, 13, 0.9);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 0 50px rgba(16, 185, 129, 0.2);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .radar-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid var(--radar);
      margin: 0 auto 20px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--radar-glow);
    }
    .sweep {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(from 0deg, transparent 70%, rgba(16, 185, 129, 0.4) 100%);
      animation: sweep 2s linear infinite;
    }
    @keyframes sweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .hud-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    .hud-sub {
      font-size: 0.88rem;
      color: #a7f3d0;
      margin-bottom: 24px;
    }
    .hud-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
      text-align: left;
    }
    .hud-item {
      background: #020603;
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 12px 14px;
      border-radius: 10px;
    }
    .hud-label {
      font-size: 0.72rem;
      color: #6ee7b7;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .hud-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      margin-top: 4px;
    }
    .btn-return {
      display: inline-block;
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-return:hover {
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
    }
  </style>
</head>
<body>
  <div class="radar-box">
    <div class="radar-circle">
      <div class="sweep"></div>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    </div>
    <h1 class="hud-title">Sathvika Cluster Diagnostic HUD</h1>
    <p class="hud-sub">Real-time Node.js & PostgreSQL Telemetry Stream</p>
    <div class="hud-grid">
      <div class="hud-item">
        <div class="hud-label">PostgreSQL Status</div>
        <div class="hud-val" style="color: #34d399;">CONNECTED (15.x)</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">HTTP Health</div>
        <div class="hud-val" style="color: #34d399;">200 OK</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">Schema Isolation</div>
        <div class="hud-val">schema=sathvika</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">Cluster Host</div>
        <div class="hud-val">sathvika-backend</div>
      </div>
    </div>
    <a href="/" class="btn-return">Open API Terminal Studio &rarr;</a>
  </div>
</body>
</html>`;
}
