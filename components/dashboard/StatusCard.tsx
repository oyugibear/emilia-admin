import React from 'react'

export default function StatusCard({title, number} : {title: string, number: number}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{number}</p>
            </div>
        </div>
    </div>
  )
}
