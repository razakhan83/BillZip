import mongoose, { Schema, model, models } from 'mongoose'

const ItemSchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Keeping optional for now
}, { timestamps: true })

const Item = models.Item || model('Item', ItemSchema)
export default Item
