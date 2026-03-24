'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2, Calendar, Loader2, Save, Send, User, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getItems } from '@/lib/actions/item'
import { createInvoice, getNextInvoiceNumber } from '@/lib/actions/invoice'
import { getSettings } from '@/lib/actions/settings'
import { searchCustomers } from '@/lib/actions/customer'
import { formatCurrency } from '@/lib/utils/currency'
import { useRouter } from 'next/navigation'

export default function InvoiceForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, startSearchTransition] = useTransition()
  
  const [items, setItems] = useState<any[]>([])
  const [settings, setSettings] = useState({ currencyCode: 'PKR', currencySymbol: 'Rs.' })
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('INV-0001')
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const [formData, setFormData] = useState<any>({
    invoiceNumber: '',
    customerName: '',
    items: [{ name: '', qty: 1, price: 0 }],
    totalAmount: 0,
    status: 'Draft',
    date: null,
  })

  useEffect(() => {
    setMounted(true)
    setFormData((prev: any) => ({ ...prev, date: new Date() }))

    const fetchData = async () => {
      const [itemsData, invNum, settingsData] = await Promise.all([
        getItems(),
        getNextInvoiceNumber(),
        getSettings()
      ])
      setItems(itemsData)
      setNextInvoiceNumber(invNum)
      setSettings(settingsData)
      setFormData((prev: any) => ({ ...prev, invoiceNumber: invNum }))
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const handleCustomerSearch = (value: string) => {
    setFormData({ ...formData, customerName: value })
    
    if (value.length < 2) {
      setCustomerSuggestions([])
      setShowSuggestions(false)
      return
    }

    startSearchTransition(async () => {
      const results = await searchCustomers(value)
      setCustomerSuggestions(results)
      setShowSuggestions(results.length > 0)
    })
  }

  const selectCustomer = (customer: any) => {
    setFormData({ ...formData, customerName: customer.displayName })
    setShowSuggestions(false)
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', qty: 1, price: 0 }]
    })
  }

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return
    const newItems = formData.items.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    const item = { ...newItems[index], [field]: value }
    
    if (field === 'name' && value) {
      const selectedItem = items.find(i => i.name === value)
      if (selectedItem) {
        item.price = selectedItem.price
      }
    }
    
    newItems[index] = item
    setFormData({ ...formData, items: newItems })
  }

  const subTotal = formData.items.reduce((sum: number, item: any) => sum + (item.qty * item.price), 0)
  const totalAmount = subTotal

  const handleSubmit = async (status: string) => {
    setIsSubmitting(true)
    
    if (!formData.customerName.trim()) {
      alert('Please enter a Customer Name.')
      setIsSubmitting(false)
      return
    }

    const filteredItems = formData.items.filter((item: any) => item.name.trim() !== '')
    
    if (filteredItems.length === 0) {
      alert('Please add at least one item with a name.')
      setIsSubmitting(false)
      return
    }

    try {
      await createInvoice({
        ...formData,
        items: filteredItems,
        totalAmount,
        status: status as any
      })
      router.push('/sales/invoices')
    } catch (error) {
      console.error('Failed to create invoice', error)
      if (error instanceof Error && error.message.includes('validation')) {
        alert('Validation Error: Please ensure all required fields are filled correctly.')
      } else {
        alert(error instanceof Error ? error.message : 'Failed to create invoice')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className='flex items-center justify-center h-64 bg-white rounded-xl border border-zoho-border shadow-sm'>
        <Loader2 className='w-8 h-8 animate-spin text-zoho-green' />
      </div>
    )
  }

  return (
    <div className='bg-white rounded-xl border border-zoho-border shadow-sm overflow-hidden mb-12'>
      <div className='p-6 md:p-8 space-y-8'>
        {/* Header Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div className='relative'>
              <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>Customer Name*</label>
              <div className='relative'>
                <input 
                  type='text' 
                  required
                  value={formData.customerName}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => formData.customerName.length >= 2 && setShowSuggestions(true)}
                  className='w-full px-3 py-2.5 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green outline-none transition-all text-sm'
                  placeholder='Start typing customer name...'
                />
                <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                {isSearching && <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zoho-green animate-spin' />}
              </div>
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && (
                <div className='absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {customerSuggestions.map((customer) => (
                    <button
                      key={customer._id}
                      onClick={() => selectCustomer(customer)}
                      className='w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors border-b last:border-b-0 border-slate-100'
                    >
                      <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold'>
                        {customer.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className='font-medium text-slate-900'>{customer.displayName}</p>
                        {customer.email && <p className='text-xs text-slate-500 font-medium'>{customer.email}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='bg-slate-50 p-6 rounded-lg space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1'>Invoice#</label>
                <input 
                  type='text' 
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))}
                  className='w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white'
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1'>Invoice Date</label>
                <div className='relative'>
                  <DatePicker 
                    selected={formData.date}
                    onChange={(date: Date | null) => setFormData({ ...formData, date: date })}
                    className='w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white pl-9'
                  />
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className='border rounded-lg overflow-hidden'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b text-left'>
                <th className='px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-1/3'>Item Details</th>
                <th className='px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20 text-center'>Quantity</th>
                <th className='px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-32 text-right'>Price ({settings.currencySymbol})</th>
                <th className='px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-32 text-right'>Amount ({settings.currencySymbol})</th>
                <th className='px-4 py-3 w-12'></th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {formData.items.map((item: any, index: number) => (
                <tr key={index} className='group'>
                  <td className='p-4'>
                    <input 
                      list='items-list'
                      placeholder='Item name'
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className='w-full border-none focus:ring-0 text-sm bg-transparent mb-1'
                    />
                    <datalist id='items-list'>
                      {items.map(i => (
                        <option key={i._id} value={i.name} />
                      ))}
                    </datalist>
                  </td>
                  <td className='p-4 text-center'>
                    <input 
                      type='number' 
                      min='1'
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)}
                      className='w-16 border border-slate-200 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-zoho-green outline-none'
                    />
                  </td>
                  <td className='p-4 text-right'>
                    <input 
                      type='number' 
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className='w-24 border border-slate-200 rounded px-2 py-1 text-sm text-right focus:ring-1 focus:ring-zoho-green outline-none'
                    />
                  </td>
                  <td className='p-4 text-right text-sm font-medium'>
                    {formatCurrency(item.qty * item.price, settings.currencySymbol)}
                  </td>
                  <td className='p-4'>
                    <button 
                      onClick={() => handleRemoveItem(index)}
                      className='p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='p-4 bg-slate-50 border-t'>
            <button 
              onClick={handleAddItem}
              className='flex items-center gap-2 text-sm text-zoho-green font-medium hover:underline'
            >
              <Plus className='w-4 h-4' /> Add Another Line
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className='flex justify-end pt-8 border-t'>
          <div className='w-full md:w-80 space-y-4'>
            <div className='flex justify-between text-lg font-bold border-t border-slate-200 pt-4 text-slate-900'>
              <span>Total Amount ({settings.currencySymbol})</span>
              <span>{formatCurrency(totalAmount, settings.currencySymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='p-6 bg-slate-50 border-t border-zoho-border flex flex-col sm:flex-row gap-3 items-center sticky bottom-0 z-10'>
        <button 
          onClick={() => handleSubmit('Draft')}
          disabled={isSubmitting}
          className='w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 rounded-md text-slate-700 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm'
        >
          {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
          Save as Draft
        </button>
        <button 
          onClick={() => handleSubmit('Paid')}
          disabled={isSubmitting}
          className='w-full sm:w-auto px-8 py-2.5 bg-zoho-green text-white rounded-md font-semibold hover:bg-zoho-green-hover transition-all flex items-center justify-center gap-2 shadow-sm'
        >
          {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
          Save and Mark as Paid
        </button>
        <button 
          onClick={() => router.back()}
          className='w-full sm:w-auto px-6 py-2.5 text-slate-500 font-medium hover:text-slate-700 transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
