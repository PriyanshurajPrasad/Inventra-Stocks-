# ERP + CRM Operations Portal - Backend

A complete, production-style backend for an ERP + CRM Operations Portal built with the MERN stack. This backend provides REST APIs for customer relationship management, inventory control, and sales operations with role-based access control.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Request validation
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers

## 📋 Features

### Authentication & Authorization
- User signup with default SALES role
- Secure login with JWT tokens
- Role-based access control (ADMIN, SALES, WAREHOUSE, ACCOUNTS)
- Password hashing with bcrypt
- Token-based authentication middleware

### Customer CRM
- Add, edit, and delete customers
- Customer types: RETAIL, WHOLESALE, DISTRIBUTOR
- Customer statuses: LEAD, ACTIVE, INACTIVE
- Search by name, mobile number, business name
- Filter by status and customer type
- Follow-up date tracking
- Notes and address management
- Pagination support

### Product Management
- Add, edit, and delete products
- Unique SKU for each product
- Category-based organization
- Warehouse assignment
- Stock tracking with low stock alerts
- Search by product name and SKU
- Filter by category and warehouse
- Pagination support

### Category Management
- Create, update, and delete categories
- Unique category names
- Descriptions for categories

### Warehouse Management
- Add, edit, and delete warehouses
- Location tracking
- Active/inactive status
- Description support

### Inventory Management
- Stock movement tracking (IN/OUT)
- Atomic stock operations with MongoDB transactions
- Stock movement history
- Filter by product, movement type, and date
- Pagination support
- Negative stock prevention

### Sales Challan System
- Create draft challans with multiple products
- Product snapshot preservation (price, name, SKU)
- Automatic challan number generation (CH-000001 format)
- Confirm challans with stock validation
- Cancel challans (draft and confirmed)
- Atomic stock deduction on confirmation
- Stock restoration on cancellation
- Transaction rollback on insufficient stock
- Search by challan number
- Filter by status, customer, and date
- Pagination support

## 📁 Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── customer.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── warehouse.controller.js
│   │   ├── inventory.controller.js
│   │   └── challan.controller.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Warehouse.js
│   │   ├── StockMovement.js
│   │   ├── Challan.js
│   │   └── ChallanItem.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── customer.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── warehouse.routes.js
│   │   ├── inventory.routes.js
│   │   └── challan.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── customer.service.js
│   │   ├── product.service.js
│   │   ├── inventory.service.js
│   │   └── challan.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── role.middleware.js      # Role-based authorization
│   │   ├── validate.middleware.js  # Request validation
│   │   ├── notFound.middleware.js  # 404 handler
│   │   └── error.middleware.js     # Global error handler
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── customer.validation.js
│   │   ├── product.validation.js
│   │   ├── inventory.validation.js
│   │   └── challan.validation.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── hashPassword.js
│   │   ├── generateChallanNumber.js
│   │   └── apiResponse.js
│   │
│   ├── constants/
│   │   ├── roles.js
│   │   ├── challanStatus.js
│   │   ├── customerStatus.js
│   │   ├── customerType.js
│   │   └── movementType.js
│   │
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server startup
│
├── scripts/
│   └── seed.js                   # Database seeding script
│
├── postman/
│   └── ERP-CRM.postman_collection.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/erp-crm
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

6. **Run the seed script** (optional, but recommended)
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

## 🎯 NPM Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with demo data
```

## 🔐 Test Credentials

After running the seed script, use these credentials to test:

| Role       | Email              | Password      |
|------------|--------------------|---------------|
| Admin      | admin@erp.com      | admin123      |
| Sales      | sales@erp.com      | sales123      |
| Warehouse  | warehouse@erp.com  | warehouse123  |
| Accounts   | accounts@erp.com   | accounts123   |

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Flow

1. **Signup**
   ```http
   POST /api/auth/signup
   Content-Type: application/json

   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**
   ```http
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "admin@erp.com",
     "password": "admin123"
   }
   ```

3. **Get Current User**
   ```http
   GET /api/auth/me
   Authorization: Bearer <token>
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Customers (Admin, Sales)
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers (with pagination, search, filters)
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

#### Products (Admin, Warehouse)
- `POST /api/products` - Create product
- `GET /api/products` - List products (with pagination, search, filters)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Categories (Admin, Warehouse)
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Warehouses (Admin, Warehouse)
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses` - List warehouses
- `GET /api/warehouses/:id` - Get warehouse by ID
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

#### Inventory (Admin, Warehouse)
- `POST /api/inventory/movements` - Create stock movement
- `GET /api/inventory/movements` - List stock movements (with filters)

#### Challans (Admin, Sales, Accounts)
- `POST /api/challans` - Create challan
- `GET /api/challans` - List challans (with pagination, search, filters)
- `GET /api/challans/:id` - Get challan by ID
- `PUT /api/challans/:id` - Update challan (draft only)
- `POST /api/challans/:id/confirm` - Confirm challan
- `POST /api/challans/:id/cancel` - Cancel challan
- `DELETE /api/challans/:id` - Delete challan (draft only)

### Query Parameters

#### Pagination
```
?page=1&limit=10
```

#### Search
```
?search=keyword
```

#### Filters
```
?status=ACTIVE&customerType=WHOLESALE
```

#### Date Range
```
?startDate=2024-01-01&endDate=2024-12-31
```

## 🔒 Role Permissions

### ADMIN
- Full system access
- User management
- All CRUD operations

### SALES
- Customer management
- Sales challan operations
- View products and categories

### WAREHOUSE
- Product management
- Inventory operations
- Stock movement tracking
- Category and warehouse management

### ACCOUNTS
- View sales challans
- View challan details
- Access to relevant financial data

## 📦 Postman Collection

A complete Postman collection is provided in `postman/ERP-CRM.postman_collection.json`.

1. Import the collection into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (will be set after login)
3. Use the "Login" request to authenticate
4. Copy the token from the response
5. Update the `token` variable in Postman
6. Test other endpoints

## 🔒 Security Features

- JWT-based authentication
- bcrypt password hashing
- Role-based access control
- Request validation with Zod
- Helmet.js security headers
- CORS configuration
- Environment variable protection
- SQL injection prevention (MongoDB)
- XSS protection

## ⚡ Key Features

### Atomic Stock Operations
Challan confirmation uses MongoDB transactions to ensure atomic stock operations:
- All products must have sufficient stock
- If any product lacks stock, entire operation rolls back
- No partial stock deductions

### Product Snapshots
Challan items store product snapshots at creation time:
- Product name
- SKU
- Unit price
- This preserves historical data even if products change

### Challan Number Generation
Automatic unique challan number generation:
- Format: CH-000001, CH-000002, etc.
- Ensures no duplicate numbers

### Negative Stock Prevention
System prevents stock from going negative:
- Validation before stock operations
- Clear error messages with available/requested quantities

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error connecting to MongoDB: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running on your system

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in `.env` or stop the process using port 5000

### JWT Secret Error
```
JWT_SECRET is required
```
**Solution**: Ensure JWT_SECRET is set in `.env` file

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` to install dependencies

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/erp-crm
JWT_SECRET=strong_random_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment Steps
1. Set up MongoDB Atlas or production database
2. Update environment variables
3. Build the application (if needed)
4. Deploy to your hosting platform (Heroku, AWS, DigitalOcean, etc.)
5. Run `npm start` to start the production server

## 📄 License

ISC

## 👥 Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ using MERN Stack**
