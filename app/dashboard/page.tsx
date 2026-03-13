'use client'

import React from 'react'
import AdminLayout from '../../components/shared/AdminLayout'
import DashboardOverview from '../../components/dashboard/DashboardOverview'

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardOverview />
    </AdminLayout>
  )
}
