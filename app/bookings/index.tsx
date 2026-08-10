'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Button, Descriptions, Input, Modal, Space, Table, Tag, message } from 'antd'
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
  guestCountry: string
  room: string
  roomId?: string
  apartmentType: string
  apartmentSlug: string
  checkInDate: string
  checkOutDate: string
  nights: number
  adultCount: number
  childCount: number
  totalAmount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  paymentMethod: string
  source: string
  currency: string
  amountPaid: number
  amountDue: number
  confirmationCode: string
  status: BookingStatus
  specialRequest?: string
  paymentReference: string
  createdAt: string
  holdExpiresAt: string
  confirmedAt: string
  paidAt: string
  pricing?: PricingSnapshot
}

interface PricingSnapshot {
  nightlyRate?: number
  nights?: number
  subtotal?: number
  discount?: number
  serviceFee?: number
  tax?: number
  total?: number
  currency?: string
  baseCurrency?: string
  baseAmount?: number
  paymentCurrency?: string
  exchangeRate?: number
  paymentAmount?: number
}

interface BookingApiPerson {
  _id?: string
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
  country?: string
}

interface BookingApiRoom {
  _id?: string
  room_number?: string
  type?: string
  floor?: number
  price?: number
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
  confirmation_code?: string
  payment_method?: string
  source?: string
  currency?: string
  amount_total?: number
  amount_paid?: number
  amount_due?: number
  adults?: number
  children?: number
  guest_count?: number
  special_requests?: string
  apartment_type?: string
  apartment_slug?: string
  payment_reference?: string
  hold_expires_at?: string
  confirmed_at?: string
  paid_at?: string
  createdAt?: string
  pricing_snapshot?: PricingSnapshot
}

