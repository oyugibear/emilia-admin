'use client'

import React from 'react'
import { MdEdit, MdDelete, MdSchedule } from 'react-icons/md'
import { FaBed, FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa'

export interface HousekeepingTask {
  id: string
  roomNumber: string
  roomType: string
  taskType: 'checkout_cleaning' | 'maintenance_cleaning' | 'deep_cleaning' | 'inspection'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  assignedTo: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledTime: string
  estimatedDuration: number
  guestCheckOut?: string
  guestCheckIn?: string
  notes?: string
  completedAt?: string
}

interface TaskCardProps {
  task: HousekeepingTask
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  onStatusUpdate?: (taskId: string, status: HousekeepingTask['status']) => void
}

export default function TaskCard({ task, onEdit, onDelete, onStatusUpdate }: TaskCardProps) {
  const getStatusColor = (status: HousekeepingTask['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: HousekeepingTask['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskTypeIcon = (taskType: HousekeepingTask['taskType']) => {
    switch (taskType) {
      case 'checkout_cleaning': return <FaBed className="w-4 h-4" />
      case 'maintenance_cleaning': return <MdSchedule className="w-4 h-4" />
      case 'deep_cleaning': return <MdSchedule className="w-4 h-4" />
      case 'inspection': return <MdSchedule className="w-4 h-4" />
      default: return <MdSchedule className="w-4 h-4" />
    }
  }

  const formatTaskType = (taskType: HousekeepingTask['taskType']) => {
    return taskType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getTaskTypeIcon(task.taskType)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Room {task.roomNumber}</h3>
            <p className="text-sm text-gray-600">{task.roomType} • {formatTaskType(task.taskType)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <FaUser className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Assigned to:</span>
          <span className="font-medium">{task.assignedTo}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Scheduled:</span>
          <span className="font-medium">{task.scheduledTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdSchedule className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium">{task.estimatedDuration} min</span>
        </div>
      </div>

      {(task.guestCheckOut || task.guestCheckIn) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          {task.guestCheckOut && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{task.guestCheckOut}</span>
            </div>
          )}
          {task.guestCheckIn && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{task.guestCheckIn}</span>
            </div>
          )}
        </div>
      )}

      {task.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{task.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          ID: {task.id}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(task.id)}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit Task"
            >
              <MdEdit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete Task"
            >
              <MdDelete className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
