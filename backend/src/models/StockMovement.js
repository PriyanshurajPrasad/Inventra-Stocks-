import mongoose from 'mongoose';
import { MOVEMENT_TYPE, MOVEMENT_TYPE_VALUES } from '../constants/movementType.js';

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantityChanged: {
    type: Number,
    required: [true, 'Quantity changed is required']
  },
  movementType: {
    type: String,
    enum: MOVEMENT_TYPE_VALUES,
    required: [true, 'Movement type is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

stockMovementSchema.index({ product: 1 });
stockMovementSchema.index({ movementType: 1 });
stockMovementSchema.index({ createdAt: 1 });

export default mongoose.model('StockMovement', stockMovementSchema);
