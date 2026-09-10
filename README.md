# Full Stack Developer Case Study
# Project: Mini ERP + CRM Operations Portal

> **Candidate / Developer**: Swayampakam Sathvika Bramhani ([sathvikabramhani1](https://github.com/sathvikabramhani1))  
> **Business Vertical**: Sathvika Organics & Specialty Goods Wholesale Distribution  
> **Tech Stack**: Node.js, Express, TypeScript, PostgreSQL / SQLite (Prisma ORM), React (Vite), Docker, Render Cloud.

---

## 1. GitHub Repository Link
- **Repository URL**: [https://github.com/sathvikabramhani1/sathvika-mini-erp](https://github.com/sathvikabramhani1/sathvika-mini-erp)

---

## 2. Live Frontend URL
- **Production Web Portal**: [https://sathvika-frontend.onrender.com](https://sathvika-frontend.onrender.com)

---

## 3. Live Backend API URL
- **Live REST API Base**: [https://sathvika-backend.onrender.com](https://sathvika-backend.onrender.com)
- **Health Check Endpoint**: [https://sathvika-backend.onrender.com/health](https://sathvika-backend.onrender.com/health)

---

## 4. Test Login Credentials for All Roles

All accounts share the password: **`Password123!`**

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sathvika.com` | `Password123!` | Full unrestricted access across Customer CRM, Products, Logs, Challans, and Users |
| **Sales** | `sales@sathvika.com` | `Password123!` | Manage Customer accounts, schedule follow-ups, create Sales Challans (Draft/Confirmed) |
| **Warehouse** | `warehouse@sathvika.com` | `Password123!` | Manage Product catalog, record Stock Movements (IN/OUT), monitor low stock alerts |
| **Accounts** | `accounts@sathvika.com` | `Password123!` | Inspect financial summaries, export/print Tax Invoices, verify billing totals |

---

## 5. Postman Collection & API Documentation

- **Postman Collection**: Included directly in the repository at `sathvika-erp-crm.postman_collection.json`.
- **Direct Download via API**: [https://sathvika-backend.onrender.com/postman](https://sathvika-backend.onrender.com/postman)
- **Interactive Web API Dashboard**: [https://sathvika-backend.onrender.com](https://sathvika-backend.onrender.com)

### Key REST API Endpoints:
- `POST /api/auth/login` - JWT authentication with role payload
- `GET /api/auth/me` - Current session profile
- `GET /api/customers` - Paginated customer CRM list with search and type filter
- `POST /api/customers` - Add customer record
- `GET /api/customers/:id` - Customer detail with interaction timeline
- `PUT /api/customers/:id` - Update customer details
- `POST /api/customers/:id/notes` - Append follow-up notes to timeline
- `GET /api/products` - Product list with stock and category filters
- `POST /api/products` - Add product SKU
- `PUT /api/products/:id` - Edit product details
- `POST /api/products/:id/adjust-stock` - Atomic stock movement (IN/OUT) with audit reason
- `GET /api/inventory/logs` - Chronological stock movement audit trail
- `GET /api/challans` - Sales challans with customer details
- `POST /api/challans` - Generate sales challan with atomic stock deduction
- `PATCH /api/challans/:id/status` - Transition status (Confirm Draft / Cancel)
- `GET /api/dashboard/stats` - Real-time metrics and alerts

---

## 6. README with Setup and Deployment Instructions

### Local Development Setup:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/sathvikabramhani1/sathvika-mini-erp.git
   cd mini-erp-crm
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   npm run dev
   ```
   - Runs locally on `http://localhost:5000`

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   - Runs locally on `http://localhost:5173`

### Deployment (Render Free Hosting):
- Both frontend and backend are configured with `render.yaml` for zero-friction blueprint deployment.
- **Backend Service**: Node.js runtime, environment variables configured, auto-runs `prisma generate && prisma db push && seed.ts`.
- **Frontend Site**: Static Site on Render with SPA routing (`/* -> /index.html`) and reverse proxy API rewrite.

---

## 7. Short Explanation of Architecture

### Architecture Overview
The application adheres to a decoupled **Client-Server Architecture**:
- **Frontend**: React 18 with TypeScript and Vite. Modular structure with centralized Auth and Toast contexts, reusable layout components, and custom CSS design tokens (Forest Jade & Champagne Gold theme).
- **Backend**: Express.js REST API with TypeScript. Controller-Service-Repository pattern with Zod request validation, JWT authentication middleware, and RBAC authorization guards.
- **Database & Transactions**: Prisma ORM with PostgreSQL (Render) and SQLite (Local).
  - **ACID Transactions**: Challan confirmation wraps order creation, snapshot caching, and inventory deductions in an atomic `prisma.$transaction` block. If any product stock is insufficient, the entire transaction rolls back with a descriptive error message preventing negative inventory.
  - **Product Snapshotting**: Order items store frozen snapshots of unit price, SKU, and product name at the time of dispatch, ensuring immutability against future price or SKU changes.

---

## 8. Known Limitations or Incomplete Parts

While all required core modules, business rules, and bonus features are fully functional, the following enhancements represent future production roadmap items:
1. **Automated Email / SMS Notifications**: Dispatching real-time notifications to customers when a challan transitions to `CONFIRMED`.
2. **Barcode / QR Hardware Scanning**: Native integration with physical warehouse handheld scanners via WebUSB / HID.
3. **Multi-Warehouse Routing**: Advanced logistics routing for organizations managing multiple regional fulfillment hubs.
4. **AWS S3 Image Upload**: Product catalog currently uses SVG and high-resolution icons; direct image upload to S3 can be activated via AWS SDK.
