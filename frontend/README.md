# ERP + CRM Portal - Frontend

React frontend for the ERP + CRM Operations Portal.

## Tech Stack

- React 19
- Vite
- React Router DOM
- Material UI (MUI)
- Axios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Authentication (Login/Signup)
- Role-based dashboard
- Customer management
- Product management
- Challan (Sales Order) management
- Warehouse management
- Inventory tracking
- Reusable component library
- Consistent UI/UX across all pages

## Component Library

The frontend includes a comprehensive component library in `src/components/`:

- **Layout**: Main layout component with header and navigation
- **DataTable**: Reusable data table with loading states and empty states
- **LoadingButton**: Button with loading indicator
- **Modal**: Basic modal component
- **FormModal**: Modal with form submission handling
- **SearchBar**: Search input with icon
- **StatusChip**: Status display with color coding
- **PageHeader**: Consistent page headers with actions
- **ConfirmDialog**: Confirmation dialog for destructive actions
- **AlertMessage**: Reusable alert/message component

All pages have been refactored to use these reusable components for:
- Consistent UI/UX
- Reduced code duplication
- Easier maintenance
- Better code organization

## Pages

- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Role-based dashboard
- `/customers` - Customer CRUD
- `/products` - Product CRUD
- `/challans` - Sales Challan management
- `/warehouses` - Warehouse CRUD
- `/inventory` - Stock movements

## Role-Based Access

- **ADMIN**: Full access to all modules
- **SALES**: Customers and Challans
- **WAREHOUSE**: Products, Warehouses, Inventory
- **ACCOUNTS**: Challans (view only)

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` through Vite proxy.

## Test Credentials

Use the credentials from the backend seed script:
- Admin: admin@erp.com / admin123
- Sales: sales@erp.com / sales123
- Warehouse: warehouse@erp.com / warehouse123
- Accounts: accounts@erp.com / accounts123
