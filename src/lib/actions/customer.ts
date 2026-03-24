'use server'

import dbConnect from '@/lib/db'
import Customer from '@/lib/models/Customer'

export async function searchCustomers(query: string) {
  try {
    await dbConnect()
    // In a real app, we'd filter by userId too
    const customers = await Customer.find({
      displayName: { $regex: query, $options: 'i' }
    })
    .limit(10)
    .lean()
    
    return JSON.parse(JSON.stringify(customers))
  } catch (error) {
    console.error('Failed to search customers:', error)
    return []
  }
}

export async function upsertCustomer(displayName: string, amount: number) {
  try {
    await dbConnect()
    
    // Check if customer exists
    let customer = await Customer.findOne({ displayName })
    
    if (customer) {
      // Update existing
      customer.lastInvoiceDate = new Date()
      customer.totalBalance = (customer.totalBalance || 0) + amount
      await customer.save()
    } else {
      // Create new
      customer = await Customer.create({
        displayName,
        userId: '69c29833e5afbec9b15d4103', // Placeholder, should be session userId
        totalBalance: amount,
        lastInvoiceDate: new Date(),
        status: 'Active'
      })
    }
    
    return JSON.parse(JSON.stringify(customer))
  } catch (error) {
    console.error('Failed to upsert customer:', error)
    throw new Error('Failed to update customer record')
  }
}
