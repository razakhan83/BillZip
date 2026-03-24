import mongoose, { Schema, model, models } from 'mongoose'

const InvoiceItemSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
})

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [InvoiceItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Paid'], default: 'Draft' },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Keeping optional for now
}, { timestamps: true })

const Invoice = models.Invoice || model('Invoice', InvoiceSchema)
export default Invoice
