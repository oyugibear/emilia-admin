'use client'

import React from 'react'
import { FaBed, FaUsers, FaCheckCircle, FaTools, FaClock } from 'react-icons/fa'
import { MdCleaningServices } from 'react-icons/md'

// Sample data - in real app this would come from API/props
const roomData = [
  { id: 'S001', type: 'Studio', status: 'occupied', guest: 'John Smith', checkout: '2025-11-15', maintenance: 'none', cleanliness: 'clean', floor: 1, price: 85 },
  { id: 'S002', type: 'Studio', status: 'maintenance', guest: null, checkout: null, maintenance: 'plumbing', cleanliness: 'pending', floor: 1, price: 85 },
  { id: 'S003', type: 'Studio', status: 'available', guest: null, checkout: null, maintenance: 'none', cleanliness: 'clean', floor: 1, price: 85 },
  { id: '1B01', type: '1-Bedroom', status: 'occupied', guest: 'Sarah Wilson', checkout: '2025-11-12', maintenance: 'none', cleanliness: 'clean', floor: 2, price: 120 },
  { id: '1B02', type: '1-Bedroom', status: 'available', guest: null, checkout: null, maintenance: 'none', cleanliness: 'clean', floor: 2, price: 120 },
  { id: '1B03', type: '1-Bedroom', status: 'checkout', guest: 'Mike Johnson', checkout: '2025-11-10', maintenance: 'inspection', cleanliness: 'pending', floor: 2, price: 120 },
  { id: '2B01', type: '2-Bedroom', status: 'occupied', guest: 'Emily Davis', checkout: '2025-11-18', maintenance: 'none', cleanliness: 'clean', floor: 3, price: 180 },
  { id: '2B02', type: '2-Bedroom', status: 'available', guest: null, checkout: null, maintenance: 'none', cleanliness: 'clean', floor: 3, price: 180 },
  { id: '2B03', type: '2-Bedroom', status: 'occupied', guest: 'David Brown', checkout: '2025-11-16', maintenance: 'none', cleanliness: 'clean', floor: 3, price: 180 },
  { id: 'S004', type: 'Studio', status: 'housekeeping', guest: null, checkout: null, maintenance: 'none', cleanliness: 'cleaning', floor: 1, price: 85 },
  { id: '1B04', type: '1-Bedroom', status: 'available', guest: null, checkout: null, maintenance: 'none', cleanliness: 'clean', floor: 2, price: 120 },
  { id: '2B04', type: '2-Bedroom', status: 'maintenance', guest: null, checkout: null, maintenance: 'electrical', cleanliness: 'pending', floor: 3, price: 180 },
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'occupied': return <FaUsers className="text-blue-600" />
    case 'available': return <FaCheckCircle className="text-green-600" />
    case 'maintenance': return <FaTools className="text-red-600" />
    case 'checkout': return <FaClock className="text-yellow-600" />
    case 'housekeeping': return <MdCleaningServices className="text-purple-600" />
    default: return <FaBed className="text-gray-600" />
  }
}

export default function RoomsManagement() {
  const totalRooms = roomData.length
  const occupiedRooms = roomData.filter(room => room.status === 'occupied').length
  const availableRooms = roomData.filter(room => room.status === 'available').length
  const maintenanceRooms = roomData.filter(room => room.status === 'maintenance').length
  const housekeepingRooms = roomData.filter(room => room.status === 'housekeeping').length

  const roomTypes = ['All', 'Studio', '1-Bedroom', '2-Bedroom']
  const statusTypes = ['All', 'Available', 'Occupied', 'Maintenance', 'Checkout', 'Housekeeping']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all rooms status</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#1D4E56] text-white px-4 py-2 rounded-md hover:bg-[#2a6670] transition-colors">
            Room Settings
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">{totalRooms}</p>
            </div>
            <FaBed className="text-[#1D4E56] text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600">{availableRooms}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-3xl font-bold text-blue-600">{occupiedRooms}</p>
            </div>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-red-600">{maintenanceRooms}</p>
            </div>
            <FaTools className="text-red-500 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Housekeeping</p>
              <p className="text-3xl font-bold text-purple-600">{housekeepingRooms}</p>
            </div>
            <MdCleaningServices className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Room Status Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Room Status Overview</h3>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              {roomTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]">
              {statusTypes.map(status => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomData.map((room) => (
            <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{room.id}</h4>
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`}></span>
                </div>
                {getStatusIcon(room.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{room.type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    room.status === 'available' ? 'text-green-600' :
                    room.status === 'occupied' ? 'text-blue-600' :
                    room.status === 'maintenance' ? 'text-red-600' :
                    room.status === 'housekeeping' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`}>
                    {room.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Floor:</span>
                  <span className="font-medium">{room.floor}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${room.price}/night</span>
                </div>
                
                {room.guest && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guest:</span>
                    <span className="font-medium text-xs">{room.guest}</span>
                  </div>
                )}
                
                {room.checkout && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Checkout:</span>
                    <span className="font-medium text-xs">{room.checkout}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  <button className="flex-1 text-xs bg-[#1D4E56] text-white px-2 py-1 rounded hover:bg-[#2a6670] transition-colors">
                    Details
                  </button>
                  <button className="flex-1 text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Room Information</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomData.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(room.status)}`}></span>
                      <span className="text-sm text-gray-900 capitalize">{room.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.guest || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.checkout || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.floor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${room.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#1D4E56] hover:text-[#2a6670] mr-3">Edit</button>
                    <button className="text-blue-600 hover:text-blue-900">View</button>
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
