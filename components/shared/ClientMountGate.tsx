'use client'

import React, { useEffect, useState } from 'react'

interface ClientMountGateProps {
  children: React.ReactNode
}

function FullPageLoader() {
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

export default function ClientMountGate({ children }: ClientMountGateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FullPageLoader />
  }

  return <>{children}</>
}
