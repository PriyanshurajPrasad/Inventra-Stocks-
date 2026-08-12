import mongoose from 'mongoose';
import { CHALLAN_STATUS, CHALLAN_STATUS_VALUES } from '../constants/challanStatus.js';
import challanItemSchema from './ChallanItem.js';

const challanSchema = new mongoose.Schema({
  challanNumber: {
    type: String,
    required: [true, 'Challan number is required'],
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  items: [challanItemSchema],
  totalQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Total quantity cannot be negative']
  },
  status: {
    type: String,
    enum: CHALLAN_STATUS_VALUES,
    default: CHALLAN_STATUS.DRAFT
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

challanSchema.index({ customer: 1 });
challanSchema.index({ status: 1 });
challanSchema.index({ createdAt: 1 });

challanSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  next();
});

export default mongoose.model('Challan', challanSchema);
