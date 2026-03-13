'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'

type StaffRole = 'Manager' | 'Reception' | 'Housekeeping' | 'Maintenance' | 'Security'
type ProfileStatus = 'Probation' | 'Fired' | 'Active'
type StaffModalType = 'add' | 'edit' | 'view'
type ShiftDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
type ShiftType = 'Morning' | 'Afternoon' | 'Night'

interface ShiftScheduleItem {
  day: ShiftDay
  shift: ShiftType
}

export interface StaffFormData {
  id?: string
  first_name: string
  second_name: string
  email: string
  phone_number: string
  role: StaffRole
  profile_status: ProfileStatus
  date_of_birth: string
  salary: number | null
  date_of_hire: string
  last_payment_date: string
  notes: string
  shift_schedule: ShiftScheduleItem[]
}

interface StaffModalProps {
  isOpen: boolean
  type: StaffModalType
  staff: StaffFormData | null
  onClose: () => void
  onSave: (staff: StaffFormData) => Promise<void> | void
}

const defaultShiftSchedule = (): ShiftScheduleItem[] => [{ day: 'Monday', shift: 'Morning' }]

const createDefaultStaff = (): StaffFormData => ({
  first_name: '',
  second_name: '',
  email: '',
  phone_number: '',
  role: 'Reception',
  profile_status: 'Active',
  date_of_birth: '',
  salary: null,
  date_of_hire: '',
  last_payment_date: '',
  notes: '',
  shift_schedule: defaultShiftSchedule()
})

const cloneStaffForm = (staff: StaffFormData): StaffFormData => ({
  ...staff,
  shift_schedule: (staff.shift_schedule?.length ? staff.shift_schedule : defaultShiftSchedule()).map((entry) => ({
    day: entry.day,
    shift: entry.shift
  }))
})

export default function StaffModal({ isOpen, type, staff, onClose, onSave }: StaffModalProps) {
  const [form, setForm] = useState<StaffFormData>(() => createDefaultStaff())
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)

    if ((type === 'edit' || type === 'view') && staff) {
      setForm(cloneStaffForm(staff))
      return
    }

    setForm(createDefaultStaff())
  }, [isOpen, type, staff])

  const handleChange = <K extends keyof StaffFormData>(key: K, value: StaffFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleShiftScheduleChange = (index: number, key: keyof ShiftScheduleItem, value: ShiftScheduleItem[keyof ShiftScheduleItem]) => {
    setForm((prev) => ({
      ...prev,
      shift_schedule: prev.shift_schedule.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry))
    }))
  }

  const addShiftScheduleEntry = () => {
    setForm((prev) => ({
      ...prev,
      shift_schedule: [...prev.shift_schedule, { day: 'Monday', shift: 'Morning' }]
    }))
  }

  const removeShiftScheduleEntry = (index: number) => {
    setForm((prev) => ({
      ...prev,
      shift_schedule: prev.shift_schedule.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setSubmitError(null)

    try {
      const normalizedShiftSchedule = (form.shift_schedule?.length ? form.shift_schedule : defaultShiftSchedule())
        .map((entry) => ({
          day: entry.day,
          shift: entry.shift
        }))

      await onSave({
        ...form,
        first_name: form.first_name.trim(),
        second_name: form.second_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        notes: form.notes.trim(),
        shift_schedule: normalizedShiftSchedule
      })
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save staff record')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'Add Staff Member' : type === 'edit' ? 'Edit Staff Member' : 'View Staff Member'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={920}
    >
        {type === 'view' ? (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Staff Summary (View)</h4>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <p><span className="font-medium text-gray-700">Full Name:</span> {`${form.first_name} ${form.second_name}`.trim() || '-'}</p>
                <p><span className="font-medium text-gray-700">Email:</span> {form.email || '-'}</p>
                <p><span className="font-medium text-gray-700">Phone:</span> {form.phone_number || '-'}</p>
                <p><span className="font-medium text-gray-700">Role:</span> {form.role}</p>
                <p><span className="font-medium text-gray-700">Profile Status:</span> {form.profile_status}</p>
                <p><span className="font-medium text-gray-700">Date of Birth:</span> {form.date_of_birth || '-'}</p>
                <p><span className="font-medium text-gray-700">Salary:</span> {typeof form.salary === 'number' ? `$${form.salary.toLocaleString()}` : '-'}</p>
                <p><span className="font-medium text-gray-700">Date of Hire:</span> {form.date_of_hire || '-'}</p>
                <p><span className="font-medium text-gray-700">Last Payment:</span> {form.last_payment_date || '-'}</p>
                <p className="md:col-span-2"><span className="font-medium text-gray-700">Notes:</span> {form.notes || '-'}</p>
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-700">Shift Schedule:</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                    {(form.shift_schedule?.length ? form.shift_schedule : []).map((entry, index) => (
                      <li key={`${entry.day}-${entry.shift}-${index}`}>{entry.day} - {entry.shift}</li>
                    ))}
                    {!form.shift_schedule?.length && <li>-</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">
                Close
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} placeholder="First name" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input required value={form.second_name} onChange={(e) => handleChange('second_name', e.target.value)} placeholder="Second name" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input required value={form.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} placeholder="Phone number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />

            <select value={form.role} onChange={(e) => handleChange('role', e.target.value as StaffRole)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="Manager">Manager</option>
              <option value="Reception">Reception</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
            </select>

            <select value={form.profile_status} onChange={(e) => handleChange('profile_status', e.target.value as ProfileStatus)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Fired">Fired</option>
            </select>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Date of Birth</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Salary</label>
              <input type="number" min={0} value={form.salary ?? ''} onChange={(e) => handleChange('salary', e.target.value ? Number(e.target.value) : null)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Date of Hire</label>
              <input type="date" value={form.date_of_hire} onChange={(e) => handleChange('date_of_hire', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Last Payment Date</label>
              <input type="date" value={form.last_payment_date} onChange={(e) => handleChange('last_payment_date', e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2">
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} placeholder="Notes" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2 rounded-md border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Shift Schedule</label>
                <button
                  type="button"
                  onClick={addShiftScheduleEntry}
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Add Shift
                </button>
              </div>

              <div className="space-y-2">
                {form.shift_schedule.map((entry, index) => (
                  <div key={`${entry.day}-${entry.shift}-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <select
                      value={entry.day}
                      onChange={(e) => handleShiftScheduleChange(index, 'day', e.target.value as ShiftDay)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>

                    <select
                      value={entry.shift}
                      onChange={(e) => handleShiftScheduleChange(index, 'shift', e.target.value as ShiftType)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeShiftScheduleEntry(index)}
                      disabled={form.shift_schedule.length === 1}
                      className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670]">
              {isSaving ? 'Saving...' : type === 'add' ? 'Add Staff' : 'Save Changes'}
            </button>
          </div>
        </form>
        )}
    </Modal>
  )
}
