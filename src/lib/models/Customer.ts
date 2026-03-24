import mongoose, { Schema, model, models } from 'mongoose'

const CustomerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  displayName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  currency: { type: String, default: 'PKR' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastInvoiceDate: { type: Date },
  totalBalance: { type: Number, default: 0 },
}, { timestamps: true })

const Customer = models.Customer || model('Customer', CustomerSchema)
export default Customer
