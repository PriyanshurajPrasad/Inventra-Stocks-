import mongoose from 'mongoose';

const challanItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productNameSnapshot: {
    type: String,
    required: [true, 'Product name snapshot is required']
  },
  skuSnapshot: {
    type: String,
    required: [true, 'SKU snapshot is required']
  },
  unitPriceSnapshot: {
    type: Number,
    required: [true, 'Unit price snapshot is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  }
}, {
  _id: true
});

export default challanItemSchema;
