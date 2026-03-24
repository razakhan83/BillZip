import { z } from 'zod'

const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be a positive number'),
})

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  totalAmount: z.number().min(0),
  status: z.enum(['Draft', 'Paid']).default('Draft'),
  date: z.date().default(() => new Date()),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
