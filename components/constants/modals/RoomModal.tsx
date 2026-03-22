'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import type { Room, RoomModalProps } from '@/types'

const defaultRoom: Room = {
  id: '',
  type: 'Studio',
  status: 'available',
  guest: null,
  checkout: null,
  maintenance: 'none',
  cleanliness: 'clean',
  floor: 1,
  price: 85
}

export default function RoomModal({ isOpen, type, room, onClose, onSave }: RoomModalProps) {
  const [form, setForm] = useState<Room>(defaultRoom)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)
    if (type === 'edit' && room) {
      setForm(room)
      return
    }
    setForm(defaultRoom)
  }, [isOpen, type, room])

  const handleChange = <K extends keyof Room>(key: K, value: Room[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSaving(true)

    const normalizedRoom: Room = {
      ...form,
      id: form.id.trim(),
      guest: form.guest && form.guest.trim() ? form.guest.trim() : null,
      checkout: form.checkout && form.checkout.trim() ? form.checkout.trim() : null,
      maintenance: form.maintenance.trim() || 'none'
    }

    try {
      await onSave(normalizedRoom)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save room')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'Add Room' : 'Edit Room'}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={800}
    >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-700">Room ID</label>
              <input
                required
                value={form.id}
                onChange={(e) => handleChange('id', e.target.value)}
                disabled={type === 'edit'}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56] disabled:bg-gray-100"
                placeholder="e.g. S005"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Type</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value as Room['type'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="Studio">Studio</option>
                <option value="1-Bedroom">1-Bedroom</option>
                <option value="2-Bedroom">2-Bedroom</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as Room['status'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="checkout">Checkout</option>
                <option value="housekeeping">Housekeeping</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Floor</label>
              <input
                required
                type="number"
                min={1}
                value={form.floor}
                onChange={(e) => handleChange('floor', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Price / night</label>
              <input
                required
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Guest (optional)</label>
              <input
                value={form.guest ?? ''}
                onChange={(e) => handleChange('guest', e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="Guest name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Checkout (optional)</label>
              <input
                type="date"
                value={form.checkout ?? ''}
                onChange={(e) => handleChange('checkout', e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Maintenance</label>
              <input
                value={form.maintenance}
                onChange={(e) => handleChange('maintenance', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670]"
            >
              {isSaving ? 'Saving...' : type === 'add' ? 'Add Room' : 'Save Changes'}
            </button>
          </div>
        </form>
    </Modal>
  )
}
