'use client'

import React from 'react'

// Sample data - in real app this would come from API/props
const maintenanceRequests = [
  { id: 'MR001', room: 'S002', issue: 'Bathroom sink leak', priority: 'high', status: 'in-progress', assignedTo: 'James Tech', date: '2025-11-08' },
  { id: 'MR002', room: '2B01', issue: 'AC not cooling properly', priority: 'medium', status: 'pending', assignedTo: null, date: '2025-11-09' },
  { id: 'MR003', room: '1B03', issue: 'Light bulb replacement', priority: 'low', status: 'completed', assignedTo: 'Mike Fix', date: '2025-11-07' },
  { id: 'MR004', room: 'S005', issue: 'Door lock malfunction', priority: 'high', status: 'pending', assignedTo: null, date: '2025-11-10' },
  { id: 'MR005', room: '1B05', issue: 'WiFi connectivity issues', priority: 'medium', status: 'in-progress', assignedTo: 'Tech Support', date: '2025-11-09' },
  { id: 'MR006', room: '2B03', issue: 'Heating system not working', priority: 'high', status: 'pending', assignedTo: null, date: '2025-11-10' },
]

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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all maintenance requests</p>
        </div>
        <button className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors">
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
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#1D4E56] hover:text-[#2a6670] mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
