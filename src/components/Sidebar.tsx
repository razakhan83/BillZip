'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Invoices', href: '/sales/invoices', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 lg:hidden' 
          onClick={onClose}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={cn(
        'fixed inset-y-0 left-0 w-64 bg-[#192b3c] text-slate-300 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className='p-6 flex items-center justify-between border-b border-white/10'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-zoho-green rounded-md flex items-center justify-center font-bold text-white'>
              BZ
            </div>
            <span className='text-xl font-bold text-white tracking-tight'>BillZip</span>
          </div>
          <button 
            onClick={onClose}
            className='lg:hidden p-1 hover:bg-white/10 rounded-md transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-1 px-3'>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => { if (window.innerWidth < 1024) onClose() }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-colors group',
                      isActive 
                        ? 'bg-white/10 text-white font-medium border-l-4 border-zoho-green -ml-3 pl-2.5 rounded-l-none' 
                        : 'hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive ? 'text-zoho-green' : 'group-hover:text-zoho-green')} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className='p-4 border-t border-white/10'>
          <Link
            href='/settings'
            onClick={() => { if (window.innerWidth < 1024) onClose() }}
            className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors'
          >
            <Settings className='w-5 h-5 text-slate-400' />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </>
  )
}
