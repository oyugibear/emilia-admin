import React from 'react'

interface CheckboxProps {
  id: string
  name?: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  className?: string
}

export default function Checkbox({
  id,
  name,
  checked = false,
  onChange,
  label,
  className = ''
}: CheckboxProps) {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#1D4E56] border-gray-300 rounded focus:ring-[#1D4E56] focus:ring-2 transition-colors duration-200"
      />
      <span className="ml-2 text-gray-600 text-sm select-none">{label}</span>
    </label>
  )
}
