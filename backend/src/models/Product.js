import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minimumStockAlertQuantity: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock alert quantity cannot be negative']
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  }
}, {
  timestamps: true
});

productSchema.index({ productName: 1 });
productSchema.index({ category: 1 });
productSchema.index({ warehouse: 1 });

export default mongoose.model('Product', productSchema);
