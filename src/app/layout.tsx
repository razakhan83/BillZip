import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { Search, Bell, User } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BillZip | Invoice Management',
  description: 'Professional Invoice Management App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex min-h-screen'>
          <Sidebar />
          
          <div className='flex-1 ml-64 flex flex-col'>
            {/* Top Bar */}
            <header className='h-16 bg-white border-b border-zoho-border flex items-center justify-between px-8 sticky top-0 z-40'>
              <div className='flex items-center gap-4 flex-1 max-w-xl'>
                <div className='relative w-full'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <input 
                    type='text' 
                    placeholder='Search for invoices, customers...' 
                    className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zoho-green/20 focus:border-zoho-green transition-all'
                  />
                </div>
              </div>
              
              <div className='flex items-center gap-4'>
                <button className='p-2 hover:bg-slate-100 rounded-full transition-colors relative'>
                  <Bell className='w-5 h-5 text-slate-600' />
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
                </button>
                <div className='h-8 w-px bg-slate-200 mx-1'></div>
                <button className='flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors'>
                  <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center'>
                    <User className='w-5 h-5 text-slate-500' />
                  </div>
                  <span className='text-sm font-medium text-slate-700'>John Doe</span>
                </button>
              </div>
            </header>
            
            {/* Main Content */}
            <main className='p-8 flex-1 overflow-y-auto'>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
