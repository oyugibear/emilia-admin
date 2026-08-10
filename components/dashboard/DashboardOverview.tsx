'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaBed, FaCalendarCheck, FaUsers, FaMoneyBillWave } from 'react-icons/fa'
import { roomApi } from '@/lib/core/room-api'
import { maintenanceApi } from '@/lib/core/maintenance-api'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'
import type { MaintenanceRequest, Room } from '@/types'

interface OverviewBooking {
  _id: string
  room?: string | { _id?: string; room_number?: string }
  guest?: { first_name?: string; second_name?: string }
  check_in_date?: string
  check_out_date?: string
  status?: string
  payment_status?: string
  amount_due?: number
  currency?: string
  confirmation_code?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'occupied':
      return 'bg-blue-500'
    case 'available':
      return 'bg-green-500'
    case 'maintenance':
      return 'bg-red-500'
    case 'checkout':
      return 'bg-yellow-500'
    case 'housekeeping':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-700 bg-red-50 border-red-200'
    case 'medium':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-green-700 bg-green-50 border-green-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

const getMaintenanceStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'in-progress':
      return 'text-blue-700 bg-blue-50 border-blue-200'
    default:
      return 'text-amber-700 bg-amber-50 border-amber-200'
  }
}

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function DashboardOverview() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [bookings, setBookings] = useState<OverviewBooking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchOverviewData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [roomsData, maintenanceData, bookingResponse] = await Promise.all([
          roomApi.getRooms(),
          maintenanceApi.getMaintenances(),
          apiClient.get<{ data: OverviewBooking[] }>(API_ENDPOINTS.bookings.all)
        ])

        if (!isMounted) return
        setRooms(roomsData)
        setMaintenanceRequests(maintenanceData)
        setBookings(Array.isArray(bookingResponse.data) ? bookingResponse.data : [])
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load dashboard overview')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchOverviewData()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const activeStatuses = ['reserved', 'confirmed', 'checked_in', 'pending_payment', 'pending']
    const activeBookings = bookings.filter((booking) => activeStatuses.includes((booking.status || '').toLowerCase()) && (booking.check_in_date || '') <= today && (booking.check_out_date || '') > today)
    const occupiedRoomIds = new Set(activeBookings.map((booking) => typeof booking.room === 'string' ? booking.room : booking.room?._id).filter(Boolean))
    const totalRooms = rooms.length
    const occupiedRooms = occupiedRoomIds.size
    const maintenanceRooms = rooms.filter((room) => room.status === 'maintenance').length
    const availableRooms = Math.max(0, totalRooms - occupiedRooms - maintenanceRooms)

    return {
      totalRooms,
      occupiedRooms,
      maintenanceRooms,
      availableRooms,
      arrivalsToday: bookings.filter((booking) => booking.check_in_date === today && (booking.status || '').toLowerCase() !== 'cancelled').length,
      departuresToday: bookings.filter((booking) => booking.check_out_date === today && (booking.status || '').toLowerCase() !== 'cancelled').length,
      unpaidBookings: bookings.filter((booking) => !['paid', 'refunded'].includes((booking.payment_status || '').toLowerCase()) && (booking.status || '').toLowerCase() !== 'cancelled').length
    }
  }, [bookings, rooms])

  const recentMaintenance = useMemo(() => maintenanceRequests.slice(0, 5), [maintenanceRequests])
  const recentRooms = useMemo(() => rooms.slice(0, 8), [rooms])

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-[#173f46] to-[#2b6973] px-5 py-5 text-white shadow-lg shadow-[#1D4E56]/10 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Good day, Emilia team</h2>
        <p className="mt-1 max-w-2xl text-sm text-teal-50/80">Your operational view of arrivals, occupied rooms, payments, housekeeping, and maintenance.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="/bookings" className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#1D4E56]">Review bookings</Link><Link href="/housekeeping" className="rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">Open housekeeping</Link></div>
        {isLoading && <p className="mt-1 text-xs text-gray-500">Loading dashboard data...</p>}
      </div>

      {error && <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3"><div><p className="text-sm font-semibold text-red-800">Dashboard data could not be loaded</p><p className="text-xs text-red-700">{error}</p></div><button className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700" onClick={() => window.location.reload()}>Try again</button></div>}
      {!isLoading && stats.unpaidBookings > 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>{stats.unpaidBookings} booking{stats.unpaidBookings === 1 ? '' : 's'} need payment attention.</strong> Review balances before arrivals. <Link className="font-semibold underline" href="/bookings">Open bookings</Link></div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Rooms</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalRooms}</p>
            </div>
            <div className="rounded-lg bg-[#1D4E56]/10 p-2 text-[#1D4E56]">
              <FaBed className="text-base" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Occupied today</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">{stats.occupiedRooms}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FaUsers className="text-base" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Arriving today</p>
              <p className="mt-1 text-2xl font-semibold text-red-600">{stats.arrivalsToday}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <FaCalendarCheck className="text-base" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Unpaid bookings</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">{stats.unpaidBookings}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <FaMoneyBillWave className="text-base" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Room Status</h3>
            <span className="text-xs text-gray-500">{recentRooms.length} shown</span>
          </div>

          <div className="space-y-2">
            {recentRooms.length === 0 && !isLoading ? (
              <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-sm text-gray-500">
                No room data available.
              </p>
            ) : (
              recentRooms.map((room) => (
                <div key={room.apiId || room.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{room.id}</p>
                    <p className="truncate text-xs text-gray-500">
                      {room.type}
                      {room.guest ? ` • ${room.guest}` : ''}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(room.status)}`} />
                    {toTitleCase(room.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Recent Maintenance</h3>
            <span className="text-xs text-gray-500">{recentMaintenance.length} shown</span>
          </div>

          <div className="space-y-2">
            {recentMaintenance.length === 0 && !isLoading ? (
              <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-sm text-gray-500">
                No maintenance requests available.
              </p>
            ) : (
              recentMaintenance.map((request) => (
                <div key={request.apiId} className="rounded-lg border border-gray-100 px-3 py-2">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900">Room {request.room}</p>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPriorityColor(request.priority)}`}>
                      {toTitleCase(request.priority)}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-xs text-gray-600">{request.issue}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getMaintenanceStatusColor(request.status)}`}>
                      {toTitleCase(request.status)}
                    </span>
                    <span className="text-[11px] text-gray-500">{request.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Quick Summary</h3>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-4">
          <p>Open Maintenance: <span className="font-semibold text-gray-900">{maintenanceRequests.filter((item) => item.status !== 'completed').length}</span></p>
          <p>Departing Today: <span className="font-semibold text-gray-900">{stats.departuresToday}</span></p>
          <p>Housekeeping Rooms: <span className="font-semibold text-gray-900">{rooms.filter((room) => room.status === 'housekeeping').length}</span></p>
          <p>Occupancy Rate: <span className="font-semibold text-gray-900">{stats.totalRooms ? `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%` : '0%'}</span></p>
        </div>
      </div>
    </div>
  )
}
