import mongoose from 'mongoose';
import { CUSTOMER_TYPE, CUSTOMER_TYPE_VALUES } from '../constants/customerType.js';
import { CUSTOMER_STATUS, CUSTOMER_STATUS_VALUES } from '../constants/customerStatus.js';

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  customerType: {
    type: String,
    enum: CUSTOMER_TYPE_VALUES,
    default: CUSTOMER_TYPE.RETAIL
  },
  address: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: CUSTOMER_STATUS_VALUES,
    default: CUSTOMER_STATUS.LEAD
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

customerSchema.index({ customerName: 1, mobileNumber: 1 });
customerSchema.index({ businessName: 1 });

export default mongoose.model('Customer', customerSchema);
