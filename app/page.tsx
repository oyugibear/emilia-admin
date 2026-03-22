'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    router.replace(isAuthenticated ? '/dashboard' : '/auth')
  }, [isLoading, isAuthenticated, router])

  return null
}