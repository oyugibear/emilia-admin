'use client'

import React from 'react'
import StaffCard, { HousekeepingStaff } from './StaffCard'

interface StaffListProps {
  staff: HousekeepingStaff[]
  onAssignTask?: (staffId: string) => void
  onUpdateStatus?: (staffId: string, status: HousekeepingStaff['status']) => void
}

export default function StaffList({ staff, onAssignTask, onUpdateStatus }: StaffListProps) {
  const availableStaff = staff.filter(member => member.status === 'available')
  const busyStaff = staff.filter(member => member.status === 'busy')
  const onBreakStaff = staff.filter(member => member.status === 'break')
  const offDutyStaff = staff.filter(member => member.status === 'off_duty')

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Housekeeping Staff</h2>
        <div className="text-sm text-gray-600 mt-1">
          {availableStaff.length} available • {busyStaff.length} busy • {onBreakStaff.length} on break
        </div>
      </div>
      
      <div className="p-6">
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff assigned</h3>
            <p className="text-gray-600">Add housekeeping staff to manage tasks and schedules.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Available Staff First */}
            {availableStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onAssignTask={onAssignTask}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            
            {/* Busy Staff */}
            {busyStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onAssignTask={onAssignTask}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            
            {/* On Break Staff */}
            {onBreakStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onAssignTask={onAssignTask}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            
            {/* Off Duty Staff */}
            {offDutyStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onAssignTask={onAssignTask}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
