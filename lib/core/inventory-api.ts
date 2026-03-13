import { API_ENDPOINTS } from './api-endpoints'
import { apiClient } from './api-client'
import type {
  InventoriesApiResponse,
  InventoryApiPayload,
  InventoryApiRecord,
  InventoryItem,
  InventoryStockStatus,
  SingleInventoryApiResponse
} from '@/types'

function normalizeStatus(status?: string): InventoryStockStatus {
  const value = (status || '').toLowerCase()
  if (value === 'critical' || value === 'low' || value === 'good') return value
  return 'good'
}

function mapInventoryFromApi(item: InventoryApiRecord): InventoryItem {
  const stock = Number(item.current_stock_level ?? 0)
  const minStock = Number(item.min_stock_level ?? 0)

  return {
    apiId: item._id,
    roomId: typeof item.room === 'object' ? item.room?._id : undefined,
    id: item._id.slice(-6).toUpperCase(),
    item: item.item_name || 'Inventory Item',
    stock,
    minStock,
    category: item.category || 'General',
    lastUpdated: item.updatedAt ? item.updatedAt.split('T')[0] : new Date().toISOString().slice(0, 10),
    status: normalizeStatus(item.status)
  }
}

function mapInventoryToApiPayload(item: InventoryItem): InventoryApiPayload {
  return {
    item_name: item.item,
    quantity: String(item.stock),
    category: item.category,
    room: item.roomId,
    min_stock_level: item.minStock,
    current_stock_level: item.stock,
    status: item.status || (item.stock <= item.minStock * 0.5 ? 'critical' : item.stock <= item.minStock ? 'low' : 'good')
  }
}

export const inventoryApi = {
  async getInventories(): Promise<InventoryItem[]> {
    const response = await apiClient.get<InventoriesApiResponse>(API_ENDPOINTS.inventory.all)
    const records = Array.isArray(response?.data) ? response.data : []

    return records.map(mapInventoryFromApi)
  },

  async createInventory(item: InventoryItem): Promise<InventoryItem> {
    const response = await apiClient.post<SingleInventoryApiResponse>(
      API_ENDPOINTS.inventory.add,
      mapInventoryToApiPayload(item)
    )

    return mapInventoryFromApi(response.data)
  },

  async updateInventory(item: InventoryItem): Promise<InventoryItem> {
    if (!item.apiId) {
      throw new Error('Missing inventory identifier for update')
    }

    const response = await apiClient.put<SingleInventoryApiResponse>(
      API_ENDPOINTS.inventory.byId(item.apiId),
      mapInventoryToApiPayload(item)
    )

    return mapInventoryFromApi(response.data)
  }
}
