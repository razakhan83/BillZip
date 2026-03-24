'use server'

import dbConnect from '@/lib/db'
import Item from '@/lib/models/Item'
import { itemSchema, type ItemInput } from '@/lib/validations/item'
import { revalidatePath } from 'next/cache'

export async function getItems(query: string = '') {
  try {
    await dbConnect()
    
    const filter: any = {}
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    }

    const items = await Item.find(filter).sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return []
  }
}

export async function createItem(data: ItemInput) {
  try {
    const validatedData = itemSchema.parse(data)
    await dbConnect()

    const newItem = await Item.create(validatedData)

    revalidatePath('/items')
    return JSON.parse(JSON.stringify(newItem))
  } catch (error) {
    console.error('Failed to create item:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Failed to create item')
  }
}
