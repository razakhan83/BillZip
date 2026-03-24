'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import SummaryCard from '@/components/dashboard/SummaryCard'
import { Plus, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSettings } from '@/lib/actions/settings'
import { formatCurrency } from '@/lib/utils/currency'

const CashFlowChart = dynamic(() => import('@/components/dashboard/CashFlowChart'), { 
  ssr: false,
  loading: () => <div className='h-[300px] w-full bg-slate-50 animate-pulse rounded-xl border border-zoho-border' />
})

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({ currencyCode: 'PKR', currencySymbol: 'Rs.' })

  useEffect(() => {
    setMounted(true)
    getSettings().then(setSettings)
  }, [])

  if (!mounted) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-zoho-green' />
      </div>
    )
  }

  return (
    <div className='space-y-6 md:space-y-8'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-slate-900'>Dashboard</h1>
          <p className='text-slate-500 text-xs md:text-sm'>Welcome back, here's what's happening today.</p>
        </div>
        <div className='flex gap-2 md:gap-3 w-full sm:w-auto'>
          <button className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm'>
            <Download className='w-4 h-4' />
            <span className='xs:inline hidden'>Export</span>
          </button>
          <Link href='/sales/invoices/new' className='flex-1 sm:flex-none'>
            <button className='w-full btn-zoho flex items-center justify-center gap-2'>
              <Plus className='w-4 h-4' />
              <span>New Invoice</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <SummaryCard 
          title='Total Receivables' 
          amount={45280.50} 
          type='receivable' 
          overdue={12450.00} 
          currencySymbol={settings.currencySymbol}
        />
        <SummaryCard 
          title='Total Payables' 
          amount={28140.20} 
          type='payable' 
          overdue={5200.00} 
          currencySymbol={settings.currencySymbol}
        />
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Cash Flow Chart */}
        <div className='lg:col-span-2'>
          <CashFlowChart />
        </div>

        {/* Sales Summary */}
        <div className='bg-white p-6 rounded-xl border border-zoho-border shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-semibold text-slate-800 text-lg'>Sales Summary</h3>
            <button className='text-zoho-green text-sm font-medium hover:underline'>View All</button>
          </div>
          
          <div className='space-y-6'>
            {[
              { label: 'Total Sales', value: formatCurrency(124500.00, settings.currencySymbol), trend: '+12%' },
              { label: 'Unpaid Invoices', value: '18', trend: '4 Overdue' },
              { label: 'Active Customers', value: '142', trend: '+5 this month' },
              { label: 'Top Category', value: 'Software Services', trend: '60%' },
            ].map((stat) => (
              <div key={stat.label} className='flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0'>
                <div>
                  <p className='text-sm text-slate-500'>{stat.label}</p>
                  <p className='text-lg font-bold text-slate-900 mt-0.5'>{stat.value}</p>
                </div>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                )}>
                  {stat.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
