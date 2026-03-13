'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { MdCleaningServices, MdCheckCircle, MdPending, MdSchedule } from 'react-icons/md'
import { FaUser, FaExclamationTriangle } from 'react-icons/fa'
import StatsCard from '../UI/StatsCard'
import TaskList from '../housekeeping/TaskList'
import StaffList from '../housekeeping/StaffList'
import { HousekeepingTask } from '../housekeeping/TaskCard'
import { HousekeepingStaff } from '../housekeeping/StaffCard'
import HousekeepingTaskModal, { type HousekeepingTaskFormData } from '../constants/modals/HousekeepingTaskModal'
import HousekeepingAssignTaskModal from '../constants/modals/HousekeepingAssignTaskModal'
import { housekeepingApi } from '@/lib/core/housekeeping-api'
import { roomApi } from '@/lib/core/room-api'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'

interface StaffApiRecord {
  _id: string
  first_name?: string
  second_name?: string
  role?: string
  profile_status?: string
  shift_schedule?: Array<{ day?: string; shift?: string }>
}

interface StaffListResponse {
  data: StaffApiRecord[]
  message: string
  status: string
}

function mapShiftLabel(shiftSchedule?: StaffApiRecord['shift_schedule']): string {
  if (!Array.isArray(shiftSchedule) || shiftSchedule.length === 0) {
    return 'Schedule not set'
  }

  const [firstShift] = shiftSchedule
  if (!firstShift?.day || !firstShift?.shift) {
    return 'Schedule not set'
  }

  return `${firstShift.day} • ${firstShift.shift}`
}

function mapStaffStatus(profileStatus?: string): HousekeepingStaff['status'] {
  const value = (profileStatus || '').toLowerCase()
  if (value === 'fired') return 'off_duty'
  if (value === 'probation') return 'break'
  return 'available'
}

export default function HousekeepingManagement() {
  const [tasks, setTasks] = useState<HousekeepingTask[]>([])
  const [staffMembers, setStaffMembers] = useState<HousekeepingStaff[]>([])
  const [roomOptions, setRoomOptions] = useState<Array<{ id: string; number: string; type: HousekeepingTask['roomType'] }>>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadHousekeepingData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [housekeepingTasks, rooms, staffResponse] = await Promise.all([
          housekeepingApi.getHousekeepings(),
          roomApi.getRooms(),
          apiClient.get<StaffListResponse>(API_ENDPOINTS.staff.all)
        ])

        if (!isMounted) return

        const housekeepingStaff = (Array.isArray(staffResponse?.data) ? staffResponse.data : [])
          .filter((member) => member.role === 'Housekeeping')
          .map((member) => {
            const fullName = [member.first_name, member.second_name].filter(Boolean).join(' ').trim() || 'Unknown'

            return {
              id: member._id,
              name: fullName,
              status: mapStaffStatus(member.profile_status),
              currentTasks: 0,
              completedToday: 0,
              efficiency: 90,
              shift: mapShiftLabel(member.shift_schedule),
              department: 'Housekeeping'
            } satisfies HousekeepingStaff
          })

        setTasks(housekeepingTasks)
        setStaffMembers(housekeepingStaff)
        setRoomOptions(housekeepingApi.mapRoomsForModal(rooms))
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load housekeeping data')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadHousekeepingData()

    return () => {
      isMounted = false
    }
  }, [])

  const staffWithTaskCounts = useMemo(() => {
    return staffMembers.map((member) => ({
      ...member,
      currentTasks: tasks.filter(
        (task) => task.assignedTo === member.name && task.status !== 'completed'
      ).length
    }))
  }, [staffMembers, tasks])

  const selectedStaff = staffWithTaskCounts.find((member) => member.id === selectedStaffId) || null
  const staffNames = staffMembers.map((member) => member.name)

  const stats = {
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => t.status === 'overdue').length,
    availableStaff: staffWithTaskCounts.filter(s => s.status === 'available').length,
    totalStaff: staffWithTaskCounts.length
  }

  const handleAddTask = () => {
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId)
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((item) => item.apiId === taskId || item.id === taskId)
    if (!task?.apiId) return

    housekeepingApi.deleteHousekeeping(task.apiId)
      .then(() => {
        setTasks((prev) => prev.filter((item) => item.apiId !== task.apiId))
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to delete housekeeping task')
      })
  }

  const handleStatusUpdate = (taskId: string, status: HousekeepingTask['status']) => {
    const task = tasks.find((item) => item.apiId === taskId || item.id === taskId)
    if (!task?.apiId) return

    housekeepingApi.updateHousekeeping({ ...task, status })
      .then((updatedTask) => {
        setTasks((prev) => prev.map((item) => (item.apiId === updatedTask.apiId ? updatedTask : item)))
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to update housekeeping task')
      })
  }

  const handleAssignTask = (staffId: string) => {
    setSelectedStaffId(staffId)
    setIsAssignModalOpen(true)
  }

  const handleUpdateStaffStatus = (staffId: string, status: HousekeepingStaff['status']) => {
    setStaffMembers((prev) => prev.map((member) => (member.id === staffId ? { ...member, status } : member)))
  }

  const handleSaveTask = async (task: HousekeepingTaskFormData) => {
    const createdTask = await housekeepingApi.createHousekeeping(task)
    setTasks((prev) => [createdTask, ...prev])
  }

  const handleAssignTaskSave = async (taskId: string) => {
    if (!selectedStaff) return

    const task = tasks.find((item) => item.apiId === taskId || item.id === taskId)
    if (!task) return

    const updatedTask = await housekeepingApi.updateHousekeeping({
      ...task,
      assignedTo: selectedStaff.name,
      status: task.status === 'completed' ? task.status : 'in_progress'
    })

    setTasks((prev) => prev.map((item) => (item.apiId === updatedTask.apiId ? updatedTask : item)))
    setIsAssignModalOpen(false)
    setSelectedStaffId(null)
  }

  return (
    <>
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Housekeeping Management</h2>
          <p className="mt-0.5 text-sm text-gray-500">Manage cleaning schedules and staff assignments</p>
          {isLoading && <p className="mt-1 text-xs text-gray-500">Loading housekeeping data...</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Tasks Section - Takes up 2/3 of the width */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm xl:col-span-2">
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>

        {/* Staff Section - Takes up 1/3 of the width */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm xl:col-span-1">
          <StaffList
            staff={staffWithTaskCounts}
            onAssignTask={handleAssignTask}
            onUpdateStatus={handleUpdateStaffStatus}
          />
        </div>
      </div>
    </div>
    <HousekeepingTaskModal
      isOpen={isTaskModalOpen}
      rooms={roomOptions}
      staffOptions={staffNames}
      onClose={() => setIsTaskModalOpen(false)}
      onSave={handleSaveTask}
    />
    <HousekeepingAssignTaskModal
      isOpen={isAssignModalOpen}
      staff={selectedStaff}
      tasks={tasks}
      onClose={() => {
        setIsAssignModalOpen(false)
        setSelectedStaffId(null)
      }}
      onSave={handleAssignTaskSave}
    />
    </>
  )
}
