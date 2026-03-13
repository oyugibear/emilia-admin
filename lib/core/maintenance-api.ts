import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './api-client'
import type {
  MaintenanceApiPayload,
  MaintenanceApiRecord,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
  MaintenancesApiResponse,
  SingleMaintenanceApiResponse
} from '@/types'

function normalizePriority(priority?: string): MaintenancePriority {
  const value = (priority || '').toLowerCase()
  if (value === 'high' || value === 'medium' || value === 'low') return value
  return 'medium'
}

function normalizeStatus(status?: string): MaintenanceStatus {
  const value = (status || '').toLowerCase().replace(/[_\s]+/g, '-')
  if (value === 'completed') return 'completed'
  if (value === 'in-progress') return 'in-progress'
  return 'pending'
}

function mapRoomLabel(room?: MaintenanceApiRecord['room']): string {
  if (!room) return 'Unknown'
  if (typeof room === 'string') return room
  return room.room_number || room._id || 'Unknown'
}

function mapAssignedTo(value?: MaintenanceApiRecord['assigned_to']): string | null {
  if (!value) return null
  if (typeof value === 'string') return value

  const fullName = [value.first_name, value.second_name].filter(Boolean).join(' ').trim()
  return fullName || value.email || value._id || null
}

function mapDate(record: MaintenanceApiRecord): string {
  const raw = record.date || record.createdAt
  if (!raw) return '-'
  return raw.includes('T') ? raw.split('T')[0] : raw
}

function mapMaintenanceFromApi(item: MaintenanceApiRecord): MaintenanceRequest {
  const roomId = typeof item.room === 'object' ? item.room?._id : undefined
  const roomLabel = mapRoomLabel(item.room)
  const assignedToId = typeof item.assigned_to === 'object' ? item.assigned_to?._id : undefined

  return {
    apiId: item._id,
    id: item._id.slice(-6).toUpperCase(),
    roomId,
    room: roomLabel,
    issue: item.notes || 'No issue provided',
    priority: normalizePriority(item.priority),
    status: normalizeStatus(item.status),
    assignedToId,
    assignedTo: mapAssignedTo(item.assigned_to),
    date: mapDate(item),
    duration: item.duration,
    notes: item.notes
  }
}

function mapMaintenanceToPayload(item: MaintenanceRequest): MaintenanceApiPayload {
  const payload: MaintenanceApiPayload = {
    date: item.date,
    status: item.status,
    priority: item.priority,
    notes: item.issue || item.notes,
    duration: item.duration
  }

  if (item.roomId) payload.room = item.roomId
  if (item.assignedToId) payload.assigned_to = item.assignedToId

  return payload
}

export const maintenanceApi = {
  async getMaintenances(): Promise<MaintenanceRequest[]> {
    const response = await apiClient.get<MaintenancesApiResponse>(API_ENDPOINTS.maintenance.all)
    const records = Array.isArray(response?.data) ? response.data : []

    return records.map(mapMaintenanceFromApi)
  },

  async createMaintenance(item: MaintenanceRequest): Promise<MaintenanceRequest> {
    const response = await apiClient.post<SingleMaintenanceApiResponse>(
      API_ENDPOINTS.maintenance.add,
      mapMaintenanceToPayload(item)
    )

    return mapMaintenanceFromApi(response.data)
  },

  async updateMaintenance(item: MaintenanceRequest): Promise<MaintenanceRequest> {
    if (!item.apiId) {
      throw new Error('Missing maintenance identifier for update')
    }

    const response = await apiClient.put<SingleMaintenanceApiResponse>(
      API_ENDPOINTS.maintenance.byId(item.apiId),
      mapMaintenanceToPayload(item)
    )

    return mapMaintenanceFromApi(response.data)
  }
}
