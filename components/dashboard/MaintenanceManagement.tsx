'use client'

import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { maintenanceApi } from '@/lib/core/maintenance-api'
import { roomApi } from '@/lib/core/room-api'
import type { MaintenanceModalType, MaintenanceRequest, Room } from '@/types'
import MaintenanceModal from '@/components/constants/modals/MaintenanceModal'

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'low': return 'text-green-600 bg-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-100'
    case 'in-progress': return 'text-blue-600 bg-blue-100'
    case 'pending': return 'text-yellow-600 bg-yellow-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export default function MaintenanceManagement() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<MaintenanceModalType>('add')
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRequest | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [maintenanceData, roomsData] = await Promise.all([
          maintenanceApi.getMaintenances(),
          roomApi.getRooms()
        ])

        if (!isMounted) return
        setMaintenanceRequests(maintenanceData)
        setRooms(roomsData)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load maintenance requests')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const openAddModal = () => {
    setModalType('add')
    setSelectedMaintenance(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: MaintenanceRequest) => {
    setModalType('edit')
    setSelectedMaintenance(item)
    setIsModalOpen(true)
  }

  const handleSaveMaintenance = async (item: MaintenanceRequest) => {
    const selectedRoom = rooms.find((room) => room.id === item.room)
    const payload: MaintenanceRequest = {
      ...item,
      roomId: selectedRoom?.apiId
    }

    if (modalType === 'add') {
      const created = await maintenanceApi.createMaintenance(payload)
      setMaintenanceRequests((prev) => [created, ...prev])
      return
    }

    const updated = await maintenanceApi.updateMaintenance(payload)
    setMaintenanceRequests((prev) => prev.map((row) => (row.apiId === updated.apiId ? updated : row)))
  }

  const maintenanceColumns: TableProps<MaintenanceRequest>['columns'] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (value: string) => <span className="text-sm font-medium text-gray-900">{value}</span>
    // },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
          {value.replace('-', ' ')}
        </span>
      )
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (value: string | null) => <span className="text-sm text-gray-500">{value || 'Unassigned'}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, request) => (
        <div className="whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => openEditModal(request)}
            className="text-[#1D4E56] hover:text-[#2a6670] mr-3"
          >
            Edit
          </button>
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all maintenance requests</p>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading maintenance requests...</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors"
        >
          New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{maintenanceRequests.length}</p>
            <p className="text-sm font-medium text-gray-600">Total Requests</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{maintenanceRequests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm font-medium text-gray-600">Pending</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{maintenanceRequests.filter(r => r.status === 'in-progress').length}</p>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{maintenanceRequests.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm font-medium text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Maintenance Requests Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Maintenance Requests</h3>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <Table<MaintenanceRequest>
          rowKey="apiId"
          columns={maintenanceColumns}
          dataSource={maintenanceRequests}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </div>

      <MaintenanceModal
        isOpen={isModalOpen}
        type={modalType}
        maintenance={selectedMaintenance}
        roomNumbers={rooms.map((room) => room.id)}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMaintenance}
      />
    </div>
  )
}
