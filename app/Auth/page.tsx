'use client'

import React, { useState } from 'react'
import { FaUser, FaShieldAlt } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import Input from '@/components/UI/Input'
import PasswordInput from '@/components/UI/PasswordInput'
import Button from '@/components/UI/Button'
import Checkbox from '@/components/UI/Checkbox'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error and success when user starts typing
    if (error) setError('')
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Simulate API call - replace with actual authentication logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      
      // Mock authentication - in real app, validate against backend
      if (formData.username === 'admin' && formData.password === 'emilia2025') {
        // Store auth token or session
        localStorage.setItem('emilia_admin_token', 'mock_token_123')
        setSuccess(true)
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/') // Redirect to admin dashboard
        }, 1000)
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1D4E56] opacity-5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1D4E56] opacity-5 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo/Icon */}
            <div className="mx-auto w-16 h-16 bg-[#1D4E56] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <MdAdminPanelSettings className="text-white text-2xl" />
            </div>
            
            {/* Brand */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Emilia <span className="font-light text-[#1D4E56]">Admin</span>
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base">
              Secure access to property management dashboard
            </p>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center mt-6 mb-8">
              <div className="w-12 h-px bg-gray-300"></div>
              <FaShieldAlt className="mx-3 text-[#1D4E56] text-sm" />
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center font-medium">
                ✓ Login successful! Redirecting to dashboard...
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
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

            {/* Password Field */}
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              label="Password"
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                label="Remember me"
              />
              <button
                type="button"
                className="text-[#1D4E56] hover:text-[#2a6670] font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="lg"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Username:</span> admin</p>
              <p><span className="font-medium">Password:</span> emilia2025</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Emilia Residences. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Secure admin access protected by industry-standard encryption
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-gray-600">🔒</span>
            <p className="text-xs text-gray-600 font-medium">
              Secure Area - All activities monitored
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
