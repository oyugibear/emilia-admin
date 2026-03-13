'use client'

import React from 'react'
import { FaBed, FaTools, FaUsers, FaCheckCircle } from 'react-icons/fa'

// Sample data - in real app this would come from API/props
const roomData = [
  { id: 'S001', type: 'Studio', status: 'occupied', guest: 'John Smith', checkout: '2025-11-15', maintenance: 'none', cleanliness: 'clean' },
  { id: 'S002', type: 'Studio', status: 'maintenance', guest: null, checkout: null, maintenance: 'plumbing', cleanliness: 'pending' },
  { id: '1B01', type: '1-Bedroom', status: 'available', guest: null, checkout: null, maintenance: 'none', cleanliness: 'clean' },
  { id: '1B02', type: '1-Bedroom', status: 'occupied', guest: 'Sarah Wilson', checkout: '2025-11-12', maintenance: 'none', cleanliness: 'clean' },
  { id: '2B01', type: '2-Bedroom', status: 'checkout', guest: 'Mike Johnson', checkout: '2025-11-10', maintenance: 'inspection', cleanliness: 'pending' },
  { id: '2B02', type: '2-Bedroom', status: 'occupied', guest: 'Emily Davis', checkout: '2025-11-18', maintenance: 'none', cleanliness: 'clean' },
]

const maintenanceRequests = [
  { id: 'MR001', room: 'S002', issue: 'Bathroom sink leak', priority: 'high', status: 'in-progress', assignedTo: 'James Tech', date: '2025-11-08' },
  { id: 'MR002', room: '2B01', issue: 'AC not cooling properly', priority: 'medium', status: 'pending', assignedTo: null, date: '2025-11-09' },
  { id: 'MR003', room: '1B03', issue: 'Light bulb replacement', priority: 'low', status: 'completed', assignedTo: 'Mike Fix', date: '2025-11-07' },
  { id: 'MR004', room: 'S005', issue: 'Door lock malfunction', priority: 'high', status: 'pending', assignedTo: null, date: '2025-11-10' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'occupied': return 'bg-blue-500'
    case 'available': return 'bg-green-500'
    case 'maintenance': return 'bg-red-500'
    case 'checkout': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'low': return 'text-green-600 bg-green-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <FaBed className="text-[#1D4E56] text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-3xl font-bold text-blue-600">16</p>
            </div>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <FaTools className="text-red-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600">5</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Room Status Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomData.map((room) => (
            <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{room.id}</h4>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`}></span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{room.type}</p>
              <p className="text-sm font-medium capitalize text-gray-800">{room.status}</p>
              {room.guest && (
                <p className="text-xs text-gray-500 mt-1">Guest: {room.guest}</p>
              )}
              {room.checkout && (
                <p className="text-xs text-gray-500">Checkout: {room.checkout}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Maintenance Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance Requests</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceRequests.slice(0, 4).map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
