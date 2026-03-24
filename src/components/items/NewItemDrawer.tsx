'use client'

import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createItem } from '@/lib/actions/item'
import { type ItemInput } from '@/lib/validations/item'

interface NewItemDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newItem: any) => void
}

export default function NewItemDrawer({ isOpen, onClose, onSuccess }: NewItemDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ItemInput>({
    name: '',
    sku: '',
    price: 0,
    description: '',
  })

  const handleGenerateSKU = () => {
    const prefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : 'ITEM'
    const random = Math.floor(1000 + Math.random() * 9000)
    setFormData({ ...formData, sku: `${prefix}-${random}` })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createItem(formData)
      onSuccess(result)
      setFormData({
        name: '',
        sku: '',
        price: 0,
        description: '',
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-zoho-border'>
            <h2 className='text-xl font-bold text-slate-900'>New Item</h2>
            <button 
              onClick={onClose}
              className='p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='flex-1 overflow-y-auto p-6 space-y-6'>
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md'>
                {error}
              </div>
            )}

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Item Name*</label>
                <input 
                  type='text' 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green outline-none transition-all text-sm'
                  placeholder='Enter item name'
                />
              </div>



              <div>
                <div className='flex justify-between mb-1'>
                  <label className='text-sm font-medium text-slate-700'>SKU</label>
                  <button 
                    type='button'
                    onClick={handleGenerateSKU}
                    className='text-xs text-zoho-green hover:underline font-medium'
                  >
                    Auto-generate
                  </button>
                </div>
                <input 
                  type='text' 
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className='w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green outline-none transition-all text-sm'
                  placeholder='Enter SKU'
                />
              </div>

              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1'>Price*</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>$</span>
                    <input 
                      type='number' 
                      required
                      min='0'
                      step='0.01'
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className='w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green outline-none transition-all text-sm'
                      placeholder='0.00'
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green outline-none transition-all text-sm'
                  placeholder='Describe your item'
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className='p-6 border-t border-zoho-border bg-slate-50 flex gap-3'>
            <button 
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 px-4 py-2 border border-slate-300 bg-white rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='flex-1 btn-zoho flex items-center justify-center gap-2 disabled:opacity-50'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Item</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
