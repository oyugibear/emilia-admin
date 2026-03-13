'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import type { MaintenanceModalProps, MaintenanceRequest } from '@/types'

const defaultMaintenance: MaintenanceRequest = {
  apiId: '',
  id: '',
  room: '',
  issue: '',
  priority: 'medium',
  status: 'pending',
  assignedTo: null,
  date: new Date().toISOString().slice(0, 10),
  duration: '',
  notes: ''
}

export default function MaintenanceModal({ isOpen, type, maintenance, roomNumbers, onClose, onSave }: MaintenanceModalProps) {
  const [form, setForm] = useState<MaintenanceRequest>(defaultMaintenance)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)

    if (type === 'edit' && maintenance) {
      setForm(maintenance)
      return
    }

    setForm(defaultMaintenance)
  }, [isOpen, type, maintenance])

  const handleChange = <K extends keyof MaintenanceRequest>(key: K, value: MaintenanceRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSubmitError(null)

    const normalized: MaintenanceRequest = {
      ...form,
      room: form.room.trim(),
      issue: form.issue.trim(),
      assignedTo: form.assignedTo?.trim() || null,
      duration: form.duration?.trim() || undefined,
      notes: form.notes?.trim() || undefined
    }

    try {
      await onSave(normalized)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save maintenance record')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'Add Maintenance Request' : 'Edit Maintenance Request'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
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
              <label className="mb-1 block text-sm text-gray-700">Room</label>
              <select
                required
                value={form.room}
                onChange={(e) => handleChange('room', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="">Select room</option>
                {roomNumbers.map((roomNumber) => (
                  <option key={roomNumber} value={roomNumber}>
                    {roomNumber}
                  </option>
                ))}
                {form.room && !roomNumbers.includes(form.room) && (
                  <option value={form.room}>{form.room}</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Date</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-gray-700">Issue</label>
              <textarea
                required
                value={form.issue}
                onChange={(e) => handleChange('issue', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="Describe the maintenance issue"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value as MaintenanceRequest['priority'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as MaintenanceRequest['status'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Assigned To (optional)</label>
              <input
                value={form.assignedTo ?? ''}
                onChange={(e) => handleChange('assignedTo', e.target.value || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="Technician name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Duration (optional)</label>
              <input
                value={form.duration ?? ''}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="e.g. 2 hours"
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
              {isSaving ? 'Saving...' : type === 'add' ? 'Add Request' : 'Save Changes'}
            </button>
          </div>
        </form>
    </Modal>
  )
}
