'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MdDashboard, 
  MdInventory, 
  MdReport, 
  MdSettings,
  MdLogout,
  MdHome,
  MdCleaningServices 
} from 'react-icons/md'
import { 
  FaBed, 
  FaWrench, 
  FaUsers, 
  FaChartLine,
  FaBars,
  FaTimes 
} from 'react-icons/fa'
import { IoMdCalendar } from 'react-icons/io'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  badge?: number
}

export default function SideMenu() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems: MenuItem[] = [
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
      href: '/maintenance',
      badge: 3
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: MdInventory,
      href: '/inventory',
      badge: 2
    },
    {
      id: 'housekeeping',
      label: 'Housekeeping',
      icon: MdCleaningServices,
      href: '/housekeeping'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: IoMdCalendar,
      href: '/bookings'
    },
    {
      id: 'guests',
      label: 'Guests',
      icon: FaUsers,
      href: '/guests'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: FaChartLine,
      href: '/analytics'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: MdReport,
      href: '/reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: MdSettings,
      href: '/settings'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile overlay when mobile sidebar is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile menu button - shows when sidebar is hidden on mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#1D4E56] text-white p-2 rounded-lg "
      >
        <FaBars />
      </button>
      
      <div className={`bg-white transition-all duration-300 h-full ${
        // On large screens: show/hide based on isCollapsed
        // On mobile: show only when isMobileOpen is true
        isCollapsed 
          ? 'hidden lg:block lg:w-16' // Collapsed state on large screens
          : 'hidden lg:block lg:w-64' // Full width on large screens
      } ${
        // Mobile states
        isMobileOpen ? 'fixed left-0 top-0 w-64 z-40 lg:relative' : ''
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1D4E56] rounded-lg flex items-center justify-center">
              <MdHome className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Emilia</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        )}
        
        {/* Desktop collapse button */}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 hidden lg:block"
        >
          {isCollapsed ? (
            <FaBars className="text-gray-600 text-sm" />
          ) : (
            <FaTimes className="text-gray-600 text-sm" />
          )}
        </button>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
        >
          <FaTimes className="text-gray-600 text-sm" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileOpen(false)} // Close mobile menu when item is clicked
              className={`flex items-center gap-3 px-4 py-3  rounded-lg transition-all duration-200 group relative ${
                active
                  ? 'bg-[#1D4E56] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#1D4E56]'
              }`}
            >
              <Icon className={`text-lg shrink-0 ${
                active ? 'text-white' : 'text-gray-500 group-hover:text-[#1D4E56]'
              }`} />
              
              {/* Show labels when not collapsed OR on mobile when open */}
              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state on desktop */}
              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 bg-red-500 px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className=" p-4 border-t border-gray-200">
        <div className={`${isCollapsed && !isMobileOpen ? 'flex justify-center' : ''}`}>
          <button className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
            isCollapsed && !isMobileOpen ? '' : 'w-full'
          }`}>
            <MdLogout className="text-lg shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@emilia.co.ke</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
