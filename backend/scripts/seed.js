import 'dotenv/config';
import mongoose from 'mongoose';
import { hashPassword } from '../src/utils/hashPassword.js';
import User from '../src/models/User.js';
import Customer from '../src/models/Customer.js';
import Category from '../src/models/Category.js';
import Warehouse from '../src/models/Warehouse.js';
import Product from '../src/models/Product.js';
import { ROLES } from '../src/constants/roles.js';
import { CUSTOMER_TYPE } from '../src/constants/customerType.js';
import { CUSTOMER_STATUS } from '../src/constants/customerStatus.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Category.deleteMany({});
    await Warehouse.deleteMany({});
    await Product.deleteMany({});

    console.log('Seeding users...');
    const users = [
      {
        name: 'Admin User',
        email: 'admin@erp.com',
        password: await hashPassword('admin123'),
        role: ROLES.ADMIN
      },
      {
        name: 'Sales User',
        email: 'sales@erp.com',
        password: await hashPassword('sales123'),
        role: ROLES.SALES
      },
      {
        name: 'Warehouse User',
        email: 'warehouse@erp.com',
        password: await hashPassword('warehouse123'),
        role: ROLES.WAREHOUSE
      },
      {
        name: 'Accounts User',
        email: 'accounts@erp.com',
        password: await hashPassword('accounts123'),
        role: ROLES.ACCOUNTS
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Seeding categories...');
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Furniture', description: 'Office and home furniture' },
      { name: 'Stationery', description: 'Office supplies and stationery' }
    ];

    const createdCategories = await Category.create(categories);
    console.log(`Created ${createdCategories.length} categories`);

    console.log('Seeding warehouse...');
    const warehouse = await Warehouse.create({
      name: 'Main Warehouse',
      location: 'Industrial Area, Zone A',
      description: 'Primary storage facility',
      isActive: true
    });
    console.log('Created warehouse');

    console.log('Seeding customers...');
    const customers = [
      {
        customerName: 'Acme Corporation',
        mobileNumber: '9876543210',
        email: 'contact@acme.com',
        businessName: 'Acme Corporation',
        gstNumber: 'GST123456789',
        customerType: CUSTOMER_TYPE.WHOLESALE,
        address: '123 Business Park, Tech City',
        status: CUSTOMER_STATUS.ACTIVE,
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'Key wholesale customer'
      },
      {
        customerName: 'John Smith',
        mobileNumber: '9876543211',
        email: 'john@gmail.com',
        customerType: CUSTOMER_TYPE.RETAIL,
        address: '456 Residential Area, City Center',
        status: CUSTOMER_STATUS.ACTIVE,
        notes: 'Regular retail customer'
      },
      {
        customerName: 'Tech Distributors Ltd',
        mobileNumber: '9876543212',
        email: 'info@techdist.com',
        businessName: 'Tech Distributors Ltd',
        gstNumber: 'GST987654321',
        customerType: CUSTOMER_TYPE.DISTRIBUTOR,
        address: '789 Industrial Zone, Metro City',
        status: CUSTOMER_STATUS.LEAD,
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Potential distributor, follow up required'
      }
    ];

    const createdCustomers = await Customer.create(customers);
    console.log(`Created ${createdCustomers.length} customers`);

    console.log('Seeding products...');
    const products = [
      {
        productName: 'Wireless Mouse',
        sku: 'WM-001',
        category: createdCategories[0]._id,
        unitPrice: 499,
        currentStock: 100,
        minimumStockAlertQuantity: 20,
        warehouse: warehouse._id
      },
      {
        productName: 'Mechanical Keyboard',
        sku: 'KB-001',
        category: createdCategories[0]._id,
        unitPrice: 2499,
        currentStock: 50,
        minimumStockAlertQuantity: 10,
        warehouse: warehouse._id
      },
      {
        productName: '24-inch Monitor',
        sku: 'MN-001',
        category: createdCategories[0]._id,
        unitPrice: 8999,
        currentStock: 25,
        minimumStockAlertQuantity: 5,
        warehouse: warehouse._id
      },
      {
        productName: 'Office Chair',
        sku: 'FC-001',
        category: createdCategories[1]._id,
        unitPrice: 5999,
        currentStock: 30,
        minimumStockAlertQuantity: 8,
        warehouse: warehouse._id
      },
      {
        productName: 'Desk Lamp',
        sku: 'DL-001',
        category: createdCategories[1]._id,
        unitPrice: 999,
        currentStock: 75,
        minimumStockAlertQuantity: 15,
        warehouse: warehouse._id
      },
      {
        productName: 'Notebook Set',
        sku: 'NS-001',
        category: createdCategories[2]._id,
        unitPrice: 199,
        currentStock: 200,
        minimumStockAlertQuantity: 50,
        warehouse: warehouse._id
      },
      {
        productName: 'Pen Pack',
        sku: 'PP-001',
        category: createdCategories[2]._id,
        unitPrice: 99,
        currentStock: 300,
        minimumStockAlertQuantity: 75,
        warehouse: warehouse._id
      }
    ];

    const createdProducts = await Product.create(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===\n');
    console.log('Test Credentials:');
    console.log('==================');
    console.log('Admin: admin@erp.com / admin123');
    console.log('Sales: sales@erp.com / sales123');
    console.log('Warehouse: warehouse@erp.com / warehouse123');
    console.log('Accounts: accounts@erp.com / accounts123');
    console.log('\nDatabase seeded with:');
    console.log('- 4 Users (all roles)');
    console.log('- 3 Categories');
    console.log('- 1 Warehouse');
    console.log('- 3 Customers');
    console.log('- 7 Products with initial stock');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

seedDatabase();
