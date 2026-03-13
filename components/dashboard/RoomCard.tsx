'use client'

import React, { useState } from 'react'
import { Descriptions, Modal, Tag } from 'antd'
import { FaBed, FaUsers, FaCheckCircle, FaTools, FaClock } from 'react-icons/fa'
import { MdCleaningServices } from 'react-icons/md'
import type { Room, RoomCardProps } from '@/types'

const getStatusColor = (status: Room['status']) => {
  switch (status) {
    case 'available':
      return 'text-green-600'
    case 'occupied':
      return 'text-blue-600'
    case 'maintenance':
      return 'text-red-600'
    case 'housekeeping':
      return 'text-purple-600'
    default:
      return 'text-yellow-600'
  }
}

const getStatusDotColor = (status: Room['status']) => {
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

const getStatusIcon = (status: Room['status']) => {
  switch (status) {
    case 'occupied':
      return <FaUsers className="text-blue-600" />
    case 'available':
      return <FaCheckCircle className="text-green-600" />
    case 'maintenance':
      return <FaTools className="text-red-600" />
    case 'checkout':
      return <FaClock className="text-yellow-600" />
    case 'housekeeping':
      return <MdCleaningServices className="text-purple-600" />
    default:
      return <FaBed className="text-gray-600" />
  }
}

export default function RoomCard({ room, onEdit }: RoomCardProps) {
  const statusLabel = room.status.replace(/_/g, ' ')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-2 flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-900">{room.id}</h4>
              <span className={`h-2 w-2 rounded-full ${getStatusDotColor(room.status)}`} />
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{room.type}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            {getStatusIcon(room.status)}
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium capitalize ${getStatusColor(room.status)}`}>{statusLabel}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">Floor</span>
            <span className="font-medium text-gray-800">{room.floor}</span>
          </div>

          <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5">
            <span className="text-gray-500">Rate</span>
            <span className="text-sm font-semibold text-gray-900">${room.price}<span className="text-xs font-normal text-gray-500">/night</span></span>
          </div>

          {room.guest && (
            <div className="col-span-2 flex items-center justify-between gap-2">
              <span className="text-gray-500">Guest</span>
              <span className="truncate font-medium text-gray-800">{room.guest}</span>
            </div>
          )}

          {room.checkout && (
            <div className="col-span-2 flex items-center justify-between gap-2">
              <span className="text-gray-500">Checkout</span>
              <span className="font-medium text-gray-800">{room.checkout}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-2.5">
          <div className="flex gap-2">
            <button
              onClick={() => setIsViewModalOpen(true)}
              className="flex-1 rounded-md bg-[#1D4E56] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a6670]"
            >
              Details
            </button>
            <button
              onClick={() => onEdit(room)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={isViewModalOpen}
        title={`Room ${room.id} Details`}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        centered
      >
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Room ID">{room.id}</Descriptions.Item>
          <Descriptions.Item label="Type">{room.type}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag className="capitalize" color={room.status === 'available' ? 'green' : room.status === 'occupied' ? 'blue' : room.status === 'maintenance' ? 'red' : room.status === 'housekeeping' ? 'purple' : 'gold'}>
              {statusLabel}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Floor">{room.floor}</Descriptions.Item>
          <Descriptions.Item label="Rate">${room.price}/night</Descriptions.Item>
          <Descriptions.Item label="Guest">{room.guest || '—'}</Descriptions.Item>
          <Descriptions.Item label="Checkout">{room.checkout || '—'}</Descriptions.Item>
          <Descriptions.Item label="Maintenance">{room.maintenance || 'none'}</Descriptions.Item>
          <Descriptions.Item label="Cleanliness">{room.cleanliness || '—'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  )
}
