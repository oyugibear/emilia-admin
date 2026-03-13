'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, Spin } from 'antd'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'

export type BookingStatus = 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled'
export type BookingModalType = 'add' | 'edit'

export interface BookingFormData {
  id?: string
  guestId?: string
  /** Populated when the user fills in a brand-new guest (no guestId) */
  newGuest?: {
    first_name: string
    second_name: string
    email: string
    phone_number: string
  }
  guestName: string
  guestEmail: string
  guestPhone: string
  room: string
  apartmentType: string
  checkInDate: string
  checkOutDate: string
  adultCount: number
  childCount: number
  totalAmount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  status: BookingStatus
  specialRequest?: string
}

interface GuestOption {
  id: string
  fullName: string
  email: string
  phone: string
}

interface GuestApiRecord {
  _id: string
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
}

interface RoomApiRecord {
  _id: string
  room_number?: string
  type?: string
}

interface RoomOption {
  id: string
  roomNumber: string
  type: string
}

interface BookingModalProps {
  isOpen: boolean
  type: BookingModalType
  booking: BookingFormData | null
  onClose: () => void
  onSave: (booking: BookingFormData) => Promise<void> | void
}

const APARTMENT_TYPES = ['Studio', 'One Bedroom', 'Two Bedroom', 'Three Bedroom', 'Penthouse']

const createDefaultBooking = (): BookingFormData => ({
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  room: '',
  apartmentType: 'Studio',
  checkInDate: '',
  checkOutDate: '',
  adultCount: 1,
  childCount: 0,
  totalAmount: 0,
  paymentStatus: 'unpaid',
  status: 'pending',
  specialRequest: ''
})

