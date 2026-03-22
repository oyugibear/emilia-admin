'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import type { HousekeepingStaff } from '@/components/housekeeping/StaffCard'
import type { HousekeepingTask } from '@/components/housekeeping/TaskCard'

interface HousekeepingAssignTaskModalProps {
  isOpen: boolean
  staff: HousekeepingStaff | null
  tasks: HousekeepingTask[]
  onClose: () => void
  onSave: (taskId: string) => Promise<void> | void
}

export default function HousekeepingAssignTaskModal({ isOpen, staff, tasks, onClose, onSave }: HousekeepingAssignTaskModalProps) {
  const assignableTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'completed'),
    [tasks]
  )
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)
    setSelectedTaskId(assignableTasks[0]?.id || '')
  }, [isOpen, assignableTasks])

  if (!isOpen || !staff) return null

  const selectedTask = assignableTasks.find((task) => task.id === selectedTaskId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedTaskId) {
      setSubmitError('Please select a task to assign')
      return
    }

    setIsSaving(true)
    setSubmitError(null)

    try {
      await onSave(selectedTaskId)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to assign task')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title="Assign Task"
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={760}
    >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p><span className="font-medium text-gray-900">Staff:</span> {staff.name}</p>
            <p><span className="font-medium text-gray-900">Status:</span> {staff.status.replace('_', ' ')}</p>
            <p><span className="font-medium text-gray-900">Current tasks:</span> {staff.currentTasks}</p>
          </div>

          {assignableTasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              No open tasks are available for assignment.
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Select Task</label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                >
                  {assignableTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {`Room ${task.roomNumber} • ${task.taskType.replace(/_/g, ' ')} • ${task.priority}`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTask && (
                <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Room:</span> {selectedTask.roomNumber}</p>
                  <p><span className="font-medium text-gray-900">Task:</span> {selectedTask.taskType.replace(/_/g, ' ')}</p>
                  <p><span className="font-medium text-gray-900">Current assignee:</span> {selectedTask.assignedTo}</p>
                  <p><span className="font-medium text-gray-900">Scheduled:</span> {selectedTask.scheduledTime}</p>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || assignableTasks.length === 0}
              className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
    </Modal>
  )
}