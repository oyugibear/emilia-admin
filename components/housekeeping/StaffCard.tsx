'use client'

import React from 'react'

export interface HousekeepingStaff {
  id: string
  name: string
  status: 'available' | 'busy' | 'break' | 'off_duty'
  currentTasks: number
  completedToday: number
  efficiency: number
  shift: string
  department: string
}

interface StaffCardProps {
  staff: HousekeepingStaff
  onAssignTask?: (staffId: string) => void
  onUpdateStatus?: (staffId: string, status: HousekeepingStaff['status']) => void
}

export default function StaffCard({ staff, onAssignTask, onUpdateStatus }: StaffCardProps) {
  const getStatusColor = (status: HousekeepingStaff['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-blue-100 text-blue-800'
      case 'break': return 'bg-yellow-100 text-yellow-800'
      case 'off_duty': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-500'
    if (efficiency >= 75) return 'bg-yellow-500'
    if (efficiency >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{staff.name}</h3>
          <p className="text-sm text-gray-600">{staff.department}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
          {staff.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current Tasks:</span>
            <p className="font-medium">{staff.currentTasks}</p>
          </div>
          <div>
            <span className="text-gray-600">Completed Today:</span>
            <p className="font-medium">{staff.completedToday}</p>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-gray-600">Shift:</span>
          <p className="font-medium">{staff.shift}</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Efficiency:</span>
            <span className="font-medium">{staff.efficiency}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getEfficiencyColor(staff.efficiency)}`}
              style={{ width: `${staff.efficiency}%` }}
            />
          </div>
        </div>

        {staff.status === 'available' && onAssignTask && (
          <button
            onClick={() => onAssignTask(staff.id)}
            className="w-full mt-3 bg-[#1D4E56] text-white py-2 px-3 rounded-lg text-sm hover:bg-[#2a6670] transition-colors"
          >
            Assign Task
          </button>
        )}
      </div>
    </div>
  )
}
