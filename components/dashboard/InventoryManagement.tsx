'use client'

import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { MdInventory } from 'react-icons/md'

// Sample data - in real app this would come from API/props
const inventoryItems = [
  { item: 'Bed Sheets (Queen)', stock: 24, minStock: 10, status: 'good', category: 'Bedding', lastUpdated: '2025-11-08' },
  { item: 'Towels (Bath)', stock: 48, minStock: 20, status: 'good', category: 'Bathroom', lastUpdated: '2025-11-07' },
  { item: 'Pillows', stock: 8, minStock: 15, status: 'low', category: 'Bedding', lastUpdated: '2025-11-09' },
  { item: 'Light Bulbs (LED)', stock: 3, minStock: 12, status: 'critical', category: 'Maintenance', lastUpdated: '2025-11-10' },
  { item: 'Toilet Paper', stock: 36, minStock: 25, status: 'good', category: 'Bathroom', lastUpdated: '2025-11-06' },
  { item: 'Cleaning Supplies', stock: 15, minStock: 10, status: 'good', category: 'Housekeeping', lastUpdated: '2025-11-08' },
  { item: 'Coffee Packets', stock: 45, minStock: 30, status: 'good', category: 'Kitchen', lastUpdated: '2025-11-09' },
  { item: 'Hand Soap', stock: 6, minStock: 12, status: 'low', category: 'Bathroom', lastUpdated: '2025-11-10' },
]

const getStockStatus = (item: any) => {
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
  const criticalItems = inventoryItems.filter(item => getStockStatus(item) === 'critical').length
  const lowItems = inventoryItems.filter(item => getStockStatus(item) === 'low').length
  const goodItems = inventoryItems.filter(item => getStockStatus(item) === 'good').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600 mt-1">Track and manage all inventory items</p>
        </div>
        <button className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors">
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
              .map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
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
                      <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
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
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item, index) => {
                const status = getStockStatus(item)
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#1D4E56] hover:text-[#2a6670] mr-3">Update</button>
                      <button className="text-blue-600 hover:text-blue-900">Reorder</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
