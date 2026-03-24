'use client'

import React, { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { Search, Bell, User, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex min-h-screen'>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          
          <div className='flex-1 flex flex-col lg:ml-64 transition-all duration-300'>
            {/* Top Bar */}
            <header className='h-16 bg-white border-b border-zoho-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-40'>
              <div className='flex items-center gap-4 flex-1 max-w-xl'>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className='lg:hidden p-2 hover:bg-slate-100 rounded-md transition-colors'
                >
                  <Menu className='w-6 h-6 text-slate-600' />
                </button>
                
                <div className='relative w-full hidden sm:block'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <input 
                    type='text' 
                    placeholder='Search for invoices, customers...' 
                    className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green transition-all'
                  />
                </div>

                <button className='sm:hidden p-2 hover:bg-slate-100 rounded-md text-slate-600'>
                  <Search className='w-5 h-5' />
                </button>
              </div>
              
              <div className='flex items-center gap-2 md:gap-4'>
                <button className='p-2 hover:bg-slate-100 rounded-full transition-colors relative'>
                  <Bell className='w-5 h-5 text-slate-600' />
                  <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
                </button>
                <div className='h-8 w-px bg-slate-200 mx-1 hidden xs:block'></div>
                <button className='flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors'>
                  <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center'>
                    <User className='w-5 h-5 text-slate-500' />
                  </div>
                  <span className='text-sm font-medium text-slate-700 hidden md:block'>John Doe</span>
                </button>
              </div>
            </header>
            
            {/* Main Content */}
            <main className='p-4 md:p-8 flex-1 overflow-y-auto'>
              {mounted ? children : <div className='p-8 flex items-center justify-center h-full'><Loader2 className='w-8 h-8 animate-spin text-zoho-green' /></div>}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

import { Loader2 } from 'lucide-react'
