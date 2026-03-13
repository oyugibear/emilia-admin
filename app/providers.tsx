'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import AuthGuard from '@/components/shared/AuthGuard'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  )
}
