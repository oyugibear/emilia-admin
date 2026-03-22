'use client'

import React, { useEffect, useState } from 'react'
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
import { FaUsersGear } from 'react-icons/fa6'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  badge?: number
}

export default function SideMenu() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const normalizedPath = (pathname ?? '').toLowerCase()
  const isAuthRoute = normalizedPath.startsWith('/auth') || normalizedPath === '/'

  if (isAuthRoute) {
    return null
  }

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
      id: 'staff',
      label: 'Staff',
      icon: FaUsersGear,
      href: '/staff'
    },
    // {
    //   id: 'analytics',
    //   label: 'Analytics',
    //   icon: FaChartLine,
    //   href: '/analytics'
    // },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: MdSettings,
    //   href: '/settings'
    // }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return normalizedPath === '/dashboard' || normalizedPath === '/'
    }
    return normalizedPath.startsWith(href)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      logout()
    } finally {
      setIsLoggingOut(false)
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile overlay when mobile sidebar is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile menu button - shows when sidebar is hidden on mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-[#1D4E56] p-2.5 text-white shadow-lg shadow-[#1D4E56]/20 lg:hidden"
      >
        <FaBars />
      </button>
      
      <div className={`h-full border-r border-slate-200/80 bg-white/95 backdrop-blur transition-all duration-300 ${
        // On large screens: show/hide based on isCollapsed
        // On mobile: show only when isMobileOpen is true
        isCollapsed 
          ? 'hidden lg:block lg:w-[72px]' // Collapsed state on large screens
          : 'hidden lg:block lg:w-56' // Full width on large screens
      } ${
        // Mobile states
        isMobileOpen ? 'fixed left-0 top-0 z-40 w-56 shadow-2xl shadow-slate-900/10 lg:relative' : ''
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-3 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-[#1D4E56] to-[#2f7681] shadow-sm shadow-[#1D4E56]/20">
              <MdHome className="text-base text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Emilia</h2>
              <p className="text-[11px] text-slate-500">Admin Panel</p>
            </div>
          </div>
        )}
        
        {/* Desktop collapse button */}
        <button
          onClick={toggleCollapse}
          className="hidden rounded-xl p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 lg:block"
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
          className="rounded-xl p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        >
          <FaTimes className="text-gray-600 text-sm" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 px-3 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileOpen(false)} // Close mobile menu when item is clicked
              className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 ${
                active
                  ? 'bg-[#1D4E56] text-white shadow-sm shadow-[#1D4E56]/20'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#1D4E56]'
              }`}
            >
              <Icon className={`shrink-0 text-[18px] ${
                active ? 'text-white' : 'text-slate-400 group-hover:text-[#1D4E56]'
              }`} />
              
              {/* Show labels when not collapsed OR on mobile when open */}
              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="truncate text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state on desktop */}
              {isCollapsed && !isMobileOpen && (
                <div className="invisible absolute left-16 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 rounded bg-rose-500 px-1.5 py-0.5 text-[10px]">
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
      <div className="mt-auto border-t border-slate-200/80 px-3 py-3">
        <div className={`${isCollapsed && !isMobileOpen ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-slate-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60 ${
            isCollapsed && !isMobileOpen ? '' : 'w-full'
          }`}
          >
            <MdLogout className="text-lg shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            )}
          </button>
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-700">Admin User</p>
            <p className="text-[11px] text-slate-500">admin@emilia.co.ke</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
