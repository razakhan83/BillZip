import mongoose, { Schema, model, models } from 'mongoose'

const SettingsSchema = new Schema({
  currencyCode: { type: String, default: 'PKR' },
  currencySymbol: { type: String, default: 'Rs.' },
  // Add other global settings here as needed
}, { timestamps: true })

const Settings = models.Settings || model('Settings', SettingsSchema)
export default Settings
