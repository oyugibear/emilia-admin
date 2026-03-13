'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated) {
      router.replace('/dashboard')
    } else {
      router.replace('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#1D4E56] rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-xl font-bold">E</span>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
