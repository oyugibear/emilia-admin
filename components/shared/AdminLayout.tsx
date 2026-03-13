'use client'

import React from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex-1 bg-gray-100 ml-0 lg:ml-0">
      {/* Main Content */}
      <main className="px-6 py-8 pt-16 lg:pt-8"> {/* Add top padding on mobile for the menu button */}
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
