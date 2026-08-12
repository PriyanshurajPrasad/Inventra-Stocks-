import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import challanRoutes from './routes/challan.routes.js';

import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/challans', challanRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
