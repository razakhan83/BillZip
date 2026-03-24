import React from 'react'
import InvoiceForm from '@/components/invoices/InvoiceForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewInvoicePage() {
  return (
    <div className='max-w-5xl mx-auto space-y-6'>
      {/* Breadcrumbs / Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link 
            href='/invoices' 
            className='p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-slate-200 group'
          >
            <ChevronLeft className='w-5 h-5 text-slate-500 group-hover:text-slate-700' />
          </Link>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>New Invoice</h1>
            <p className='text-slate-500 text-sm'>Create a professional invoice for your customer.</p>
          </div>
        </div>
      </div>

      <InvoiceForm />
    </div>
  )
}
