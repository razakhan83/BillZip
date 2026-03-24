'use client'

import React, { useState, useEffect } from 'react'
import { Plus, FileText, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getInvoices } from '@/lib/actions/invoice_list'
import { getSettings } from '@/lib/actions/settings'
import { formatCurrency } from '@/lib/utils/currency'

export default function InvoicesPage() {
  const [mounted, setMounted] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [settings, setSettings] = useState({ currencyCode: 'PKR', currencySymbol: 'Rs.' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      const [invoicesData, settingsData] = await Promise.all([
        getInvoices(),
        getSettings()
      ])
      setInvoices(invoicesData)
      setSettings(settingsData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (!mounted) return null

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Invoices</h1>
          <p className='text-slate-500 text-sm'>Manage your sales invoices and payments.</p>
        </div>
        <Link href='/sales/invoices/new'>
          <button className='btn-zoho flex items-center justify-center gap-2 w-full sm:w-auto'>
            <Plus className='w-4 h-4' />
            <span>New Invoice</span>
          </button>
        </Link>
      </div>

      <div className='bg-white rounded-xl border border-zoho-border shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead>
              <tr className='bg-slate-50 border-b border-zoho-border'>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Date</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Invoice#</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Customer</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right'>Amount</th>
                <th className='px-6 py-4 w-12'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-20'></div></td>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-24'></div></td>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-32'></div></td>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-16'></div></td>
                    <td className='px-6 py-4'><div className='h-4 bg-slate-100 rounded w-20 ml-auto'></div></td>
                    <td></td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center'>
                    <div className='flex flex-col items-center gap-2 text-slate-400'>
                      <FileText className='w-12 h-12 mb-2 opacity-20' />
                      <p className='text-slate-500 font-medium'>No invoices found</p>
                      <Link href='/sales/invoices/new' className='text-zoho-green text-sm hover:underline font-semibold'>
                        Create your first invoice
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((inv: any, index: number) => (
                  <tr key={inv._id || `inv-${index}`} className='hover:bg-slate-50/50 transition-all group'>
                    <td className='px-6 py-4 text-sm text-slate-600 font-medium'>
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-sm font-semibold text-slate-900'>
                      {inv.invoiceNumber}
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600 italic'>
                      {inv.customerName}
                    </td>
                    <td className='px-6 py-4'>
                      <span className={cn(
                        'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border',
                        inv.status === 'Draft' ? 'bg-slate-50 text-slate-500 border-slate-100' :
                        inv.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-600 border-red-100'
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm font-bold text-slate-900 text-right'>
                      {formatCurrency(inv.totalAmount, settings.currencySymbol)}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button className='p-1.5 hover:bg-slate-100 rounded-md transition-all text-slate-400 hover:text-slate-600'>
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
    </div>
  )
}
