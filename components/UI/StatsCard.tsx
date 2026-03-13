'use client'

import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: 'default' | 'green' | 'yellow' | 'red' | 'blue' | 'purple'
  trend?: {
    value: string
    isPositive: boolean
  }
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = 'default',
  trend 
}: StatsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-600'
      case 'yellow':
        return 'text-yellow-600'
      case 'red':
        return 'text-red-600'
      case 'blue':
        return 'text-blue-600'
      case 'purple':
        return 'text-purple-600'
      default:
        return 'text-[#1D4E56]'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${getColorClasses()}`}>
            {value}
          </p>
          {trend && (
            <div className={`text-sm flex items-center gap-1 mt-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`text-2xl ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
