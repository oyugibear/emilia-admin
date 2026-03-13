'use client'

import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { FaExclamationTriangle } from 'react-icons/fa'
import { MdInventory } from 'react-icons/md'
import InventoryModal from '@/components/constants/modals/InventoryModal'
import type { InventoryItem, InventoryModalType } from '@/types'
import { inventoryApi } from '@/lib/core/inventory-api'

const getStockStatus = (item: InventoryItem) => {
  if (item.stock <= item.minStock * 0.5) return 'critical'
  if (item.stock <= item.minStock) return 'low'
  return 'good'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return 'text-red-600 bg-red-100'
    case 'low': return 'text-yellow-600 bg-yellow-100'
    case 'good': return 'text-green-600 bg-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<InventoryModalType>('add')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchInventory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await inventoryApi.getInventories()
        if (!isMounted) return
        setInventoryItems(data)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load inventory items')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchInventory()

    return () => {
      isMounted = false
    }
  }, [])

  const criticalItems = inventoryItems.filter(item => getStockStatus(item) === 'critical').length
  const lowItems = inventoryItems.filter(item => getStockStatus(item) === 'low').length
  const goodItems = inventoryItems.filter(item => getStockStatus(item) === 'good').length

  const openAddModal = () => {
    setModalType('add')
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: InventoryItem) => {
    setModalType('edit')
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSaveItem = async (item: InventoryItem) => {
    if (modalType === 'add') {
      const created = await inventoryApi.createInventory(item)
      setInventoryItems((prev) => [created, ...prev])
      return
    }

    const updated = await inventoryApi.updateInventory(item)
    setInventoryItems((prev) => prev.map((row) => (row.apiId === updated.apiId ? updated : row)))
  }

  const inventoryColumns: TableProps<InventoryItem>['columns'] = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (value: string) => <span className="text-sm font-medium text-gray-900">{value}</span>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Current Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (value: number) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Min Stock',
      dataIndex: 'minStock',
      key: 'minStock',
      render: (value: number) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, item) => {
        const status = getStockStatus(item)
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        )
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (value: string) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <div className="whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => openEditModal(item)}
            className="text-[#1D4E56] hover:text-[#2a6670] mr-3"
          >
            Update
          </button>
          <button className="text-blue-600 hover:text-blue-900">Reorder</button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600 mt-1">Track and manage all inventory items (the stores)</p>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading inventory items...</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors"
        >
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
            <MdInventory className="text-[#1D4E56] text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Good Stock</p>
              <p className="text-3xl font-bold text-green-600">{goodItems}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-600">{lowItems}</p>
            </div>
            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Items</p>
              <p className="text-3xl font-bold text-red-600">{criticalItems}</p>
            </div>
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Critical & Low Stock Alerts */}
      {(criticalItems > 0 || lowItems > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
          <div className="space-y-3">
            {inventoryItems
              .filter(item => getStockStatus(item) !== 'good')
              .map((item) => (
                <div key={item.id} className={`p-3 rounded-lg border-l-4 ${
                  getStockStatus(item) === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.item}</p>
                      <p className="text-sm text-gray-600">Current stock: {item.stock} (Min: {item.minStock})</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-[#1D4E56] text-white px-3 py-1 rounded text-sm hover:bg-[#2a6670] transition-colors">
                        Reorder
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Inventory Items</h3>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              <option value="">All Categories</option>
              <option value="bedding">Bedding</option>
              <option value="bathroom">Bathroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              <option value="">All Status</option>
              <option value="good">Good</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        <Table<InventoryItem>
          rowKey={(item) => item.apiId || item.id}
          columns={inventoryColumns}
          dataSource={inventoryItems}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </div>

      <InventoryModal
        isOpen={isModalOpen}
        type={modalType}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  )
}
