'use client'

import React, { useOptimistic, useTransition } from 'react'
import { CURRENCIES } from '@/lib/utils/currency'
import { updateCurrency } from '@/lib/actions/settings'
import { Globe, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsClientProps {
  initialSettings: {
    currencyCode: string
    currencySymbol: string
  }
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isPending, startTransition] = useTransition()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const [optimisticSettings, setOptimisticSettings] = useOptimistic(
    initialSettings,
    (state, newSettings: { code: string; symbol: string }) => ({
      ...state,
      currencyCode: newSettings.code,
      currencySymbol: newSettings.symbol,
    })
  )

  const handleCurrencyChange = async (code: string, symbol: string) => {
    startTransition(async () => {
      setOptimisticSettings({ code, symbol })
      try {
        await updateCurrency(code, symbol)
      } catch (error) {
        console.error('Failed to update currency', error)
        alert('Failed to update currency. Please try again.')
      }
    })
  }

  if (!mounted) return null

  return (
    <div className='max-w-4xl space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Settings</h1>
        <p className='text-slate-500 text-sm'>Manage your global preferences and configurations.</p>
      </div>

      <div className='bg-white rounded-xl border border-zoho-border shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-zoho-border flex items-center gap-3 bg-slate-50'>
          <Globe className='w-5 h-5 text-zoho-green' />
          <h2 className='font-semibold text-slate-800'>Regional & Currency</h2>
        </div>

        <div className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-4'>Global Currency</label>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code, currency.symbol)}
                  disabled={isPending}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border transition-all text-left group',
                    optimisticSettings.currencyCode === currency.code
                      ? 'border-zoho-green bg-zoho-green/5 ring-1 ring-zoho-green'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors',
                      optimisticSettings.currencyCode === currency.code
                        ? 'bg-zoho-green text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    )}>
                      {currency.symbol}
                    </div>
                    <div>
                      <p className='font-semibold text-slate-900'>{currency.code}</p>
                      <p className='text-xs text-slate-500'>Default Format</p>
                    </div>
                  </div>
                  {optimisticSettings.currencyCode === currency.code && (
                    <div className='bg-zoho-green rounded-full p-1'>
                      <Check className='w-3 h-3 text-white' />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {isPending && (
              <div className='mt-4 flex items-center gap-2 text-zoho-green text-sm font-medium animate-pulse'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Updating global currency...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className='bg-blue-50 border border-blue-100 rounded-lg p-6 flex gap-4'>
        <div className='w-1 bg-blue-400 rounded-full'></div>
        <div className='space-y-1'>
          <p className='text-sm font-semibold text-blue-900'>Why change the currency?</p>
          <p className='text-sm text-blue-800/80 leading-relaxed'>
            Changing the global currency will instantly update how all amounts are displayed across your items, invoices, and financial reports. 
            The base amounts stored in the database remain unchanged.
          </p>
        </div>
      </div>
    </div>
  )
}
