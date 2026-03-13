'use client'

import React from 'react'
import { MdCleaningServices, MdCheckCircle, MdPending, MdSchedule } from 'react-icons/md'
import { FaUser, FaExclamationTriangle } from 'react-icons/fa'
import StatsCard from '../UI/StatsCard'
import TaskList from '../housekeeping/TaskList'
import StaffList from '../housekeeping/StaffList'
import { HousekeepingTask } from '../housekeeping/TaskCard'
import { HousekeepingStaff } from '../housekeeping/StaffCard'

// Sample data - in real app this would come from API/props
const housekeepingTasks: HousekeepingTask[] = [
  {
    id: 'HK001',
    roomNumber: '101',
    roomType: 'Studio',
    taskType: 'checkout_cleaning',
    status: 'pending',
    assignedTo: 'Mary Wanjiku',
    priority: 'high',
    scheduledTime: '09:00',
    estimatedDuration: 45,
    guestCheckOut: '08:30',
    guestCheckIn: '14:00',
    notes: 'Guest reported spilled wine in living area'
  },
  {
    id: 'HK002',
    roomNumber: '205',
    roomType: 'One Bedroom',
    taskType: 'deep_cleaning',
    status: 'in_progress',
    assignedTo: 'Grace Muthoni',
    priority: 'medium',
    scheduledTime: '08:30',
    estimatedDuration: 90,
    notes: 'Weekly deep clean scheduled'
  },
  {
    id: 'HK003',
    roomNumber: '302',
    roomType: 'Two Bedroom',
    taskType: 'maintenance_cleaning',
    status: 'completed',
    assignedTo: 'Susan Njeri',
    priority: 'low',
    scheduledTime: '07:00',
    estimatedDuration: 60,
    completedAt: '08:15',
    notes: 'Post-maintenance cleanup after plumbing work'
  },
  {
    id: 'HK004',
    roomNumber: '408',
    roomType: 'Studio',
    taskType: 'inspection',
    status: 'overdue',
    assignedTo: 'Mary Wanjiku',
    priority: 'urgent',
    scheduledTime: '13:00',
    estimatedDuration: 30,
    notes: 'Quality control inspection'
  },
  {
    id: 'HK005',
    roomNumber: '156',
    roomType: 'One Bedroom',
    taskType: 'checkout_cleaning',
    status: 'pending',
    assignedTo: 'Grace Muthoni',
    priority: 'high',
    scheduledTime: '10:30',
    estimatedDuration: 45,
    guestCheckOut: '10:00',
    guestCheckIn: '15:00'
  }
]

const housekeepingStaff: HousekeepingStaff[] = [
  {
    id: 'STAFF001',
    name: 'Mary Wanjiku',
    status: 'busy',
    currentTasks: 2,
    completedToday: 3,
    efficiency: 95,
    shift: 'Morning (7 AM - 3 PM)',
    department: 'Housekeeping'
  },
  {
    id: 'STAFF002',
    name: 'Grace Muthoni',
    status: 'available',
    currentTasks: 1,
    completedToday: 4,
    efficiency: 88,
    shift: 'Morning (7 AM - 3 PM)',
    department: 'Housekeeping'
  },
  {
    id: 'STAFF003',
    name: 'Susan Njeri',
    status: 'break',
    currentTasks: 0,
    completedToday: 2,
    efficiency: 92,
    shift: 'Afternoon (3 PM - 11 PM)',
    department: 'Housekeeping'
  },
  {
    id: 'STAFF004',
    name: 'Jane Wambui',
    status: 'available',
    currentTasks: 0,
    completedToday: 1,
    efficiency: 85,
    shift: 'Night (11 PM - 7 AM)',
    department: 'Housekeeping'
  }
]

export default function HousekeepingManagement() {
  const stats = {
    totalTasks: housekeepingTasks.length,
    pendingTasks: housekeepingTasks.filter(t => t.status === 'pending').length,
    inProgressTasks: housekeepingTasks.filter(t => t.status === 'in_progress').length,
    completedTasks: housekeepingTasks.filter(t => t.status === 'completed').length,
    overdueTasks: housekeepingTasks.filter(t => t.status === 'overdue').length,
    availableStaff: housekeepingStaff.filter(s => s.status === 'available').length,
    totalStaff: housekeepingStaff.length
  }

  const handleAddTask = () => {
    console.log('Add new task')
  }

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId)
  }

  const handleStatusUpdate = (taskId: string, status: HousekeepingTask['status']) => {
    console.log('Update task status:', taskId, status)
  }

  const handleAssignTask = (staffId: string) => {
    console.log('Assign task to staff:', staffId)
  }

  const handleUpdateStaffStatus = (staffId: string, status: HousekeepingStaff['status']) => {
    console.log('Update staff status:', staffId, status)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Housekeeping Management</h2>
          <p className="text-gray-600 mt-1">Manage cleaning schedules and staff assignments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<MdSchedule />}
          color="default"
        />
        
        <StatsCard
          title="Pending"
          value={stats.pendingTasks}
          icon={<MdPending />}
          color="yellow"
        />
        
        <StatsCard
          title="In Progress"
          value={stats.inProgressTasks}
          icon={<MdCleaningServices />}
          color="blue"
        />
        
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={<MdCheckCircle />}
          color="green"
        />
        
        <StatsCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={<FaExclamationTriangle />}
          color="red"
        />
        
        <StatsCard
          title="Available Staff"
          value={`${stats.availableStaff}/${stats.totalStaff}`}
          icon={<FaUser />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tasks Section - Takes up 2/3 of the width */}
        <div className="xl:col-span-2">
          <TaskList
            tasks={housekeepingTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>

        {/* Staff Section - Takes up 1/3 of the width */}
        <div className="xl:col-span-1">
          <StaffList
            staff={housekeepingStaff}
            onAssignTask={handleAssignTask}
            onUpdateStatus={handleUpdateStaffStatus}
          />
        </div>
      </div>
    </div>
  )
}
