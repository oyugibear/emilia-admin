import React from 'react'
import { IconType } from 'react-icons'

interface InputProps {
  id: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
  icon?: IconType
  required?: boolean
  className?: string
}

export default function Input({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  required = false,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="text-gray-400 text-sm" />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4E56] focus:border-[#1D4E56] transition-colors duration-200 text-gray-900 placeholder-gray-500`}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  )
}
