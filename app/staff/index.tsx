'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { apiClient } from '@/lib/core/api-client'
import { API_ENDPOINTS } from '@/lib/core/api-endpoints'
import StaffModal, { type StaffFormData } from '@/components/constants/modals/StaffModal'

type StaffRole = 'Manager' | 'Reception' | 'Housekeeping' | 'Maintenance' | 'Security' | string
type ProfileStatus = 'Probation' | 'Fired' | 'Active' | string

interface StaffApiRecord {
  _id: string
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
  role?: StaffRole
  profile_status?: ProfileStatus
  date_of_birth?: string
  salary?: number
  date_of_hire?: string
  last_payment_date?: string
  notes?: Array<{ note?: string }>
  shift_schedule?: Array<{
    day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
    shift?: 'Morning' | 'Afternoon' | 'Night'
  }>
  createdAt?: string
}

interface StaffListResponse {
  data: StaffApiRecord[]
  message: string
  status: string
}

interface StaffMember {
  id: string
  firstName: string
  secondName: string
  fullName: string
  email: string
  phone: string
  role: StaffRole
  profileStatus: ProfileStatus
  dateOfBirth: string
  salary: number | null
  dateOfHire: string
  lastPaymentDate: string
  notes: string
  shiftSchedule: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
    shift: 'Morning' | 'Afternoon' | 'Night'
  }>
  joinedDate: string
}

const roleColor = (role: StaffRole) => {
  if (role === 'Manager') return 'red'
  if (role === 'Maintenance') return 'orange'
  if (role === 'Housekeeping') return 'green'
  if (role === 'Reception') return 'blue'
  return 'purple'
}

const profileStatusColor = (status: ProfileStatus) => {
  if (status === 'Active') return 'green'
  if (status === 'Probation') return 'orange'
  if (status === 'Fired') return 'red'
  return 'default'
}

const defaultShiftSchedule = () => [{ day: 'Monday' as const, shift: 'Morning' as const }]

const normalizeShiftSchedule = (schedule?: StaffApiRecord['shift_schedule'] | StaffMember['shiftSchedule']) => {
  const normalized = (schedule || [])
    .filter((entry): entry is NonNullable<(typeof schedule)>[number] => Boolean(entry?.day && entry?.shift))
    .map((entry) => ({
      day: entry.day as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
      shift: entry.shift as 'Morning' | 'Afternoon' | 'Night'
    }))

  return normalized.length ? normalized : defaultShiftSchedule()
}

function mapStaff(item: StaffApiRecord): StaffMember {
  const firstName = item.first_name || ''
  const secondName = item.second_name || ''
  const fullName = [firstName, secondName].filter(Boolean).join(' ').trim() || 'Unknown'

  return {
    id: item._id,
    firstName,
    secondName,
    fullName,
    email: item.email || '-',
    phone: item.phone_number || '-',
    role: item.role || 'Reception',
    profileStatus: item.profile_status || 'Active',
    dateOfBirth: item.date_of_birth || '-',
    salary: typeof item.salary === 'number' ? item.salary : null,
    dateOfHire: item.date_of_hire || '-',
    lastPaymentDate: item.last_payment_date || '-',
    notes: item.notes?.[0]?.note || '-',
    shiftSchedule: normalizeShiftSchedule(item.shift_schedule),
    joinedDate: item.createdAt ? item.createdAt.split('T')[0] : '-'
  }
}

