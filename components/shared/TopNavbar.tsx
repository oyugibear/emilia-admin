'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MdDashboard, 
  MdInventory, 
  MdReport
} from 'react-icons/md'
import { 
  FaBed, 
  FaWrench,
  FaBars,
  FaTimes
} from 'react-icons/fa'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
}

export default function TopNavbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: MdDashboard,
      href: '/dashboard'
    },
    {
      id: 'rooms',
      label: 'Rooms',
      icon: FaBed,
      href: '/rooms'
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: FaWrench,
      href: '/maintenance'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: MdInventory,
      href: '/inventory'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: MdReport,
      href: '/reports'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') {
      return true
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="bg-white shadow-sm border-b lg:hidden">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1D4E56] rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Emilia Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 md:hidden"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            {/* User Info */}
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, Admin</span>
            <div className="w-8 h-8 bg-[#1D4E56] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`border-t border-gray-200 py-2 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <nav className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-1 md:overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    active 
                      ? 'bg-[#1D4E56] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
