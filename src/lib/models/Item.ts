import mongoose, { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sku: { type: String },
  unit: { type: String, default: 'pcs' },
  rate: { type: Number, required: true },
  description: { type: String },
  type: { type: String, enum: ['Product', 'Service'], default: 'Product' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const Item = models.Item || model('Item', ItemSchema);
export default Item;
