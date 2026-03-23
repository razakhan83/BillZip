import mongoose, { Schema, model, models } from 'mongoose'

const InvoiceItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
})

const InvoiceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoiceNumber: { type: String, required: true },
  orderNumber: { type: String },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [InvoiceItemSchema],
  subTotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  balanceDue: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Void'], default: 'Draft' },
  notes: { type: String },
  terms: { type: String },
  attachments: [{ type: String }],
}, { timestamps: true })

const Invoice = models.Invoice || model('Invoice', InvoiceSchema)
export default Invoice
