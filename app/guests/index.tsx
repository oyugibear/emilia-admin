'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, Button, Descriptions, Modal, Space, Table, Tag, message } from 'antd'
import type { TableProps } from 'antd'
import GuestModal, { type GuestFormData, type GuestModalType, type GuestStatus } from '@/components/constants/modals/GuestModal'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'

interface GuestApiBooking {
  _id?: string
  check_in_date?: string
  check_out_date?: string
}

interface GuestApiNote {
  note?: string
  createdAt?: string
}

interface GuestApiRecord {
  _id: string
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
  date_of_birth?: string
  payment_status?: string
  previous_bookings?: GuestApiBooking[]
  status?: string
  notes?: GuestApiNote[]
  createdAt?: string
}

interface GuestListResponse {
  data: GuestApiRecord[]
  message: string
  status: string
}

interface Guest extends GuestFormData {
  id: string
  displayId: string
  previousBookingsCount: number
  lastCheckInDate: string
  lastCheckOutDate: string
  createdAt: string
}

const FALLBACK_VALUE = '—'

const normalizeStatus = (value?: string): GuestStatus => {
  const status = (value || '').toLowerCase().replace(/[-\s]+/g, '_')

  if (status === 'checked_in') return 'checked_in'
  if (status === 'checked_out') return 'checked_out'
  return 'upcoming'
}

const formatText = (value?: string, fallback = FALLBACK_VALUE) => {
  if (!value?.trim()) return fallback

  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

const getStatusTag = (status: GuestStatus) => {
  if (status === 'checked_in') return <Tag color="green">Checked In</Tag>
  if (status === 'checked_out') return <Tag color="default">Checked Out</Tag>
  return <Tag color="blue">Upcoming</Tag>
}

const getPaymentStatusTag = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized.includes('paid')) return <Tag color="green">{formatText(status)}</Tag>
  if (normalized.includes('partial')) return <Tag color="gold">{formatText(status)}</Tag>
  if (normalized.includes('pending')) return <Tag color="orange">{formatText(status)}</Tag>
  return <Tag color="default">{formatText(status, 'Unspecified')}</Tag>
}

const getLatestBooking = (bookings?: GuestApiBooking[]) => {
  if (!Array.isArray(bookings) || !bookings.length) return null

  return bookings.reduce<GuestApiBooking>((latest, booking) => {
    const latestDate = latest.check_out_date || latest.check_in_date || ''
    const bookingDate = booking.check_out_date || booking.check_in_date || ''

    return bookingDate > latestDate ? booking : latest
  }, bookings[0])
}

const mapGuest = (item: GuestApiRecord): Guest => {
  const fullName = [item.first_name, item.second_name].filter(Boolean).join(' ').trim() || 'Unknown Guest'
  const latestBooking = getLatestBooking(item.previous_bookings)

  return {
    id: item._id,
    displayId: `GST-${item._id.slice(-6).toUpperCase()}`,
    fullName,
    email: item.email || '',
    phone: item.phone_number || '',
    dateOfBirth: item.date_of_birth || '',
    paymentStatus: item.payment_status || '',
    status: normalizeStatus(item.status),
    notes: item.notes?.[0]?.note || '',
    previousBookingsCount: Array.isArray(item.previous_bookings) ? item.previous_bookings.length : 0,
    lastCheckInDate: latestBooking?.check_in_date || FALLBACK_VALUE,
    lastCheckOutDate: latestBooking?.check_out_date || FALLBACK_VALUE,
    createdAt: item.createdAt ? item.createdAt.split('T')[0] : FALLBACK_VALUE
  }
}

