'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return

    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? '/dashboard' : '/auth')
    }, 700)

    return () => clearTimeout(timer)
  }, [mounted, isLoading, isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-[#1D4E56] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <span className="text-white text-xl font-bold">E</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Emilia</h1>
        <p className="text-gray-600">Preparing your dashboard...</p>
      </div>
    </div>
  )
}