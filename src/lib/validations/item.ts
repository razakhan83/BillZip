import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().optional(),
})

export type ItemInput = z.infer<typeof itemSchema>
