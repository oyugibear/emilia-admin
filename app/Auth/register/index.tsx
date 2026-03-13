'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import Input from '@/components/UI/Input'
import PasswordInput from '@/components/UI/PasswordInput'
import Button from '@/components/UI/Button'
import Checkbox from '@/components/UI/Checkbox'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // basic placeholder auth flow
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (formData.username === 'admin' && formData.password === 'emilia2025') {
      localStorage.setItem('emilia_admin_token', 'mock_token_123')
      router.push('/dashboard')
      return
    }

    setError('Invalid username or password')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-[#1D4E56] rounded-full flex items-center justify-center mb-4">
            <MdAdminPanelSettings className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-600 mt-1">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            label="Username"
            icon={FaUser}
            required
          />

          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            label="Password"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
            />
            <Link href="/Auth/ForgotPassword" className="text-[#1D4E56] hover:text-[#2a6670] font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={isLoading} disabled={isLoading} variant="primary" size="lg">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