const inputCls =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1D4E56] focus:outline-none focus:ring-1 focus:ring-[#1D4E56]'
const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

export default function BookingModal({ isOpen, type, booking, onClose, onSave }: BookingModalProps) {
  const [form, setForm] = useState<BookingFormData>(() => createDefaultBooking())
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Guest lookup state
  const [guestMode, setGuestMode] = useState<'existing' | 'new'>('existing')
  const [guestSearch, setGuestSearch] = useState('')
  const [guestOptions, setGuestOptions] = useState<GuestOption[]>([])
  const [filteredGuests, setFilteredGuests] = useState<GuestOption[]>([])
  const [guestsLoading, setGuestsLoading] = useState(false)
  const [guestsError, setGuestsError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<GuestOption | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Room dropdown state
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)

  // Fetch all guests once when modal opens
  const fetchGuests = useCallback(async () => {
    if (guestOptions.length > 0) return
    setGuestsLoading(true)
    setGuestsError(null)
    try {
      const res = await apiClient.get<{ data: GuestApiRecord[] }>(API_ENDPOINTS.guests.all)
      const list: GuestApiRecord[] = Array.isArray(res?.data) ? res.data : []
      setGuestOptions(
        list.map((g) => ({
          id: g._id,
          fullName: [g.first_name, g.second_name].filter(Boolean).join(' ').trim() || 'Unknown',
          email: g.email || '',
          phone: g.phone_number || ''
        }))
      )
    } catch {
      setGuestsError('Could not load guests')
    } finally {
      setGuestsLoading(false)
    }
  }, [guestOptions.length])

  // Fetch all rooms once when modal opens
  const fetchRooms = useCallback(async () => {
    if (roomOptions.length > 0) return
    setRoomsLoading(true)
    setRoomsError(null)
    try {
      const res = await apiClient.get<{ data: RoomApiRecord[] }>(API_ENDPOINTS.rooms.all)
      const list: RoomApiRecord[] = Array.isArray(res?.data) ? res.data : []
      setRoomOptions(
        list
          .filter((room) => room.room_number)
          .map((room) => ({
            id: room._id,
            roomNumber: room.room_number || '',
            type: room.type || 'Studio'
          }))
      )
    } catch {
      setRoomsError('Could not load rooms')
    } finally {
      setRoomsLoading(false)
    }
  }, [roomOptions.length])

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)
    setGuestSearch('')
    setDropdownOpen(false)
    if (booking) {
      setForm({ ...booking })
      // In edit mode default to new (fields already filled)
      setGuestMode('new')
      setSelectedGuest(
        booking.guestId
          ? { id: booking.guestId, fullName: booking.guestName, email: booking.guestEmail, phone: booking.guestPhone }
          : null
      )
    } else {
      setForm(createDefaultBooking())
      setGuestMode('existing')
      setSelectedGuest(null)
    }
  }, [isOpen, booking])

  // Fetch guest list when switching to "existing" mode
  useEffect(() => {
    if (isOpen && guestMode === 'existing') {
      fetchGuests()
    }
  }, [isOpen, guestMode, fetchGuests])

  useEffect(() => {
    if (isOpen) {
      fetchRooms()
    }
  }, [isOpen, fetchRooms])

  // Filter guests on search input
  useEffect(() => {
    const q = guestSearch.toLowerCase()
    setFilteredGuests(
      q.length === 0
        ? guestOptions.slice(0, 8)
        : guestOptions
            .filter(
              (g) =>
                g.fullName.toLowerCase().includes(q) ||
                g.email.toLowerCase().includes(q) ||
                g.phone.toLowerCase().includes(q)
            )
            .slice(0, 8)
    )
  }, [guestSearch, guestOptions])

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleSelectGuest = (guest: GuestOption) => {
    setSelectedGuest(guest)
    setForm((prev) => ({
      ...prev,
      guestId: guest.id,
      guestName: guest.fullName,
      guestEmail: guest.email,
      guestPhone: guest.phone
    }))
    setGuestSearch(guest.fullName)
    setDropdownOpen(false)
  }

  const handleClearGuest = () => {
    setSelectedGuest(null)
    setGuestSearch('')
    setForm((prev) => ({ ...prev, guestId: undefined, guestName: '', guestEmail: '', guestPhone: '' }))
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  const handleChange = <K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (guestMode === 'existing' && !selectedGuest) {
      setSubmitError('Please select an existing guest or switch to "New Guest" to enter details manually.')
      return
    }
    setIsSaving(true)
    setSubmitError(null)

    // Build the newGuest object for the backend when creating a fresh guest
    let newGuestPayload: BookingFormData['newGuest'] | undefined
    if (guestMode === 'new' && !form.guestId) {
      const nameParts = form.guestName.trim().split(/\s+/).filter(Boolean)
      const [first_name = form.guestName.trim(), ...rest] = nameParts
      newGuestPayload = {
        first_name,
        second_name: rest.join(' ') || 'N/A',
        email: form.guestEmail.trim(),
        phone_number: form.guestPhone.trim()
      }
    }

    try {
      await onSave({
        ...form,
        guestName: form.guestName.trim(),
        guestEmail: form.guestEmail.trim(),
        guestPhone: form.guestPhone.trim(),
        room: form.room.trim(),
        specialRequest: form.specialRequest?.trim() || undefined,
        newGuest: newGuestPayload
      })
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save booking')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'New Booking' : 'Edit Booking'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={960}
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* ── Guest Section ───────────────────────────────────── */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Guest</p>
            {/* Mode toggle */}
            <div className="flex rounded-md border border-gray-300 bg-white text-xs overflow-hidden">
              <button
                type="button"
                onClick={() => { setGuestMode('existing'); setSelectedGuest(null); setGuestSearch(''); setForm((p) => ({ ...p, guestId: undefined, guestName: '', guestEmail: '', guestPhone: '' })) }}
                className={`px-3 py-1 transition-colors ${guestMode === 'existing' ? 'bg-[#1D4E56] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Existing Guest
              </button>
              <button
                type="button"
                onClick={() => { setGuestMode('new'); setSelectedGuest(null); setGuestSearch(''); setForm((p) => ({ ...p, guestId: undefined, guestName: '', guestEmail: '', guestPhone: '' })) }}
                className={`px-3 py-1 transition-colors ${guestMode === 'new' ? 'bg-[#1D4E56] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                New Guest
              </button>
            </div>
          </div>

          {guestMode === 'existing' ? (
            /* ── Existing guest search ── */
            <div>
              {selectedGuest ? (
                /* Selected guest pill */
                <div className="flex items-center justify-between rounded-md border border-[#1D4E56]/30 bg-[#1D4E56]/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D4E56] text-xs font-bold text-white">
                      {selectedGuest.fullName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{selectedGuest.fullName}</p>
                      <p className="text-xs text-gray-500">{selectedGuest.email} · {selectedGuest.phone}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearGuest}
                    className="rounded px-2 py-0.5 text-xs text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    Change
                  </button>
                </div>
              ) : (
                /* Search input + dropdown */
                <div className="relative">
                  {guestsLoading ? (
                    <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400">
                      <Spin size="small" /> Loading guests…
                    </div>
                  ) : guestsError ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                      {guestsError} —{' '}
                      <button type="button" className="underline" onClick={() => { setGuestOptions([]); fetchGuests() }}>
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={searchRef}
                        value={guestSearch}
                        onChange={(e) => { setGuestSearch(e.target.value); setDropdownOpen(true) }}
                        onFocus={() => setDropdownOpen(true)}
                        placeholder="Search by name, email, or phone…"
                        className={inputCls}
                        autoComplete="off"
                      />
                      {dropdownOpen && filteredGuests.length > 0 && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                          {filteredGuests.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onMouseDown={() => handleSelectGuest(g)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D4E56] text-[10px] font-bold text-white">
                                {g.fullName.charAt(0).toUpperCase()}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-gray-800">{g.fullName}</p>
                                <p className="truncate text-xs text-gray-500">{g.email} · {g.phone}</p>
                              </div>
                            </button>
                          ))}
                          {guestOptions.length > 8 && guestSearch.length === 0 && (
                            <p className="px-3 py-1.5 text-center text-xs text-gray-400">
                              Type to search all {guestOptions.length} guests
                            </p>
                          )}
                        </div>
                      )}
                      {dropdownOpen && guestSearch.length > 0 && filteredGuests.length === 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-center text-sm text-gray-500 shadow-lg">
                          No guests found for &ldquo;{guestSearch}&rdquo;
                          <br />
                          <button
                            type="button"
                            className="mt-1 text-xs text-[#1D4E56] underline"
                            onMouseDown={() => { setGuestMode('new'); setForm((p) => ({ ...p, guestName: guestSearch })) }}
                          >
                            Create a new guest instead
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── New guest fields ── */
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  required
                  value={form.guestName}
                  onChange={(e) => handleChange('guestName', e.target.value)}
                  placeholder="e.g. John Smith"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input
                  required
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => handleChange('guestEmail', e.target.value)}
                  placeholder="guest@email.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone *</label>
                <input
                  required
                  value={form.guestPhone}
                  onChange={(e) => handleChange('guestPhone', e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className={inputCls}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Room & Stay ──────────────────────────────────────── */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Room &amp; Stay</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className={labelCls}>Room Number *</label>
              <select
                required
                value={form.room}
                onChange={(e) => {
                  const nextRoom = e.target.value
                  const selectedRoom = roomOptions.find((r) => r.roomNumber === nextRoom)
                  setForm((prev) => ({
                    ...prev,
                    room: nextRoom,
                    apartmentType: selectedRoom?.type || prev.apartmentType
                  }))
                }}
                className={inputCls}
                disabled={roomsLoading}
              >
                <option value="" disabled>
                  {roomsLoading ? 'Loading rooms…' : 'Select room number'}
                </option>
                {roomOptions.map((room) => (
                  <option key={room.id} value={room.roomNumber}>
                    {room.roomNumber}
                  </option>
                ))}
                {form.room && !roomOptions.some((room) => room.roomNumber === form.room) && (
                  <option value={form.room}>{form.room}</option>
                )}
              </select>
              {roomsError && (
                <p className="mt-1 text-xs text-red-600">
                  {roomsError}.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRoomOptions([])
                      fetchRooms()
                    }}
                    className="underline"
                  >
                    Retry
                  </button>
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Apartment Type *</label>
              <select
                required
                value={form.apartmentType}
                onChange={(e) => handleChange('apartmentType', e.target.value)}
                className={inputCls}
              >
                {APARTMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Check-In Date *</label>
              <input
                required
                type="date"
                value={form.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Check-Out Date *</label>
              <input
                required
                type="date"
                value={form.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── Guests & Payment ─────────────────────────────────── */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Guests &amp; Payment</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <label className={labelCls}>Adults *</label>
              <input
                required
                type="number"
                min={1}
                value={form.adultCount}
                onChange={(e) => handleChange('adultCount', Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Children</label>
              <input
                type="number"
                min={0}
                value={form.childCount}
                onChange={(e) => handleChange('childCount', Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Total Amount ($) *</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={form.totalAmount}
                onChange={(e) => handleChange('totalAmount', Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Payment Status *</label>
              <select
                required
                value={form.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value as BookingFormData['paymentStatus'])}
                className={inputCls}
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Booking Status ───────────────────────────────────── */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Booking Status</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className={labelCls}>Status *</label>
              <select
                required
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value as BookingStatus)}
                className={inputCls}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Special Request</label>
              <input
                value={form.specialRequest ?? ''}
                onChange={(e) => handleChange('specialRequest', e.target.value)}
                placeholder="Any special requests…"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : type === 'add' ? 'Create Booking' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
