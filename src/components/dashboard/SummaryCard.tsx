'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/currency'

interface SummaryCardProps {
  title: string
  amount: number
  currencySymbol?: string
  type: 'receivable' | 'payable'
  overdue: number
}

export default function SummaryCard({ title, amount, currencySymbol = 'Rs.', type, overdue }: SummaryCardProps) {
  const isReceivable = type === 'receivable'
  const color = isReceivable ? 'text-zoho-green' : 'text-orange-500'
  const bgColor = isReceivable ? 'bg-zoho-green/10' : 'bg-orange-500/10'
  const barColor = isReceivable ? 'bg-zoho-green' : 'bg-orange-500'

  return (
    <div className='bg-white rounded-xl border border-zoho-border p-6 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-[10px] md:text-sm font-medium text-slate-500 uppercase tracking-wider'>{title}</h3>
          <p className='text-xl md:text-3xl font-bold text-slate-900 mt-1'>
            {formatCurrency(amount, currencySymbol)}
          </p>
        </div>
        <div className={cn('p-2 rounded-lg', bgColor)}>
          {isReceivable ? <ArrowUpRight className={cn('w-5 h-5', color)} /> : <ArrowDownRight className={cn('w-5 h-5', color)} />}
        </div>
      </div>
      
      <div className='space-y-4'>
        <div>
          <div className='flex justify-between text-xs font-medium mb-1'>
            <span className='text-slate-500 uppercase'>Current</span>
            <span className='text-slate-900'>{amount > 0 ? ((amount - overdue) / amount * 100).toFixed(0) : 0}%</span>
          </div>
          <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
            <div 
              className={cn('h-full transition-all duration-1000', barColor)} 
              style={{ width: `${amount > 0 ? ((amount - overdue) / amount * 100) : 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className='flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-50'>
          <Clock className='w-4 h-4' />
          <span>Overdue: </span>
          <span className='font-semibold text-red-500'>
            {formatCurrency(overdue, currencySymbol)}
          </span>
        </div>
      </div>
    </div>
  )
}
