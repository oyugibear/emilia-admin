'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'

export type GuestStatus = 'checked_in' | 'checked_out' | 'upcoming'
export type GuestModalType = 'add' | 'edit'

export interface GuestFormData {
  id?: string
  fullName: string
  email: string
  phone: string
  country: string
  dateOfBirth: string
  paymentStatus: string
  status: GuestStatus
  notes?: string
}

interface GuestModalProps {
  isOpen: boolean
  type: GuestModalType
  guest: GuestFormData | null
  onClose: () => void
  onSave: (guest: GuestFormData) => Promise<void> | void
}

const createDefaultGuest = (): GuestFormData => ({
  fullName: '',
  email: '',
  phone: '',
  country: '',
  dateOfBirth: '',
  paymentStatus: '',
  status: 'upcoming',
  notes: ''
})

export default function GuestModal({ isOpen, type, guest, onClose, onSave }: GuestModalProps) {
  const [form, setForm] = useState<GuestFormData>(() => createDefaultGuest())
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)
    setForm(guest ? { ...guest } : createDefaultGuest())
  }, [isOpen, guest])

  const handleChange = <K extends keyof GuestFormData>(key: K, value: GuestFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.fullName.trim().split(/\s+/).length < 2) {
      setSubmitError('Enter the guest’s first and last name.')
      return
    }
    if (!/^\+[1-9]\d{7,14}$/.test(form.phone.replace(/[\s()-]/g, ''))) {
      setSubmitError('Use international phone format, for example +254712345678.')
      return
    }
    setIsSaving(true)
    setSubmitError(null)

    try {
      await onSave({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        paymentStatus: form.paymentStatus.trim(),
        notes: form.notes?.trim() || undefined
      })
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save guest')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'Add Guest' : 'Edit Guest'}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={920}
    >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-xs font-medium text-gray-600">Full name *<input required value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="First and last name" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal" /></label>
            <label className="text-xs font-medium text-gray-600">Email *<input required type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="guest@example.com" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal" /></label>
            <label className="text-xs font-medium text-gray-600">Phone *<input required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+254712345678" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal" /><span className="mt-1 block text-[11px] text-gray-400">Include the country calling code.</span></label>
            <label className="text-xs font-medium text-gray-600">Country<input value={form.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="Kenya" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal" /></label>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Date of Birth</label>
              <input
                required
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <input
              value={form.paymentStatus}
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
              placeholder="Payment status (e.g. Paid, Pending)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value as GuestStatus)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
            </select>

            <div className="md:col-span-2">
              <textarea
                rows={3}
                value={form.notes ?? ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Notes"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670]"
            >
              {isSaving ? 'Saving...' : type === 'add' ? 'Add Guest' : 'Save Changes'}
            </button>
          </div>
        </form>
    </Modal>
  )
}
