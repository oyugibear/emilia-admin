'use client'

import React from 'react'
import AdminLayout from '../../components/shared/AdminLayout'
import HousekeepingManagement from '../../components/dashboard/HousekeepingManagement'

export default function HousekeepingPage() {
  return (
    <AdminLayout>
      <HousekeepingManagement />
    </AdminLayout>
  )
}
