'use client'

import React, { useState } from 'react'
import { MdAdd, MdFilterList } from 'react-icons/md'
import TaskCard, { HousekeepingTask } from './TaskCard'

interface TaskListProps {
  tasks: HousekeepingTask[]
  onAddTask?: () => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onStatusUpdate?: (taskId: string, status: HousekeepingTask['status']) => void
}

export default function TaskList({ 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onStatusUpdate 
}: TaskListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterTaskType, setFilterTaskType] = useState<string>('all')

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    if (filterTaskType !== 'all' && task.taskType !== filterTaskType) return false
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Housekeeping Tasks</h2>
            <p className="text-sm text-gray-600">
              {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>
          {onAddTask && (
            <button 
              onClick={onAddTask}
              className="bg-[#1D4E56] text-white px-4 py-2 rounded-lg hover:bg-[#2a6670] transition-colors duration-200 flex items-center gap-2"
            >
              <MdAdd className="w-4 h-4" />
              Add Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <MdFilterList className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56] focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select 
            value={filterTaskType} 
            onChange={(e) => setFilterTaskType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="checkout_cleaning">Checkout Cleaning</option>
            <option value="maintenance_cleaning">Maintenance Cleaning</option>
            <option value="deep_cleaning">Deep Cleaning</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MdFilterList className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {tasks.length === 0 
                ? "No housekeeping tasks have been created yet." 
                : "Try adjusting your filters to see more tasks."
              }
            </p>
            {onAddTask && tasks.length === 0 && (
              <button 
                onClick={onAddTask}
                className="mt-4 bg-[#1D4E56] text-white px-4 py-2 rounded-lg hover:bg-[#2a6670] transition-colors"
              >
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
