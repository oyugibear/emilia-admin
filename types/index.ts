export type RoomStatus = 'occupied' | 'available' | 'maintenance' | 'checkout' | 'housekeeping'

export interface Room {
	apiId?: string
	id: string
	type: string
	status: RoomStatus
	guest: string | null
	checkout: string | null
	maintenance: string
	cleanliness: string
	floor: number
	price: number
}

export type RoomModalType = 'add' | 'edit'

export interface RoomModalProps {
	isOpen: boolean
	type: RoomModalType
	room: Room | null
	onClose: () => void
	onSave: (room: Room) => Promise<void> | void
}

export interface RoomCardProps {
	room: Room
	onEdit: (room: Room) => void
}

export interface RoomApiRecord {
	_id: string
	room_number?: string
	type?: string
	floor?: number
	price?: number
	guest?: string | null
	housekeeping_status?: 'Clean' | 'Dirty' | 'In Progress'
}

export interface RoomsApiResponse {
	data: RoomApiRecord[]
	message: string
	status: string
}

export interface RoomApiPayload {
	room_number: string
	type: string
	floor: number
	price: number
	guest?: string
	housekeeping_status?: 'Clean' | 'Dirty' | 'In Progress'
}

export interface SingleRoomApiResponse {
	data: RoomApiRecord
	message: string
	status: string
}

export type MaintenancePriority = 'high' | 'medium' | 'low'
export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed'
export type MaintenanceModalType = 'add' | 'edit'

export interface MaintenanceRequest {
	apiId: string
	id: string
	roomId?: string
	room: string
	issue: string
	priority: MaintenancePriority
	status: MaintenanceStatus
	assignedToId?: string
	assignedTo: string | null
	date: string
	duration?: string
	notes?: string
}

export interface MaintenanceModalProps {
	isOpen: boolean
	type: MaintenanceModalType
	maintenance: MaintenanceRequest | null
	roomNumbers: string[]
	onClose: () => void
	onSave: (maintenance: MaintenanceRequest) => Promise<void> | void
}

export interface MaintenanceApiRecord {
	_id: string
	room?: string | { _id?: string; room_number?: string }
	assigned_to?:
		| string
		| {
				_id?: string
				first_name?: string
				second_name?: string
				email?: string
		  }
	date?: string
	duration?: string
	status?: string
	priority?: string
	notes?: string
	createdAt?: string
}

export interface MaintenancesApiResponse {
	data: MaintenanceApiRecord[]
	message: string
	status: string
}

export interface MaintenanceApiPayload {
	room?: string
	assigned_to?: string
	date: string
	duration?: string
	status: string
	priority?: string
	notes?: string
}

export interface SingleMaintenanceApiResponse {
	data: MaintenanceApiRecord
	message: string
	status: string
}

export type InventoryStockStatus = 'good' | 'low' | 'critical'
export type InventoryModalType = 'add' | 'edit'

export interface InventoryItem {
	apiId?: string
	roomId?: string
	id: string
	item: string
	stock: number
	minStock: number
	category: string
	lastUpdated: string
	status?: InventoryStockStatus
}

export interface InventoryModalProps {
	isOpen: boolean
	type: InventoryModalType
	item: InventoryItem | null
	onClose: () => void
	onSave: (item: InventoryItem) => Promise<void> | void
}

export interface InventoryApiRecord {
	_id: string
	item_name?: string
	quantity?: string
	category?: string
	room?: string | { _id?: string; room_number?: string }
	min_stock_level?: number
	current_stock_level?: number
	status?: string
	updatedAt?: string
}

export interface InventoryApiPayload {
	item_name: string
	quantity: string
	category?: string
	room?: string
	min_stock_level?: number
	current_stock_level?: number
	status: string
}

export interface InventoriesApiResponse {
	data: InventoryApiRecord[]
	message: string
	status: string
}

export interface SingleInventoryApiResponse {
	data: InventoryApiRecord
	message: string
	status: string
}