export default function StaffPageContent() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  const fetchStaff = async (isMounted = true) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<StaffListResponse>(API_ENDPOINTS.staff.all)
      if (!isMounted) return

      const staff = Array.isArray(response?.data) ? response.data : []
      setStaffMembers(staff.map(mapStaff))
    } catch (err) {
      if (!isMounted) return
      setError(err instanceof Error ? err.message : 'Failed to load staff members')
    } finally {
      if (isMounted) setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    fetchStaff(isMounted)

    return () => {
      isMounted = false
    }
  }, [])

  const openAddModal = () => {
    setModalType('add')
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const openEditModal = (staff: StaffMember) => {
    setModalType('edit')
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  const openViewModal = (staff: StaffMember) => {
    setModalType('view')
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  const getStaffForm = (staff: StaffMember | null): StaffFormData | null => {
    if (!staff) return null
    return {
      id: staff.id,
      first_name: staff.firstName,
      second_name: staff.secondName,
      email: staff.email === '-' ? '' : staff.email,
      phone_number: staff.phone,
      role: (staff.role as StaffFormData['role']) || 'Reception',
      profile_status: (staff.profileStatus as StaffFormData['profile_status']) || 'Active',
      date_of_birth: staff.dateOfBirth === '-' ? '' : staff.dateOfBirth,
      salary: staff.salary,
      date_of_hire: staff.dateOfHire === '-' ? '' : staff.dateOfHire,
      last_payment_date: staff.lastPaymentDate === '-' ? '' : staff.lastPaymentDate,
      notes: staff.notes === '-' ? '' : staff.notes,
      shift_schedule: normalizeShiftSchedule(staff.shiftSchedule)
    }
  }

  const handleSaveStaff = async (staff: StaffFormData) => {
    const payload = {
      first_name: staff.first_name,
      second_name: staff.second_name,
      email: staff.email || undefined,
      phone_number: staff.phone_number,
      role: staff.role,
      profile_status: staff.profile_status,
      date_of_birth: staff.date_of_birth || undefined,
      salary: typeof staff.salary === 'number' ? staff.salary : undefined,
      date_of_hire: staff.date_of_hire || undefined,
      last_payment_date: staff.last_payment_date || undefined,
      shift_schedule: normalizeShiftSchedule(staff.shift_schedule),
      notes: staff.notes
        ? [{ note: staff.notes, createdAt: new Date().toISOString() }]
        : undefined
    }

    if (modalType === 'add') {
      await apiClient.post(API_ENDPOINTS.staff.add, payload)
    } else if (staff.id) {
      await apiClient.put(API_ENDPOINTS.staff.byId(staff.id), payload)
    }

    await fetchStaff(true)
  }

  const columns: TableProps<StaffMember>['columns'] = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (value: string) => <span className="text-sm font-medium text-gray-900">{value}</span>
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (value: StaffRole) => <Tag color={roleColor(value)}>{value}</Tag>
      },
      {
        title: 'Profile Status',
        dataIndex: 'profileStatus',
        key: 'profileStatus',
        render: (value: ProfileStatus) => <Tag color={profileStatusColor(value)}>{value}</Tag>
      },
    //   {
    //     title: 'Joined',
    //     dataIndex: 'joinedDate',
    //     key: 'joinedDate'
    //   },
    //   {
    //     title: 'Date of Hire',
    //     dataIndex: 'dateOfHire',
    //     key: 'dateOfHire'
    //   },
      {
        title: 'Salary',
        dataIndex: 'salary',
        key: 'salary',
        render: (value: number | null) => (value ? `${value.toLocaleString()}` : '-')
      },
      {
        title: 'Last Payment',
        dataIndex: 'lastPaymentDate',
        key: 'lastPaymentDate'
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button type="link" onClick={() => openViewModal(record)}>
              View
            </Button>
            <Button type="link" onClick={() => openEditModal(record)}>
              Edit
            </Button>
          </div>
        )
      }
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Staff Members</h2>
        <p className="text-gray-600 mt-1">View and manage all staff records</p>
        {isLoading && <p className="text-sm text-gray-500 mt-1">Loading staff members...</p>}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="primary" onClick={openAddModal}>
          Add Staff
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table<StaffMember>
          rowKey="id"
          columns={columns}
          dataSource={staffMembers}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </div>

      <StaffModal
        isOpen={isModalOpen}
        type={modalType}
        staff={getStaffForm(selectedStaff)}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStaff}
      />
    </div>
  )
}
