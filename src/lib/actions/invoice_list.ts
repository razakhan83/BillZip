'use server'

import dbConnect from '@/lib/db'
import Invoice from '@/lib/models/Invoice'

export async function getInvoices() {
  try {
    await dbConnect()
    
    // Simplified fetch as per new schema (no populate needed for customerName)
    const invoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .lean()
      
    return JSON.parse(JSON.stringify(invoices))
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return []
  }
}
