'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Descriptions, Modal, Space, Table, Tag, message } from 'antd'
import type { TableProps } from 'antd'
import BookingModal, { type BookingFormData, type BookingModalType } from '@/components/constants/modals/BookingModal'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'

type BookingStatus = 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled'

interface Booking {
  id: string
  guestId?: string
  guestName: string
  guestEmail: string
  guestPhone: string
  room: string
  apartmentType: string
  checkInDate: string
  checkOutDate: string
  nights: number
  adultCount: number
  childCount: number
  totalAmount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  status: BookingStatus
  specialRequest?: string
}

interface BookingApiPerson {
  _id?: string
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
}

interface BookingApiRoom {
  _id?: string
  room_number?: string
  type?: string
}

interface BookingApiNote {
  note?: string
}

interface BookingApiRecord {
  _id: string
  guest?: BookingApiPerson | string | null
  client?: BookingApiPerson | string | null
  room?: BookingApiRoom | string | null
  check_in_date?: string
  check_out_date?: string
  payment_status?: string
  Amount?: string | number
  status?: string
  notes?: BookingApiNote[]
}

interface BookingListResponse {
  data: BookingApiRecord[]
  message: string
  status: string
}

const FALLBACK_VALUE = '—'

const calcNights = (checkIn: string, checkOut: string) =>
  checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1

const normalizeBookingStatus = (value?: string): BookingStatus => {
  const status = (value || '').toLowerCase().replace(/[\s-]+/g, '_')
  if (status === 'confirmed') return 'confirmed'
  if (status === 'checked_in') return 'checked_in'
  if (status === 'checked_out') return 'checked_out'
  if (status === 'cancelled') return 'cancelled'
  return 'pending'
}

const normalizePaymentStatus = (value?: string): Booking['paymentStatus'] => {
  const status = (value || '').toLowerCase()
  if (status.includes('paid') && !status.includes('un')) return 'paid'
  if (status.includes('partial')) return 'partial'
  return 'unpaid'
}

const asPerson = (value?: BookingApiPerson | string | null): BookingApiPerson | null => {
  if (!value || typeof value === 'string') return null
  return value
}

const asRoom = (value?: BookingApiRoom | string | null): BookingApiRoom | null => {
  if (!value || typeof value === 'string') return null
  return value
}

const mapBooking = (item: BookingApiRecord): Booking => {
  const guest = asPerson(item.guest) || asPerson(item.client)
  const room = asRoom(item.room)
  const checkInDate = item.check_in_date || ''
  const checkOutDate = item.check_out_date || ''

  return {
    id: item._id,
    guestId: asPerson(item.guest)?._id,
    guestName: [guest?.first_name, guest?.second_name].filter(Boolean).join(' ').trim() || 'Unknown Guest',
    guestEmail: guest?.email || FALLBACK_VALUE,
    guestPhone: guest?.phone_number || FALLBACK_VALUE,
    room: room?.room_number || FALLBACK_VALUE,
    apartmentType: room?.type || FALLBACK_VALUE,
    checkInDate: checkInDate || FALLBACK_VALUE,
    checkOutDate: checkOutDate || FALLBACK_VALUE,
    nights: checkInDate && checkOutDate ? calcNights(checkInDate, checkOutDate) : 0,
    adultCount: 1,
    childCount: 0,
    totalAmount: Number(item.Amount || 0),
    paymentStatus: normalizePaymentStatus(item.payment_status),
    status: normalizeBookingStatus(item.status),
    specialRequest: item.notes?.[0]?.note || ''
  }
}

const getBookingStatusTag = (status: BookingStatus) => {
  if (status === 'checked_in') return <Tag color="green">Checked In</Tag>
  if (status === 'checked_out') return <Tag color="default">Checked Out</Tag>
  if (status === 'confirmed') return <Tag color="blue">Confirmed</Tag>
  if (status === 'pending') return <Tag color="gold">Pending</Tag>
  return <Tag color="red">Cancelled</Tag>
}

