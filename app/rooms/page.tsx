'use client'

import React from 'react'
import AdminLayout from '../../components/shared/AdminLayout'
import RoomsManagement from '../../components/dashboard/RoomsManagement'

export default function RoomsPage() {
  return (
    <AdminLayout>
      <RoomsManagement />
    </AdminLayout>
  )
}
