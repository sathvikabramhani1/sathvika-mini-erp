# Sathvika Organics - Specialty Foods & B2B Distribution Suite

> **Full Stack B2B Operations Suite**: Specialty Foods, Gourmet Beverages & Agro-Commodities Wholesale Operations  
> Built with Node.js, Express, TypeScript, PostgreSQL / SQLite (Prisma ORM), React (Vite), and RBAC (Role-Based Access Control).  
> 
> **Live 24/7 Production Deployment**:
> - **Frontend Web Portal (UI)**: [https://sathvika-frontend.onrender.com](https://sathvika-frontend.onrender.com)
> - **Backend API Service**: [https://sathvika-backend.onrender.com](https://sathvika-backend.onrender.com)
> - **Backend Health Check**: [https://sathvika-backend.onrender.com/health](https://sathvika-backend.onrender.com/health)
> - **GitHub Repository**: [https://github.com/sathvikabramhani1/mini-erp-crm](https://github.com/sathvikabramhani1/mini-erp-crm)

---

## Executive Summary & Highlights

**Sathvika Organics** is an enterprise-grade distribution operations suite designed for regional wholesale merchants, gourmet food exporters, and specialty co-operatives managing high-throughput food lot inventory, tiered supermarket accounts, warehouse harvest intake, and serialized dispatch challans.

- **Studio Top-Navigation Layout**: Clean, full-width studio top navigation bar without bulky sidebars for enhanced readability and modern workflow.
- **Emerald Jade & Champagne Gold Aesthetic**: Custom luxury theme designed specifically for organic and specialty gourmet commodities.
- **Role-Based Access Control (RBAC)**: 4 tailored roles (**Admin**, **Sales Specialist**, **Warehouse Lead**, **Accounts Auditor**).
- **1-Click Quick Role Switcher**: Instant role switching bar at the top of the app header for seamless evaluator testing.
- **Specialty Client CRM**: Tiered accounts (`Distributor 18% Off`, `Wholesale 10% Off`, `Retail Standard`), GSTIN verification, follow-up scheduler, and timeline logs.
- **Lot Inventory & Harvest Catalog**: Real-time tracking of single-origin Arabica coffee, A2 Vedic Gir cow ghee, cold-pressed almond oil, and Kashmiri saffron with low-stock alert thresholds.
- **Dispatch Challan Engine**:
  - Auto-generated sequential identifiers (`SAT-2026-8001`, `SAT-2026-8002`, etc.).
  - Atomic stock deductions upon confirmation using ACID database transactions.
  - Negative-stock prevention with descriptive API diagnostics.
  - Printable Tax Invoices & Goods Delivery Challans with verification stamps.
- **One-Click CSV Export**: Instant spreadsheet downloads across Products, Client CRM, Dispatch Challans, and Audit Logs.

---

## Test Login Credentials (All 4 Roles)

All demo accounts share the password: **`Password123!`**

| Role | Email | Password | Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sathvika.com` | `Password123!` | Unrestricted full access across CRM, Products, Logs, Challans, and Users |
| **Sales** | `sales@sathvika.com` | `Password123!` | Manage Client Accounts, schedule follow-ups, create Dispatch Challans |
| **Warehouse** | `warehouse@sathvika.com` | `Password123!` | Manage Organic SKUs, execute Stock IN/OUT harvest adjustments, monitor alerts |
| **Accounts** | `accounts@sathvika.com` | `Password123!` | Inspect Challan financial totals, export/print Tax Invoices, verify billing |

> **Evaluator Tip**: In the top header bar of the live web portal, click on any role pill (**Admin**, **Sales**, **Warehouse**, **Accounts**) to instantly switch session context without manual re-typing!

---

## Architecture & Project Structure

```
sathvika/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment configuration
│   │   ├── controllers/        # Auth, Customers, Products, Challans, Inventory, Dashboard
│   │   ├── middleware/         # JWT Auth, RBAC, Zod Validation, Central Error Handler
│   │   ├── routes/             # REST Route mappings
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── views/              # Live API Dashboard
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Active schema (SQLite zero-friction local mode)
│   │   ├── schema.postgresql.prisma # Production PostgreSQL schema
│   │   └── seed.ts             # Sathvika Organics specialty gourmet dataset
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/layout/  # Studio Top-Navigation Header
│   │   ├── components/         # CommandPalette (Ctrl+K)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Dashboard, Customers, Products, StockLogs, Challans, Login
│   │   ├── services/api.ts     # Typed fetch client with JWT interceptor
│   │   ├── types.ts            # Data models matching backend DTOs
│   │   └── index.css           # Emerald Jade & Champagne Gold Design System
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # PostgreSQL 15 + Backend + Frontend
└── README.md
```

---

## Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```
- Backend API will run on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend portal will run on `http://localhost:5173`