const getPaymentStatusTag = (status: Booking['paymentStatus']) => {
  if (status === 'paid') return <Tag color="green">Paid</Tag>
  if (status === 'partial') return <Tag color="orange">Partial</Tag>
  return <Tag color="red">Unpaid</Tag>
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // View-details modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Add / Edit modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [bookingModalType, setBookingModalType] = useState<BookingModalType>('add')
  const [editingBooking, setEditingBooking] = useState<BookingFormData | null>(null)

  const tableData: Booking[] = Array.isArray(bookings) ? bookings : []

  const fetchBookings = async (isMounted = true) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<BookingListResponse>(API_ENDPOINTS.bookings.all)
      if (!isMounted) return

      const records = Array.isArray(response?.data) ? response.data : []
      setBookings(records.map(mapBooking))
    } catch (err) {
      if (!isMounted) return
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      if (isMounted) setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    fetchBookings(isMounted)

    return () => {
      isMounted = false
    }
  }, [])

  const handleOpenDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  const handleOpenAdd = () => {
    setEditingBooking(null)
    setBookingModalType('add')
    setBookingModalOpen(true)
  }

  const handleOpenEdit = (booking: Booking) => {
    setEditingBooking({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      guestId: booking.guestId,
      room: booking.room,
      apartmentType: booking.apartmentType,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      specialRequest: booking.specialRequest
    })
    setBookingModalType('edit')
    setBookingModalOpen(true)
  }

  const buildApiPayload = (data: BookingFormData) => ({
    ...(data.guestId ? { guestId: data.guestId } : {}),
    ...(data.newGuest ? { newGuest: data.newGuest } : {}),
    check_in_date: data.checkInDate,
    check_out_date: data.checkOutDate,
    payment_status: data.paymentStatus,
    Amount: String(data.totalAmount),
    status: data.status,
    notes: data.specialRequest ? [{ note: data.specialRequest, createdAt: new Date().toISOString() }] : undefined
  })

  const handleSaveBooking = async (data: BookingFormData) => {
    if (bookingModalType === 'add') {
      await apiClient.post(API_ENDPOINTS.bookings.add, buildApiPayload(data))
      message.success('Booking created successfully')
    } else {
      if (data.id) {
        await apiClient.put(API_ENDPOINTS.bookings.byId(data.id), buildApiPayload(data))
      }
      message.success('Booking updated successfully')
    }

    await fetchBookings(true)
  }

  const columns: TableProps<Booking>['columns'] = useMemo(
    () => [
      {
        title: 'Guest',
        key: 'guest',
        render: (_, record) => (
          <Space>
            <Avatar>{record.guestName.charAt(0)}</Avatar>
            <div>
              <p className="font-semibold text-gray-900">{record.guestName}</p>
              <p className="text-xs text-gray-500">{record.guestEmail}</p>
            </div>
          </Space>
        )
      },
      {
        title: 'Booking ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Room',
        dataIndex: 'room',
        key: 'room'
      },
      {
        title: 'Check In',
        dataIndex: 'checkInDate',
        key: 'checkInDate'
      },
      {
        title: 'Check Out',
        dataIndex: 'checkOutDate',
        key: 'checkOutDate'
      },
      {
        title: 'Payment',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        render: (value: Booking['paymentStatus']) => getPaymentStatusTag(value)
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value: BookingStatus) => getBookingStatusTag(value)
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => handleOpenDetails(record)}>
              View
            </Button>
            <Button type="link" onClick={() => handleOpenEdit(record)}>
              Edit
            </Button>
          </Space>
        )
      }
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600 mt-1">Track reservations, payments, and stay status</p>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading bookings...</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
        <Button
          type="primary"
          onClick={handleOpenAdd}
          style={{ backgroundColor: '#1D4E56', borderColor: '#1D4E56' }}
        >
          + Add Booking
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table<Booking>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1100 }}
        />
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        type={bookingModalType}
        booking={editingBooking}
        onClose={() => setBookingModalOpen(false)}
        onSave={handleSaveBooking}
      />

      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={handleCloseDetails}
        footer={[
          <Button key="close" onClick={handleCloseDetails}>
            Close
          </Button>
        ]}
      >
        {selectedBooking && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Booking ID">{selectedBooking.id}</Descriptions.Item>
            <Descriptions.Item label="Guest Name">{selectedBooking.guestName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBooking.guestEmail || FALLBACK_VALUE}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedBooking.guestPhone || FALLBACK_VALUE}</Descriptions.Item>
            <Descriptions.Item label="Room">{selectedBooking.room}</Descriptions.Item>
            <Descriptions.Item label="Apartment Type">{selectedBooking.apartmentType}</Descriptions.Item>
            <Descriptions.Item label="Check In">{selectedBooking.checkInDate}</Descriptions.Item>
            <Descriptions.Item label="Check Out">{selectedBooking.checkOutDate}</Descriptions.Item>
            <Descriptions.Item label="Nights">{selectedBooking.nights}</Descriptions.Item>
            <Descriptions.Item label="Guests">
              {selectedBooking.adultCount} adult(s), {selectedBooking.childCount} child(ren)
            </Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedBooking.totalAmount}</Descriptions.Item>
            <Descriptions.Item label="Payment">{getPaymentStatusTag(selectedBooking.paymentStatus)}</Descriptions.Item>
            <Descriptions.Item label="Status">{getBookingStatusTag(selectedBooking.status)}</Descriptions.Item>
            <Descriptions.Item label="Special Request">{selectedBooking.specialRequest || '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
