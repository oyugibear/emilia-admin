'use client'

import React from 'react'
import AdminLayout from '../../components/shared/AdminLayout'
import MaintenanceManagement from '../../components/dashboard/MaintenanceManagement'

export default function MaintenancePage() {
  return (
    <AdminLayout>
      <MaintenanceManagement />
    </AdminLayout>
  )
}
