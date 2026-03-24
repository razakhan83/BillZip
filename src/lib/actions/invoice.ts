'use server'

import dbConnect from '@/lib/db'
import Invoice from '@/lib/models/Invoice'
import { invoiceSchema, type InvoiceInput } from '@/lib/validations/invoice'
import { revalidatePath } from 'next/cache'
import { upsertCustomer } from './customer'


export async function getNextInvoiceNumber() {
  try {
    await dbConnect()
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 })
    
    if (!lastInvoice) return 'INV-0001'
    
    const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV-', ''))
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0')
    return `INV-${nextNumber}`
  } catch (error) {
    console.error('Failed to get next invoice number:', error)
    return 'INV-0001'
  }
}

export async function createInvoice(data: InvoiceInput) {
  try {
    const validatedData = invoiceSchema.parse(data)
    await dbConnect()

    const newInvoice = await Invoice.create(validatedData)

    // Auto-save/update customer
    await upsertCustomer(validatedData.customerName, validatedData.totalAmount)

    revalidatePath('/sales/invoices')
    return JSON.parse(JSON.stringify(newInvoice))
  } catch (error) {
    console.error('Failed to create invoice:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Failed to create invoice')
  }
}
