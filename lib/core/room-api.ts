import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './api-client'
import type { Room, RoomApiPayload, RoomApiRecord, RoomsApiResponse, SingleRoomApiResponse } from '@/types'

function mapHousekeepingToStatus(housekeepingStatus?: RoomApiRecord['housekeeping_status']): Room['status'] {
  if (housekeepingStatus === 'In Progress' || housekeepingStatus === 'Dirty') {
    return 'housekeeping'
  }

  return 'available'
}

function mapRoomFromApi(item: RoomApiRecord): Room {
  const hasGuest = !!item.guest

  return {
    apiId: item._id,
    id: item.room_number || item._id,
    type: item.type || 'Room',
    status: hasGuest ? 'occupied' : mapHousekeepingToStatus(item.housekeeping_status),
    guest: item.guest || null,
    checkout: null,
    maintenance: 'none',
    cleanliness: (item.housekeeping_status || 'Clean').toLowerCase(),
    floor: item.floor ?? 1,
    price: item.price ?? 0
  }
}

function mapRoomStatusToHousekeeping(status: Room['status']): RoomApiPayload['housekeeping_status'] {
  if (status === 'housekeeping') return 'In Progress'
  if (status === 'maintenance') return 'Dirty'
  return 'Clean'
}

function mapRoomToApiPayload(room: Room): RoomApiPayload {
  const payload: RoomApiPayload = {
    room_number: room.id,
    type: room.type,
    floor: room.floor,
    price: room.price,
    housekeeping_status: mapRoomStatusToHousekeeping(room.status)
  }

  if (room.guest) {
    payload.guest = room.guest
  }

  return payload
}

export const roomApi = {
  async getRooms(): Promise<Room[]> {
    const response = await apiClient.get<RoomsApiResponse>(API_ENDPOINTS.rooms.all)
    const rooms = Array.isArray(response?.data) ? response.data : []

    return rooms.map(mapRoomFromApi)
  },

  async createRoom(room: Room): Promise<Room> {
    const response = await apiClient.post<SingleRoomApiResponse>(API_ENDPOINTS.rooms.add, mapRoomToApiPayload(room))

    return mapRoomFromApi(response.data)
  },

  async updateRoom(room: Room): Promise<Room> {
    if (!room.apiId) {
      throw new Error('Missing room identifier for update')
    }

    const response = await apiClient.put<SingleRoomApiResponse>(API_ENDPOINTS.rooms.byId(room.apiId), mapRoomToApiPayload(room))

    return mapRoomFromApi(response.data)
  }
}
