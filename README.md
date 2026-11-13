# 🏢 Inventra stocks — Portfolio & Operations Portal

---

## 1. Introduction of this project

### 1.1 Overview
**Inventra stocks** is a full-stack **MERN (MongoDB, Express.js, React 19, Node.js)** Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) portal. It empowers businesses to streamline customer relationship pipelines, catalog inventory control, stock movement auditing, and sales challan invoicing.

### 1.2 Purpose
- **Operations Centralization**: Connect customer CRM management with backend warehouse stock tracking and billing.
- **Role-Based Security**: Provide tailored interfaces for 4 enterprise roles: **ADMIN**, **SALES**, **WAREHOUSE**, and **ACCOUNTS**.
- **Data Consistency**: Guarantee stock accuracy using MongoDB ACID transactions.

### 1.3 Brand Identity
- **Name**: `Inventra stocks`
- **Subtitle**: `PORTFOLIO & OPERATIONS PORTAL`
- **Logo**: Glowing purple circular badge featuring a vector emblem of a Building + Stock Bar Chart structure (`BrandLogo.jsx`).
- **Theme**: Light (`#ffffff`) and Dark (`#0f172a`) mode support.

---

## 2. Architecture of this project

### 2.1 Tech Stack
- **Frontend**: React 19, Vite 8, Material UI (MUI v9), React Router DOM v7, Axios, `date-fns`.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ODM v8.
- **Security & Utilities**: JWT Authentication, `bcryptjs` password hashing, `Zod` validation, `Helmet`, `CORS`.

### 2.2 System Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                          │
│ React 19 + Material UI (MUI v9) + React Router v7 + ThemeContext (Dark/Light) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST APIs (Axios + JWT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVER LAYER (EXPRESS.JS)                       │
│ Middlewares: Auth Guard (JWT) -> Role Authorization -> Zod Body Validator   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Mongoose ODM
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER (MONGODB)                          │
│ Collections: Users | Customers | Products | Categories | Warehouses |       │
│              InventoryMovements | SalesChallans (ACID Transactions)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Directory Structure
```
college_stocks/
├── backend/
│   ├── scripts/seed.js          # Database seeder script
│   ├── src/
│   │   ├── config/              # DB connection & env vars
│   │   ├── constants/           # Enums (Roles, Statuses)
│   │   ├── controllers/         # Request controllers
│   │   ├── middlewares/         # Auth JWT, Role Guard, Error middleware
│   │   ├── models/              # Mongoose models (User, Product, Challan, etc.)
│   │   ├── routes/              # Express API routes
│   │   ├── services/            # Business logic & ACID transactions
│   │   └── server.js            # Node HTTP server
│   └── package.json
│
└── frontend/
    ├── public/favicon.svg       # Building Logo Favicon
    ├── src/
    │   ├── components/          # Reusable UI library (BrandLogo, Navbar, Sidebar, etc.)
    │   ├── context/             # AuthContext & ThemeContext
    │   ├── pages/               # Application page views
    │   ├── services/            # Axios API instances
    │   ├── theme/               # MUI custom theme tokens
    │   └── App.jsx              # React Router & ProtectedRoute
    └── package.json
```

---

## 3. Features of this project

### 3.1 Role-Based Access Control (RBAC)
- **ADMIN**: Full system governance, user administration, and CRUD operations.
- **SALES**: Manage customer CRM pipelines & create/confirm sales challans.
- **WAREHOUSE**: Manage product catalog, stock allocations, and stock IN/OUT movements.
- **ACCOUNTS**: Financial review access for sales challans & invoices.

### 3.2 Customer CRM Directory
- Lead status tracking (`LEAD`, `ACTIVE`, `INACTIVE`) and type categorization (`RETAIL`, `WHOLESALE`, `DISTRIBUTOR`).
- Follow-up date scheduling and notes history.

### 3.3 Product Catalog & Low Stock Alerting
- Automatic SKU uppercase formatting & global uniqueness checks.
- Visual alerts when stock drops below threshold (`currentStock <= minimumStockAlertQuantity`).

### 3.4 Real-Time Inventory Audit Logging
- Trackable history for all `STOCK_IN` and `STOCK_OUT` transactions with user timestamping.

### 3.5 Sales Challan & Invoicing System
- Sequential invoice numbering (`CH-000001`).
- Immutability snapshots for pricing and names.
- One-click printable delivery invoice modal (`INVENTRA ERP`).

---

## 4. Advantages of this project

### 4.1 Guaranteed ACID Atomic Stock Operations
MongoDB session transactions (`session.startTransaction()`) guarantee that multi-item order deductions or cancellations execute completely or roll back automatically, eliminating race conditions or negative stock levels.

### 4.2 Historical Snapshot Integrity
Captures immutable price and product name snapshots when challans are created, preserving financial accuracy even if catalog prices change later.

### 4.3 Enterprise-Grade Security
Uses JWT Bearer tokens, salted `bcryptjs` password hashing, Zod payload validation, and Helmet security headers.

### 4.4 Ultra-Fast & Modern User Experience
Powered by React 19 + Vite 8 for fast builds, alongside MUI v9 for a dark/light UI experience.

---

## 🔧 Quick Setup & Credentials

### Setup Commands
```bash
# Backend
cd backend && npm install && npm run seed && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

### Test Credentials (Post-Seeding)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@erp.com` | `admin123` |
| **Sales** | `sales@erp.com` | `sales123` |
| **Warehouse** | `warehouse@erp.com` | `warehouse123` |
| **Accounts** | `accounts@erp.com` | `accounts123` |

For full documentation details, visit [DOCUMENTATION.md](file:///c:/Users/hp/OneDrive/Desktop/priyanshu/college_stocks/DOCUMENTATION.md).

---

© 2026 **Inventra stocks** — Portfolio & Operations Portal.
