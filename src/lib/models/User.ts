import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  image: { type: String },
  companyName: { type: String },
  address: { type: String },
  phone: { type: String },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
