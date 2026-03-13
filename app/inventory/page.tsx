'use client'

import React from 'react'
import AdminLayout from '../../components/shared/AdminLayout'
import InventoryManagement from '../../components/dashboard/InventoryManagement'

export default function InventoryPage() {
  return (
    <AdminLayout>
      <InventoryManagement />
    </AdminLayout>
  )
}
