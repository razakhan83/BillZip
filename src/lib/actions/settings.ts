'use server'

import dbConnect from '@/lib/db'
import Settings from '@/lib/models/Settings'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  try {
    await dbConnect()
    let settings = await Settings.findOne().lean()
    
    if (!settings) {
      settings = await Settings.create({
        currencyCode: 'PKR',
        currencySymbol: 'Rs.'
      })
    }
    
    return JSON.parse(JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return { currencyCode: 'PKR', currencySymbol: 'Rs.' }
  }
}

export async function updateCurrency(code: string, symbol: string) {
  try {
    await dbConnect()
    await Settings.findOneAndUpdate(
      {}, 
      { currencyCode: code, currencySymbol: symbol },
      { upsert: true, new: true }
    )
    revalidatePath('/')
    revalidatePath('/items')
    revalidatePath('/sales/invoices')
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to update currency:', error)
    throw new Error('Failed to update currency')
  }
}
