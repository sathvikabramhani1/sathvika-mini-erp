# SathvikaOps - Mini ERP & CRM Operations Portal

> **Full Stack Operations Suite**: Wholesale & Distribution Operations Suite  
> Built with Node.js, Express, TypeScript, SQLite / PostgreSQL (Prisma ORM), React (Vite), and RBAC (Role-Based Access Control).

---

## Executive Summary & Highlights

**SathvikaOps** is an enterprise-grade portal tailored for wholesale and distribution operations managing high-throughput inventory, tiered customer relationships, warehouse fulfillment, and sales challans.

- **Role-Based Access Control (RBAC)**: 4 tailored roles (**Admin**, **Sales**, **Warehouse**, **Accounts**).
- **Interactive Role Switcher**: 1-Click quick role switcher bar at the top of the app header for instant testing and evaluation.
- **Customer CRM**: Multi-tier categorization (`Retail`, `Wholesale`, `Distributor`), status tracking (`Lead`, `Active`, `Inactive`), GST registration numbers, follow-up date scheduling, and chronological interaction timeline.
- **Inventory & Warehouse**: Real-time SKU catalog, low-stock threshold alert system, and manual inward/outward adjustments with audit trails.
- **Sales Challan Business Logic**:
  - Auto-generated sequential identifiers (`CH-YYYYMM-XXXX`).
  - Immutability: Product snapshot caching (name, SKU, unit price at time of order).
  - Atomic stock deductions upon confirmation using ACID database transactions.
  - Negative-stock prevention with clear error diagnostics.
  - Instant print & exportable Tax Invoice / Delivery Challan.
- **Dual Database Portability**: Runs zero-config out-of-the-box on SQLite (`dev.db`), with production PostgreSQL schema and Docker Compose ready for deployment.

---

## Test Login Credentials (All 4 Roles)

All demo accounts share the password: **`Password123!`**

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sathvika.com` | `Password123!` | Unrestricted full access across CRM, Products, Logs, Challans, and Users |
| **Sales** | `sales@sathvika.com` | `Password123!` | Manage Customers, schedule follow-ups, create Sales Challans (Draft/Confirmed) |
| **Warehouse** | `warehouse@sathvika.com` | `Password123!` | Manage Product SKUs, execute Stock IN/OUT adjustments, monitor low stock |
| **Accounts** | `accounts@sathvika.com` | `Password123!` | Inspect Challan financial totals, export/print Tax Invoices, verify billing |

> **Quick Switcher Tip**: In the top header bar, click on any role pill (**Admin**, **Sales**, **Warehouse**, **Accounts**) to instantly switch session context without manual re-typing!

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
│   │   ├── views/              # Rich interactive API Dashboard & Health monitors
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Active schema (SQLite zero-friction local mode)
│   │   ├── schema.postgresql.prisma # Production PostgreSQL schema
│   │   └── seed.ts             # Realistic wholesale seed dataset
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/layout/  # Sidebar with SathvikaOps branding, Header with RoleSwitcher
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Dashboard, Customers, Products, StockLogs, Challans, Login
│   │   ├── services/api.ts     # Typed fetch client with JWT interceptor
│   │   ├── types.ts            # Data models matching backend DTOs
│   │   └── index.css           # Modern violet-indigo enterprise design system
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # PostgreSQL 15 + Backend + Frontend
├── sathvika-erp-crm.postman_collection.json # Complete API collection
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
- Rich API Dashboard available at `http://localhost:5000`
- Health check available at `http://localhost:5000/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend portal will run on `http://localhost:5173`

---

## Docker Compose Quickstart (Full Stack)

```bash
docker-compose up --build
```
- Frontend Web Portal: `http://localhost:3000`
- Backend REST API: `http://localhost:5000`
- PostgreSQL 15: `localhost:5432`