const buildGuestPayload = (guest: GuestFormData) => {
  const nameParts = guest.fullName.trim().split(/\s+/).filter(Boolean)
  const [first_name = guest.fullName.trim(), ...otherNames] = nameParts
  const second_name = otherNames.join(' ') || 'N/A'
  const notes = guest.notes?.trim()
  const paymentStatus = guest.paymentStatus.trim()

  return {
    first_name,
    second_name,
    email: guest.email.trim(),
    phone_number: guest.phone.trim(),
    date_of_birth: guest.dateOfBirth,
    payment_status: paymentStatus || undefined,
    status: guest.status,
    notes: notes
      ? [
          {
            note: notes,
            createdAt: new Date().toISOString()
          }
        ]
      : undefined
  }
}

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [guestModalType, setGuestModalType] = useState<GuestModalType>('add')
  const [guestFormData, setGuestFormData] = useState<Guest | null>(null)

  const fetchGuests = async (isMounted = true) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<GuestListResponse>(API_ENDPOINTS.guests.all)
      if (!isMounted) return

      const guestList = Array.isArray(response?.data) ? response.data : []
      setGuests(guestList.map(mapGuest))
    } catch (err) {
      if (!isMounted) return
      setError(err instanceof Error ? err.message : 'Failed to load guests')
    } finally {
      if (isMounted) setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    fetchGuests(isMounted)

    return () => {
      isMounted = false
    }
  }, [])

  const handleOpenGuestDetails = (guest: Guest) => {
    setSelectedGuest(guest)
    setIsModalOpen(true)
  }

  const handleOpenAddGuest = () => {
    setGuestModalType('add')
    setGuestFormData(null)
    setIsGuestModalOpen(true)
  }

  const handleOpenEditGuest = (guest: Guest) => {
    setGuestModalType('edit')
    setGuestFormData(guest)
    setIsGuestModalOpen(true)
  }

  const handleCloseGuestDetails = () => {
    setIsModalOpen(false)
    setSelectedGuest(null)
  }

  const handleSaveGuest = async (guest: GuestFormData) => {
    const payload = buildGuestPayload(guest)

    if (guestModalType === 'add') {
      await apiClient.post(API_ENDPOINTS.guests.add, payload)
      message.success('Guest added successfully')
    } else {
      if (!guestFormData?.id) {
        throw new Error('Missing guest identifier for update')
      }

      await apiClient.put(API_ENDPOINTS.guests.byId(guestFormData.id), payload)
      message.success('Guest updated successfully')
    }

    await fetchGuests(true)
  }

  const columns: TableProps<Guest>['columns'] = [
    {
      title: 'Guest',
      key: 'guest',
      render: (_, record) => (
        <Space>
          <Avatar>{record.fullName.charAt(0)}</Avatar>
          <div>
            <p className="font-semibold text-gray-900">{record.fullName}</p>
            <p className="text-xs text-gray-500">{record.email || FALLBACK_VALUE}</p>
          </div>
        </Space>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (value: string) => value || FALLBACK_VALUE
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (value: string) => value || FALLBACK_VALUE
    },
    {
      title: 'Previous Bookings',
      dataIndex: 'previousBookingsCount',
      key: 'previousBookingsCount'
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (value: string) => getPaymentStatusTag(value)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: GuestStatus) => getStatusTag(value)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleOpenGuestDetails(record)}>
            View Details
          </Button>
          <Button type="link" onClick={() => handleOpenEditGuest(record)}>
            Edit
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Management</h2>
          <p className="text-gray-600 mt-1">View guest profiles and sync records with the live API</p>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading guests...</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
        <Button type="primary" onClick={handleOpenAddGuest}>
          Add Guest
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table<Guest>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={guests}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title="Guest Details"
        open={isModalOpen}
        onCancel={handleCloseGuestDetails}
        footer={[
          <Button key="close" onClick={handleCloseGuestDetails}>
            Close
          </Button>
        ]}
      >
        {selectedGuest && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Guest ID">{selectedGuest.displayId}</Descriptions.Item>
            <Descriptions.Item label="Full Name">{selectedGuest.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedGuest.email || FALLBACK_VALUE}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedGuest.phone || FALLBACK_VALUE}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{selectedGuest.dateOfBirth || FALLBACK_VALUE}</Descriptions.Item>
            <Descriptions.Item label="Previous Bookings">{selectedGuest.previousBookingsCount}</Descriptions.Item>
            <Descriptions.Item label="Last Check In">{selectedGuest.lastCheckInDate}</Descriptions.Item>
            <Descriptions.Item label="Last Check Out">{selectedGuest.lastCheckOutDate}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">{getPaymentStatusTag(selectedGuest.paymentStatus)}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(selectedGuest.status)}</Descriptions.Item>
            <Descriptions.Item label="Created On">{selectedGuest.createdAt}</Descriptions.Item>
            <Descriptions.Item label="Notes">{selectedGuest.notes || FALLBACK_VALUE}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <GuestModal
        isOpen={isGuestModalOpen}
        type={guestModalType}
        guest={guestFormData}
        onClose={() => {
          setIsGuestModalOpen(false)
          setGuestFormData(null)
        }}
        onSave={handleSaveGuest}
      />
    </div>
  )
}
