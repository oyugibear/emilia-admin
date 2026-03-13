'use client'

import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import RoomModal from '@/components/constants/modals/RoomModal'
import type { Room, RoomModalType } from '@/types'
import RoomCard from '@/components/dashboard/RoomCard'
import StatusCard from './StatusCard'
import { roomApi } from '@/lib/core/room-api'

// Sample data - in real app this would come from API/props
const roomData: Room[] = [
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'occupied': return 'bg-blue-500'
    case 'available': return 'bg-green-500'
    case 'maintenance': return 'bg-red-500'
    case 'checkout': return 'bg-yellow-500'
    case 'housekeeping': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>(roomData)
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [roomModalType, setRoomModalType] = useState<RoomModalType>('add')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchRooms = async () => {
      setIsLoadingRooms(true)
      setRoomsError(null)

      try {
        const apiRooms = await roomApi.getRooms()

        if (!isMounted) return
        setRooms(apiRooms)
      } catch (error) {
        if (!isMounted) return
        setRoomsError(error instanceof Error ? error.message : 'Failed to load rooms')
      } finally {
        if (isMounted) {
          setIsLoadingRooms(false)
        }
      }
    }

    fetchRooms()

    return () => {
      isMounted = false
    }
  }, [])

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length
  const availableRooms = rooms.filter(room => room.status === 'available').length
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length
  const housekeepingRooms = rooms.filter(room => room.status === 'housekeeping').length

  const openAddRoomModal = () => {
    setRoomModalType('add')
    setSelectedRoom(null)
    setIsRoomModalOpen(true)
  }

  const openEditRoomModal = (room: Room) => {
    setRoomModalType('edit')
    setSelectedRoom(room)
    setIsRoomModalOpen(true)
  }

  const handleSaveRoom = async (room: Room) => {
    if (roomModalType === 'add') {
      const createdRoom = await roomApi.createRoom(room)
      setRooms(prev => [...prev, createdRoom])
      return
    }

    const updatedRoom = await roomApi.updateRoom(room)
    setRooms(prev => prev.map(item => (item.apiId === updatedRoom.apiId ? updatedRoom : item)))
  }

  const detailedRoomColumns: TableProps<Room>['columns'] = [
    {
      title: 'Room',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => <span className="text-sm font-medium text-gray-900">{value}</span>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(value)}`}></span>
          <span className="text-sm text-gray-900 capitalize">{value}</span>
        </div>
      )
    },
    {
      title: 'Guest',
      dataIndex: 'guest',
      key: 'guest',
      render: (value: string | null) => <span className="text-sm text-gray-500">{value || '-'}</span>
    },
    {
      title: 'Checkout',
      dataIndex: 'checkout',
      key: 'checkout',
      render: (value: string | null) => <span className="text-sm text-gray-500">{value || '-'}</span>
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor',
      render: (value: number) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => <span className="text-sm text-gray-500">${value}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, room) => (
        <div className="whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => openEditRoomModal(room)}
            className="text-[#1D4E56] hover:text-[#2a6670] mr-3"
          >
            Edit
          </button>
          <button className="text-blue-600 hover:text-blue-900">View</button>
        </div>
      )
    }
  ]

  const roomTypes = ['All', 'Studio', '1-Bedroom', '2-Bedroom']
  const statusTypes = ['All', 'Available', 'Occupied', 'Maintenance', 'Checkout', 'Housekeeping']

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Room Management</h2>
          <p className="mt-0.5 text-sm text-gray-500">Monitor and manage room availability</p>
          {isLoadingRooms && <p className="mt-1 text-xs text-gray-500">Loading rooms...</p>}
          {roomsError && <p className="mt-1 text-xs text-red-600">{roomsError}</p>}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={openAddRoomModal}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#1D4E56] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a6670] sm:flex-none"
          >
            Add New
          </button>
          <button className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-none">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">

        <StatusCard title="Total Rooms" number={totalRooms} />
        <StatusCard title="Available" number={availableRooms} />
        <StatusCard title="Occupied" number={occupiedRooms} />
        <StatusCard title="Maintenance" number={maintenanceRooms} />
        <StatusCard title="Housekeeping" number={housekeepingRooms} />
        
 
      </div>

      {/* Room Status Grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-gray-900">Room Status Overview</h3>
          <div className="flex gap-2">
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#1D4E56]/30">
              {roomTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#1D4E56]/30">
              {statusTypes.map(status => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onEdit={openEditRoomModal} />
          ))}
        </div>
      </div>

      {/* Detailed Table View */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Detailed Room Information</h3>
        <Table<Room>
          rowKey="id"
          size="small"
          columns={detailedRoomColumns}
          dataSource={rooms}
          pagination={{ pageSize: 8, size: 'small', showSizeChanger: false }}
          scroll={{ x: 900 }}
        />
      </div>

      <RoomModal
        isOpen={isRoomModalOpen}
        type={roomModalType}
        room={selectedRoom}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
      />
    </div>
  )
}
