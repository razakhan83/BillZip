'use client'

import React, { useState, useEffect, useOptimistic, useTransition } from 'react'
import { Plus, Search, Package, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import NewItemDrawer from '@/components/items/NewItemDrawer'
import { getItems } from '@/lib/actions/item'
import { getSettings } from '@/lib/actions/settings'
import { formatCurrency } from '@/lib/utils/currency'

export default function ItemsPage() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [settings, setSettings] = useState({ currencyCode: 'PKR', currencySymbol: 'Rs.' })
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Optimistic UI
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: any) => [newItem, ...state]
  )

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [itemsData, settingsData] = await Promise.all([
        getItems(searchQuery),
        getSettings()
      ])
      setItems(itemsData)
      setSettings(settingsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  const handleNewItemSuccess = (newItem: any) => {
    startTransition(() => {
      addOptimisticItem(newItem)
    })
    setItems((prev) => [newItem, ...prev])
  }

  if (!mounted) return null

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Items</h1>
          <p className='text-slate-500 text-sm'>Manage your products and services.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className='btn-zoho flex items-center justify-center gap-2 w-full sm:w-auto'
        >
          <Plus className='w-4 h-4' />
          <span>New Item</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className='bg-white p-4 rounded-xl border border-zoho-border shadow-sm'>
        <form onSubmit={handleSearch} className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input 
            type='text' 
            placeholder='Search items by name or SKU...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green transition-all text-sm'
          />
        </form>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-zoho-border shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b border-zoho-border'>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>SKU</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right'>Price</th>
                <th className='px-6 py-4 w-12'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-3/4'></div></td>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-1/2'></div></td>
                    <td className='px-6 py-4 text-right'><div className='h-4 bg-slate-100 rounded w-1/4 ml-auto'></div></td>
                    <td className='px-6 py-4'></td>
                  </tr>
                ))
              ) : optimisticItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className='px-6 py-12 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <Package className='w-12 h-12 text-slate-200' />
                      <p className='text-slate-500 font-medium'>No items found</p>
                      <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className='text-zoho-green text-sm font-medium hover:underline'
                      >
                        Create your first item
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                optimisticItems.map((item: any, index: number) => (
                  <tr key={item._id || `temp-${index}`} className='hover:bg-slate-50/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>{item.name}</p>
                        {item.description && <p className='text-xs text-slate-500 truncate max-w-[200px]'>{item.description}</p>}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{item.sku || '-'}</td>
                    <td className='px-6 py-4 text-sm font-medium text-slate-900 text-right'>
                      {formatCurrency(item.price, settings.currencySymbol)}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button className='p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400'>
                        <MoreHorizontal className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewItemDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSuccess={handleNewItemSuccess}
      />
    </div>
  )
}
