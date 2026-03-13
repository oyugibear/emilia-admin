'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaEnvelope, FaShieldAlt } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import { authApi } from '@/lib/core/auth-api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    try {
      await authApi.forgotPassword(email)

      setSuccess('Reset code sent successfully. Check your email for the confirmation code.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-[#1D4E56] rounded-full flex items-center justify-center mb-5 shadow-lg">
              <MdAdminPanelSettings className="text-white text-xl" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Forgot <span className="font-light text-[#1D4E56]">Password</span>
            </h1>

            <p className="text-gray-600 text-sm md:text-base">
              Enter your admin email and we&apos;ll send a reset code.
            </p>

            <div className="flex items-center justify-center mt-5 mb-6">
              <div className="w-12 h-px bg-gray-300"></div>
              <FaShieldAlt className="mx-3 text-[#1D4E56] text-sm" />
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              label="Email Address"
              icon={FaEnvelope}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="lg"
            >
              Send Reset Code
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth"
              className="text-sm font-medium text-[#1D4E56] hover:text-[#2a6670] transition-colors duration-200"
            >
              Back to login
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Emilia Residences. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Secure admin recovery protected by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
