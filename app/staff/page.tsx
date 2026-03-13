'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import AdminLayout from '@/components/shared/AdminLayout'

const StaffPageContent = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-600">Loading staff members...</div>
})

export default function StaffPage() {
  return (
    <AdminLayout>
      <StaffPageContent />
    </AdminLayout>
  )
}
