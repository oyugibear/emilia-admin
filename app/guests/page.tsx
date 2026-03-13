'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import AdminLayout from '../../components/shared/AdminLayout'

const Guests = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-600">Loading guests...</div>
})

export default function GuestsPage() {
  return (
    <AdminLayout>
      <Guests />
    </AdminLayout>
  )
}
