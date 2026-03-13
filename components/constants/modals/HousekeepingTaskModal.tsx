'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import type { HousekeepingTask } from '@/components/housekeeping/TaskCard'

export interface HousekeepingTaskFormData {
  roomId: string
  roomNumber: string
  roomType: HousekeepingTask['roomType']
  taskType: HousekeepingTask['taskType']
  priority: HousekeepingTask['priority']
  status: HousekeepingTask['status']
  assignedTo: string
  scheduledTime: string
  estimatedDuration: number
  guestCheckOut?: string
  guestCheckIn?: string
  notes?: string
}

interface HousekeepingTaskModalProps {
  isOpen: boolean
  rooms: Array<{
    id: string
    number: string
    type: HousekeepingTask['roomType']
  }>
  staffOptions: string[]
  onClose: () => void
  onSave: (task: HousekeepingTaskFormData) => Promise<void> | void
}

const createDefaultTask = (): HousekeepingTaskFormData => ({
  roomId: '',
  roomNumber: '',
  roomType: 'Studio',
  taskType: 'checkout_cleaning',
  priority: 'medium',
  status: 'pending',
  assignedTo: 'Unassigned',
  scheduledTime: '',
  estimatedDuration: 45,
  guestCheckOut: '',
  guestCheckIn: '',
  notes: ''
})

export default function HousekeepingTaskModal({ isOpen, rooms, staffOptions, onClose, onSave }: HousekeepingTaskModalProps) {
  const [form, setForm] = useState<HousekeepingTaskFormData>(() => createDefaultTask())
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const defaultRoom = rooms[0]
    setForm({
      ...createDefaultTask(),
      roomId: defaultRoom?.id || '',
      roomNumber: defaultRoom?.number || '',
      roomType: defaultRoom?.type || 'Studio'
    })
    setSubmitError(null)
  }, [isOpen, rooms])

  const handleChange = <K extends keyof HousekeepingTaskFormData>(key: K, value: HousekeepingTaskFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = rooms.find((room) => room.id === roomId)

    setForm((prev) => ({
      ...prev,
      roomId,
      roomNumber: selectedRoom?.number || '',
      roomType: selectedRoom?.type || 'Studio'
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSubmitError(null)

    try {
      await onSave({
        ...form,
        roomId: form.roomId,
        roomNumber: form.roomNumber.trim(),
        assignedTo: form.assignedTo.trim() || 'Unassigned',
        scheduledTime: form.scheduledTime.trim(),
        guestCheckOut: form.guestCheckOut?.trim() || undefined,
        guestCheckIn: form.guestCheckIn?.trim() || undefined,
        notes: form.notes?.trim() || undefined
      })
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add housekeeping task')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title="Add Housekeeping Task"
      onCancel={onClose}
      footer={null}
      destroyOnClose
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
            <div>
              <label className="mb-1 block text-sm text-gray-700">Room</label>
              <select
                required
                value={form.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {`${room.number} • ${room.type}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Room Type</label>
              <select
                value={form.roomType}
                onChange={(e) => handleChange('roomType', e.target.value as HousekeepingTask['roomType'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                disabled
              >
                <option value="Studio">Studio</option>
                <option value="One Bedroom">One Bedroom</option>
                <option value="Two Bedroom">Two Bedroom</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Task Type</label>
              <select
                value={form.taskType}
                onChange={(e) => handleChange('taskType', e.target.value as HousekeepingTask['taskType'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="checkout_cleaning">Checkout Cleaning</option>
                <option value="maintenance_cleaning">Maintenance Cleaning</option>
                <option value="deep_cleaning">Deep Cleaning</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value as HousekeepingTask['priority'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Scheduled Time</label>
              <input
                required
                type="time"
                value={form.scheduledTime}
                onChange={(e) => handleChange('scheduledTime', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Estimated Duration (minutes)</label>
              <input
                required
                min={5}
                type="number"
                value={form.estimatedDuration}
                onChange={(e) => handleChange('estimatedDuration', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Assign To</label>
              <select
                value={form.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="Unassigned">Unassigned</option>
                {staffOptions.map((staffName) => (
                  <option key={staffName} value={staffName}>
                    {staffName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as HousekeepingTask['status'])}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Guest Check-out</label>
              <input
                type="time"
                value={form.guestCheckOut}
                onChange={(e) => handleChange('guestCheckOut', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Guest Check-in</label>
              <input
                type="time"
                value={form.guestCheckIn}
                onChange={(e) => handleChange('guestCheckIn', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-gray-700">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="Add task notes"
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
              {isSaving ? 'Saving...' : 'Add Task'}
            </button>
          </div>
        </form>
    </Modal>
  )
}