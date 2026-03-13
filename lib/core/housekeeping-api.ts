import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './api-client'
import type { Room } from '@/types'
import type { HousekeepingTask } from '@/components/housekeeping/TaskCard'
import type { HousekeepingTaskFormData } from '@/components/constants/modals/HousekeepingTaskModal'

interface HousekeepingApiRoom {
  _id?: string
  room_number?: string
  type?: string
}

interface HousekeepingApiUser {
  _id?: string
  first_name?: string
  second_name?: string
  email?: string
}

interface HousekeepingApiRecord {
  _id: string
  room?: string | HousekeepingApiRoom
  maid?: string | HousekeepingApiUser
  maid_name?: string
  date?: string
  scheduled_time?: string
  duration?: string
  status?: string
  priority?: string
  task_type?: string
  guest_check_out?: string
  guest_check_in?: string
  completed_at?: string
  notes?: string
  createdAt?: string
}

interface HousekeepingsApiResponse {
  data: HousekeepingApiRecord[]
  message: string
  status: string
}

interface SingleHousekeepingApiResponse {
  data: HousekeepingApiRecord
  message: string
  status: string
}

interface HousekeepingApiPayload {
  room: string
  maid_name?: string
  date: string
  scheduled_time: string
  duration: string
  status: string
  priority: string
  task_type: string
  guest_check_out?: string
  guest_check_in?: string
  completed_at?: string
  notes?: string
}

const normalizeRoomType = (value?: string): HousekeepingTask['roomType'] => {
  if (value === 'Studio') return 'Studio'
  if (value === '1-Bedroom' || value === 'One Bedroom') return 'One Bedroom'
  if (value === '2-Bedroom' || value === 'Two Bedroom') return 'Two Bedroom'
  return 'Studio'
}

const normalizeTaskType = (value?: string): HousekeepingTask['taskType'] => {
  if (value === 'maintenance_cleaning') return 'maintenance_cleaning'
  if (value === 'deep_cleaning') return 'deep_cleaning'
  if (value === 'inspection') return 'inspection'
  return 'checkout_cleaning'
}

const normalizeStatus = (value?: string): HousekeepingTask['status'] => {
  const status = (value || '').toLowerCase().replace(/[-\s]+/g, '_')
  if (status === 'in_progress') return 'in_progress'
  if (status === 'completed') return 'completed'
  if (status === 'overdue') return 'overdue'
  return 'pending'
}

const normalizePriority = (value?: string): HousekeepingTask['priority'] => {
  const priority = (value || '').toLowerCase()
  if (priority === 'low' || priority === 'medium' || priority === 'high' || priority === 'urgent') {
    return priority
  }
  return 'medium'
}

const mapAssignedTo = (record: HousekeepingApiRecord): string => {
  if (record.maid_name) return record.maid_name

  if (record.maid && typeof record.maid === 'object') {
    const fullName = [record.maid.first_name, record.maid.second_name].filter(Boolean).join(' ').trim()
    return fullName || record.maid.email || 'Unassigned'
  }

  if (typeof record.maid === 'string' && record.maid.trim()) {
    return record.maid
  }

  return 'Unassigned'
}

const mapHousekeepingFromApi = (item: HousekeepingApiRecord): HousekeepingTask => {
  const room = typeof item.room === 'object' ? item.room : undefined
  const durationValue = Number(item.duration)

  return {
    apiId: item._id,
    roomId: room?._id,
    id: item._id.slice(-6).toUpperCase(),
    roomNumber: room?.room_number || 'Unknown',
    roomType: normalizeRoomType(room?.type),
    taskType: normalizeTaskType(item.task_type),
    status: normalizeStatus(item.status),
    assignedTo: mapAssignedTo(item),
    priority: normalizePriority(item.priority),
    scheduledTime: item.scheduled_time || '00:00',
    estimatedDuration: Number.isFinite(durationValue) && durationValue > 0 ? durationValue : 45,
    guestCheckOut: item.guest_check_out,
    guestCheckIn: item.guest_check_in,
    notes: item.notes,
    completedAt: item.completed_at
  }
}

const buildPayload = (task: HousekeepingTaskFormData | HousekeepingTask): HousekeepingApiPayload => ({
  room: task.roomId || '',
  maid_name: task.assignedTo && task.assignedTo !== 'Unassigned' ? task.assignedTo : undefined,
  date: new Date().toISOString().slice(0, 10),
  scheduled_time: task.scheduledTime,
  duration: String(task.estimatedDuration),
  status: task.status,
  priority: task.priority,
  task_type: task.taskType,
  guest_check_out: task.guestCheckOut || undefined,
  guest_check_in: task.guestCheckIn || undefined,
  completed_at: ('completedAt' in task ? task.completedAt : undefined) || undefined,
  notes: task.notes || undefined
})

export const housekeepingApi = {
  async getHousekeepings(): Promise<HousekeepingTask[]> {
    const response = await apiClient.get<HousekeepingsApiResponse>(API_ENDPOINTS.housekeeping.all)
    const records = Array.isArray(response?.data) ? response.data : []

    return records.map(mapHousekeepingFromApi)
  },

  async createHousekeeping(task: HousekeepingTaskFormData): Promise<HousekeepingTask> {
    const response = await apiClient.post<SingleHousekeepingApiResponse>(
      API_ENDPOINTS.housekeeping.add,
      buildPayload(task)
    )

    return mapHousekeepingFromApi(response.data)
  },

  async updateHousekeeping(task: HousekeepingTask): Promise<HousekeepingTask> {
    if (!task.apiId) {
      throw new Error('Missing housekeeping identifier for update')
    }

    const response = await apiClient.put<SingleHousekeepingApiResponse>(
      API_ENDPOINTS.housekeeping.byId(task.apiId),
      buildPayload(task)
    )

    return mapHousekeepingFromApi(response.data)
  },

  async deleteHousekeeping(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.housekeeping.byId(id))
  },

  mapRoomsForModal(rooms: Room[]) {
    return rooms.map((room) => ({
      id: room.apiId || room.id,
      number: room.id,
      type: normalizeRoomType(room.type)
    }))
  }
}