interface BookingListResponse {
  data: BookingApiRecord[]
  message: string
  status: string
}
interface RoomChoice { _id: string; room_number?: string; type?: string }
interface AvailabilityBlockRecord { _id: string; room?: BookingApiRoom; check_in_date: string; check_out_date: string; reason: string; notes?: string }

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
  if (status.includes('partial')) return 'partial'
  if (status.includes('paid') && !status.includes('un')) return 'paid'
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
    guestCountry: guest?.country || FALLBACK_VALUE,
    room: room?.room_number || FALLBACK_VALUE,
    roomId: room?._id,
    apartmentType: room?.type || item.apartment_type || FALLBACK_VALUE,
    apartmentSlug: item.apartment_slug || FALLBACK_VALUE,
    checkInDate: checkInDate || FALLBACK_VALUE,
    checkOutDate: checkOutDate || FALLBACK_VALUE,
    nights: checkInDate && checkOutDate ? calcNights(checkInDate, checkOutDate) : 0,
    adultCount: item.adults || 1,
    childCount: item.children || 0,
    totalAmount: Number(item.amount_total ?? item.Amount ?? 0),
    amountPaid: Number(item.amount_paid || 0),
    amountDue: Number(item.amount_due ?? item.amount_total ?? item.Amount ?? 0),
    currency: item.currency || 'USD',
    paymentMethod: item.payment_method || 'PAY_ON_ARRIVAL',
    source: item.source || 'OTHER',
    confirmationCode: item.confirmation_code || item._id,
    paymentStatus: normalizePaymentStatus(item.payment_status),
    status: normalizeBookingStatus(item.status),
    specialRequest: item.special_requests || item.notes?.[0]?.note || '',
    paymentReference: item.payment_reference || FALLBACK_VALUE,
    createdAt: item.createdAt || '',
    holdExpiresAt: item.hold_expires_at || '',
    confirmedAt: item.confirmed_at || '',
    paidAt: item.paid_at || '',
    pricing: item.pricing_snapshot
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
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('MPESA')
  const [paymentReference, setPaymentReference] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [paymentSaving, setPaymentSaving] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'arriving' | 'pay_on_arrival' | 'unpaid'>('all')
  const [search, setSearch] = useState('')
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockSaving, setBlockSaving] = useState(false)
  const [blockError, setBlockError] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<AvailabilityBlockRecord[]>([])
  const [roomChoices, setRoomChoices] = useState<RoomChoice[]>([])
  const [blockForm, setBlockForm] = useState({ room: '', check_in_date: '', check_out_date: '', reason: 'MAINTENANCE', notes: '' })

  const today = new Date().toISOString().slice(0, 10)
  const tableData: Booking[] = (Array.isArray(bookings) ? bookings : []).filter((booking) => {
    const matchesFilter = filter === 'all' || (filter === 'arriving' && booking.checkInDate === today) || (filter === 'pay_on_arrival' && booking.paymentMethod === 'PAY_ON_ARRIVAL') || (filter === 'unpaid' && booking.paymentStatus !== 'paid')
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [booking.guestName, booking.guestEmail, booking.guestPhone, booking.confirmationCode, booking.room, booking.apartmentType].some((value) => value.toLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })

  const bookingStats = useMemo(() => ({
    active: bookings.filter((booking) => !['cancelled', 'checked_out'].includes(booking.status)).length,
    arriving: bookings.filter((booking) => booking.checkInDate === today && booking.status !== 'cancelled').length,
    unpaid: bookings.filter((booking) => booking.paymentStatus !== 'paid' && booking.status !== 'cancelled').length,
    unassigned: bookings.filter((booking) => booking.room === FALLBACK_VALUE && booking.status !== 'cancelled').length
  }), [bookings, today])

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

  const loadAvailability = async () => {
    const [roomResponse, blockResponse] = await Promise.all([apiClient.get<{data: RoomChoice[]}>(API_ENDPOINTS.rooms.all), apiClient.get<{data: AvailabilityBlockRecord[]}>(API_ENDPOINTS.bookings.blocks)])
    setRoomChoices(Array.isArray(roomResponse.data) ? roomResponse.data : [])
    setBlocks(Array.isArray(blockResponse.data) ? blockResponse.data : [])
  }

  useEffect(() => {
    let isMounted = true

    fetchBookings(isMounted)

    return () => {
      isMounted = false
    }
  }, [])
  useEffect(() => { loadAvailability().catch(() => undefined) }, [])

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
      guestCountry: booking.guestCountry === FALLBACK_VALUE ? '' : booking.guestCountry,
      guestId: booking.guestId,
      room: booking.room,
      roomId: booking.roomId,
      apartmentType: booking.apartmentType,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod === 'PAY_NOW' ? 'PAY_NOW' : 'PAY_ON_ARRIVAL',
      source: ['ADMIN','WHATSAPP','PHONE'].includes(booking.source) ? booking.source as BookingFormData['source'] : 'OTHER',
      currency: booking.currency === 'KES' ? 'KES' : 'USD',
      status: booking.status,
      specialRequest: booking.specialRequest
    })
    setBookingModalType('edit')
    setBookingModalOpen(true)
  }

  const buildApiPayload = (data: BookingFormData) => ({
    ...(data.guestId ? { guestId: data.guestId } : {}),
    ...(data.newGuest ? { newGuest: data.newGuest } : {}),
    room: data.roomId,
    apartmentType: data.apartmentType,
    checkIn: data.checkInDate,
    checkOut: data.checkOutDate,
    adults: data.adultCount,
    children: data.childCount,
    paymentMethod: data.paymentMethod,
    source: data.source,
    currency: data.currency,
    specialRequests: data.specialRequest
  })

  const handleSaveBooking = async (data: BookingFormData) => {
    if (bookingModalType === 'add') {
      await apiClient.post(API_ENDPOINTS.bookings.add, buildApiPayload(data))
      message.success('Booking created successfully')
    } else {
      if (data.id) {
        if (data.status === 'cancelled') {
          await apiClient.delete(API_ENDPOINTS.bookings.byId(data.id))
        } else {
          await apiClient.put(API_ENDPOINTS.bookings.byId(data.id), {
            ...buildApiPayload(data),
            status: data.status,
            paymentStatus: data.paymentStatus
          })
        }
      }
      message.success('Booking updated successfully')
    }

    await fetchBookings(true)
  }

  const handleRecordPayment = async () => {
    if (!paymentBooking) return
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0 || paymentAmount > paymentBooking.amountDue) {
      setPaymentError(`Enter an amount between 0.01 and ${paymentBooking.currency} ${paymentBooking.amountDue.toLocaleString()}.`)
      return
    }
    if (paymentMethod !== 'CASH' && !paymentReference.trim()) {
      setPaymentError('Add the transaction reference for non-cash payments.')
      return
    }
    setPaymentSaving(true)
    setPaymentError(null)
    try {
      await apiClient.post(API_ENDPOINTS.payments.record(paymentBooking.id), { amount: paymentAmount, paymentMethod, transactionReference: paymentReference.trim(), notes: paymentNotes.trim() })
      message.success('Payment recorded')
      setPaymentBooking(null)
      setPaymentReference('')
      setPaymentNotes('')
      await fetchBookings(true)
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not record payment')
    } finally {
      setPaymentSaving(false)
    }
  }

  const handleCreateBlock = async () => {
    if (!blockForm.room) {
      setBlockError('Select the room that should be unavailable.')
      return
    }
    if (!blockForm.check_in_date || !blockForm.check_out_date || blockForm.check_out_date <= blockForm.check_in_date) {
      setBlockError('Choose an end date after the start date.')
      return
    }
    setBlockSaving(true)
    setBlockError(null)
    try {
      await apiClient.post(API_ENDPOINTS.bookings.blocks, blockForm)
      message.success('Dates blocked')
      setBlockOpen(false)
      setBlockForm({ room: '', check_in_date: '', check_out_date: '', reason: 'MAINTENANCE', notes: '' })
      await loadAvailability()
    } catch (error) {
      setBlockError(error instanceof Error ? error.message : 'Could not block dates')
    } finally {
      setBlockSaving(false)
    }
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
        dataIndex: 'confirmationCode',
        key: 'confirmationCode'
      },
      {
        title: 'Room',
        key: 'room',
        render: (_, record) => <div><p className="font-medium text-gray-900">{record.room}</p><p className="text-xs text-gray-500">{record.apartmentType}</p></div>
      },
      {
        title: 'Stay',
        key: 'stay',
        render: (_, record) => <div><p className="text-sm text-gray-900">{record.checkInDate} → {record.checkOutDate}</p><p className="text-xs text-gray-500">{record.nights} night{record.nights === 1 ? '' : 's'} · {record.adultCount + record.childCount} guest{record.adultCount + record.childCount === 1 ? '' : 's'}</p></div>
      },
      {
        title: 'Payment',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        render: (value: Booking['paymentStatus'], record) => <Space direction="vertical" size={2}>{getPaymentStatusTag(value)}{record.paymentMethod === 'PAY_ON_ARRIVAL' && <Tag color="gold">PAY ON ARRIVAL</Tag>}<span className="text-xs text-gray-500">Due: {record.currency} {record.amountDue.toLocaleString()}</span></Space>
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
            {record.amountDue > 0 && <Button type="link" onClick={() => { setPaymentBooking(record); setPaymentAmount(record.amountDue) }}>Record Payment</Button>}
          </Space>
        )
      }
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1D4E56]">Reservations workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="mt-1 text-gray-600">See every guest detail, verify room availability, and follow payment and arrival tasks.</p>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading bookings...</p>}
        </div>
        <Space wrap>
          <Button onClick={() => setBlockOpen(true)}>Block dates</Button>
          <Button type="primary" onClick={handleOpenAdd} style={{ backgroundColor: '#1D4E56', borderColor: '#1D4E56' }}>+ Add booking</Button>
        </Space>
      </div>

      {error && <Alert type="error" showIcon message="Bookings could not be loaded" description={error} action={<Button size="small" onClick={() => fetchBookings(true)}>Try again</Button>} />}
      {bookingStats.unassigned > 0 && <Alert type="warning" showIcon message={`${bookingStats.unassigned} active booking${bookingStats.unassigned === 1 ? '' : 's'} ${bookingStats.unassigned === 1 ? 'has' : 'have'} no room assigned`} description="Open the booking details before arrival and confirm that the API room inventory is configured correctly." />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['Active stays', bookingStats.active, 'Current and upcoming reservations'],
          ['Arriving today', bookingStats.arriving, 'Guests requiring arrival preparation'],
          ['Payment due', bookingStats.unpaid, 'Unpaid and partially paid bookings'],
          ['Room exceptions', bookingStats.unassigned, 'Active bookings without a room']
        ].map(([label, value, hint]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></div>)}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{([['all','All'],['arriving','Arriving today'],['pay_on_arrival','Pay on arrival'],['unpaid','Unpaid / partial']] as const).map(([value,label]) => <Button key={value} type={filter === value ? 'primary' : 'default'} onClick={() => setFilter(value)}>{label}</Button>)}</div><Input.Search allowClear value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, code, room, or email" className="max-w-md" /></div>
        <Table<Booking>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} booking${total === 1 ? '' : 's'}` }}
          scroll={{ x: 1100 }}
        />
      </div>
      {blocks.length > 0 && <div className="rounded-lg bg-white p-6 shadow-md"><h3 className="mb-4 text-lg font-semibold">Manual availability blocks</h3><Table<AvailabilityBlockRecord> rowKey="_id" pagination={false} dataSource={blocks} columns={[{title:'Room',render:(_,record) => record.room?.room_number || '—'},{title:'From',dataIndex:'check_in_date'},{title:'To',dataIndex:'check_out_date'},{title:'Reason',dataIndex:'reason'},{title:'Notes',dataIndex:'notes'}]} /></div>}

      <BookingModal
        isOpen={bookingModalOpen}
        type={bookingModalType}
        booking={editingBooking}
        onClose={() => setBookingModalOpen(false)}
        onSave={handleSaveBooking}
      />

      <Modal
        title={selectedBooking ? `Booking ${selectedBooking.confirmationCode}` : 'Booking details'}
        open={isModalOpen}
        width={820}
        onCancel={handleCloseDetails}
        footer={[
          <Button key="close" onClick={handleCloseDetails}>
            Close
          </Button>,
          selectedBooking && <Button key="edit" onClick={() => { handleCloseDetails(); handleOpenEdit(selectedBooking) }}>Edit booking</Button>,
          selectedBooking && selectedBooking.amountDue > 0 && <Button key="payment" type="primary" onClick={() => { handleCloseDetails(); setPaymentBooking(selectedBooking); setPaymentAmount(selectedBooking.amountDue) }}>Record payment</Button>
        ]}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">{getBookingStatusTag(selectedBooking.status)}{getPaymentStatusTag(selectedBooking.paymentStatus)}<Tag>{selectedBooking.source.replaceAll('_', ' ')}</Tag></div>
                <p className="mt-2 text-lg font-semibold text-slate-900">{selectedBooking.guestName}</p>
                <p className="text-sm text-slate-500">{selectedBooking.apartmentType} · Room {selectedBooking.room}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Outstanding balance</p>
                <p className={`text-2xl font-bold ${selectedBooking.amountDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{selectedBooking.currency} {selectedBooking.amountDue.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Total', `${selectedBooking.currency} ${selectedBooking.totalAmount.toLocaleString()}`],
                ['Paid', `${selectedBooking.currency} ${selectedBooking.amountPaid.toLocaleString()}`],
                ['Nights', String(selectedBooking.nights)],
                ['Guests', String(selectedBooking.adultCount + selectedBooking.childCount)]
              ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>)}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="overflow-hidden rounded-xl border border-slate-200">
                <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">Guest information</h3>
                <Descriptions column={1} size="small" bordered colon={false}>
                  <Descriptions.Item label="Name">{selectedBooking.guestName}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedBooking.guestEmail || FALLBACK_VALUE}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedBooking.guestPhone || FALLBACK_VALUE}</Descriptions.Item>
                  <Descriptions.Item label="Country">{selectedBooking.guestCountry}</Descriptions.Item>
                </Descriptions>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200">
                <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">Stay information</h3>
                <Descriptions column={1} size="small" bordered colon={false}>
                  <Descriptions.Item label="Apartment">{selectedBooking.apartmentType}</Descriptions.Item>
                  <Descriptions.Item label="Room">{selectedBooking.room}</Descriptions.Item>
                  <Descriptions.Item label="Check-in">{selectedBooking.checkInDate}</Descriptions.Item>
                  <Descriptions.Item label="Check-out">{selectedBooking.checkOutDate}</Descriptions.Item>
                  <Descriptions.Item label="Occupancy">{selectedBooking.adultCount} adult{selectedBooking.adultCount === 1 ? '' : 's'}, {selectedBooking.childCount} {selectedBooking.childCount === 1 ? 'child' : 'children'}</Descriptions.Item>
                </Descriptions>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200">
                <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">Payment breakdown</h3>
                <Descriptions column={1} size="small" bordered colon={false}>
                  {selectedBooking.pricing && <Descriptions.Item label="Nightly rate">{selectedBooking.currency} {Number(selectedBooking.pricing.nightlyRate || 0).toLocaleString()} × {selectedBooking.pricing.nights || selectedBooking.nights}</Descriptions.Item>}
                  {selectedBooking.pricing && <Descriptions.Item label="Subtotal">{selectedBooking.currency} {Number(selectedBooking.pricing.subtotal || 0).toLocaleString()}</Descriptions.Item>}
                  {selectedBooking.pricing && Number(selectedBooking.pricing.discount || 0) > 0 && <Descriptions.Item label="Discount">− {selectedBooking.currency} {Number(selectedBooking.pricing.discount || 0).toLocaleString()}</Descriptions.Item>}
                  {selectedBooking.pricing && <Descriptions.Item label="Tax & fees">{selectedBooking.currency} {(Number(selectedBooking.pricing.tax || 0) + Number(selectedBooking.pricing.serviceFee || 0)).toLocaleString()}</Descriptions.Item>}
                  <Descriptions.Item label="Method">{selectedBooking.paymentMethod.replaceAll('_', ' ')}</Descriptions.Item>
                  <Descriptions.Item label="Reference">{selectedBooking.paymentReference}</Descriptions.Item>
                </Descriptions>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200">
                <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">Booking timeline</h3>
                <Descriptions column={1} size="small" bordered colon={false}>
                  <Descriptions.Item label="Confirmation">{selectedBooking.confirmationCode}</Descriptions.Item>
                  <Descriptions.Item label="Created">{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : FALLBACK_VALUE}</Descriptions.Item>
                  <Descriptions.Item label="Confirmed">{selectedBooking.confirmedAt ? new Date(selectedBooking.confirmedAt).toLocaleString() : FALLBACK_VALUE}</Descriptions.Item>
                  {selectedBooking.paidAt && <Descriptions.Item label="Paid">{new Date(selectedBooking.paidAt).toLocaleString()}</Descriptions.Item>}
                  {selectedBooking.holdExpiresAt && <Descriptions.Item label="Hold expires">{new Date(selectedBooking.holdExpiresAt).toLocaleString()}</Descriptions.Item>}
                </Descriptions>
              </section>
            </div>

            <section className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Special request</h3><span className="text-xs text-slate-400">Apartment reference: {selectedBooking.apartmentSlug}</span></div>
              <p className={`mt-2 text-sm ${selectedBooking.specialRequest ? 'text-slate-700' : 'italic text-slate-400'}`}>{selectedBooking.specialRequest || 'No special requests were provided.'}</p>
            </section>
          </div>
        )}
      </Modal>
      <Modal title={`Record payment · ${paymentBooking?.confirmationCode || ''}`} open={Boolean(paymentBooking)} onCancel={() => { setPaymentBooking(null); setPaymentError(null) }} confirmLoading={paymentSaving} onOk={handleRecordPayment} okText="Record payment">
        <div className="space-y-4">{paymentError && <Alert type="error" showIcon message={paymentError} />}<p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Outstanding balance: <strong>{paymentBooking?.currency} {paymentBooking?.amountDue.toLocaleString()}</strong></p><label className="block text-sm font-medium">Payment method<select className="mt-1 w-full rounded-md border p-2 font-normal" value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setPaymentError(null) }}><option value="MPESA">M-Pesa</option><option value="CASH">Cash</option><option value="CARD">Card</option><option value="BANK_TRANSFER">Bank transfer</option><option value="OTHER">Other</option></select></label><label className="block text-sm font-medium">Amount received *<input className="mt-1 w-full rounded-md border p-2 font-normal" type="number" min="0.01" max={paymentBooking?.amountDue} step="0.01" value={paymentAmount} onChange={(e) => { setPaymentAmount(Number(e.target.value)); setPaymentError(null) }} /></label><label className="block text-sm font-medium">Transaction / reference {paymentMethod === 'CASH' ? '(optional for cash)' : '*'}<input className="mt-1 w-full rounded-md border p-2 font-normal" value={paymentReference} onChange={(e) => { setPaymentReference(e.target.value); setPaymentError(null) }} placeholder="M-Pesa code, bank or card reference" /></label><label className="block text-sm font-medium">Internal notes<textarea className="mt-1 w-full rounded-md border p-2 font-normal" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Optional context for the team" /></label></div>
      </Modal>
      <Modal title="Block apartment dates" open={blockOpen} onCancel={() => { setBlockOpen(false); setBlockError(null) }} onOk={handleCreateBlock} confirmLoading={blockSaving} okText="Block dates">
        <div className="space-y-4">{blockError && <Alert type="error" showIcon message={blockError} />}<Alert type="info" showIcon message="Blocked nights will immediately be excluded from customer and admin availability searches." /><label className="block text-sm font-medium">Room *<select required className="mt-1 w-full rounded-md border p-2 font-normal" value={blockForm.room} onChange={(e) => { setBlockForm({...blockForm,room:e.target.value}); setBlockError(null) }}><option value="">Select room</option>{roomChoices.map((room) => <option key={room._id} value={room._id}>{room.room_number} · {room.type}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">From *<input className="mt-1 w-full rounded-md border p-2 font-normal" type="date" min={today} value={blockForm.check_in_date} onChange={(e) => { setBlockForm({...blockForm,check_in_date:e.target.value}); setBlockError(null) }} /></label><label className="text-sm font-medium">To *<input className="mt-1 w-full rounded-md border p-2 font-normal" type="date" min={blockForm.check_in_date || today} value={blockForm.check_out_date} onChange={(e) => { setBlockForm({...blockForm,check_out_date:e.target.value}); setBlockError(null) }} /></label></div><label className="block text-sm font-medium">Reason *<select className="mt-1 w-full rounded-md border p-2 font-normal" value={blockForm.reason} onChange={(e) => setBlockForm({...blockForm,reason:e.target.value})}><option value="MAINTENANCE">Maintenance</option><option value="OWNER_USE">Owner use</option><option value="DEEP_CLEANING">Deep cleaning</option><option value="RENOVATION">Renovation</option><option value="MANUAL_HOLD">Manual hold</option><option value="OTHER">Other</option></select></label><label className="block text-sm font-medium">Internal notes<input className="mt-1 w-full rounded-md border p-2 font-normal" value={blockForm.notes} onChange={(e) => setBlockForm({...blockForm,notes:e.target.value})} placeholder="Explain the reason for colleagues" /></label></div>
      </Modal>
    </div>
  )
}
