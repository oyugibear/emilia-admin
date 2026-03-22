'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D4E56] mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const normalizedPath = (pathname ?? '').toLowerCase()
  const isPublicRoute = normalizedPath === '/' || normalizedPath.startsWith('/auth')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace('/auth')
    }
  }, [mounted, isAuthenticated, isLoading, isPublicRoute, router])

  // Before hydration: always render a deterministic fallback.
  // This avoids pathname-dependent server/client differences that can trigger hydration errors.
  if (!mounted) {
    return <Spinner />
  }

  if (isLoading && !isPublicRoute) {
    return <Spinner />
  }

  if (!isLoading && !isAuthenticated && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
