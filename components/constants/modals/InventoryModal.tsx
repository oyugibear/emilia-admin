'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import type { InventoryItem, InventoryModalProps } from '@/types'

const INVENTORY_CATEGORIES = [
  'General',
  'Bedding',
  'Bathroom',
  'Kitchen',
  'Cleaning Supplies',
  'Amenities',
  'Electrical',
  'Plumbing',
  'Maintenance',
  'Laundry',
  'Office Supplies',
  'Safety'
] as const

const defaultInventoryItem: InventoryItem = {
  id: '',
  item: '',
  stock: 0,
  minStock: 0,
  category: 'General',
  lastUpdated: new Date().toISOString().slice(0, 10)
}

export default function InventoryModal({ isOpen, type, item, onClose, onSave }: InventoryModalProps) {
  const [form, setForm] = useState<InventoryItem>(defaultInventoryItem)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitError(null)

    if (type === 'edit' && item) {
      setForm(item)
      return
    }

    setForm(defaultInventoryItem)
  }, [isOpen, type, item])

  const handleChange = <K extends keyof InventoryItem>(key: K, value: InventoryItem[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSaving(true)

    const normalized: InventoryItem = {
      ...form,
      item: form.item.trim(),
      category: form.category.trim(),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      lastUpdated: form.lastUpdated || new Date().toISOString().slice(0, 10)
    }

    try {
      await onSave(normalized)
      onClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save inventory item')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      title={type === 'add' ? 'Add Inventory Item' : 'Edit Inventory Item'}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={800}
    >
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-gray-700">Item Name</label>
              <input
                required
                value={form.item}
                onChange={(e) => handleChange('item', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
                placeholder="e.g. Bed Sheets (Queen)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Category</label>
              <select
                required
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              >
                {INVENTORY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                {form.category && !INVENTORY_CATEGORIES.includes(form.category as (typeof INVENTORY_CATEGORIES)[number]) && (
                  <option value={form.category}>{form.category}</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Last Updated</label>
              <input
                required
                type="date"
                value={form.lastUpdated}
                onChange={(e) => handleChange('lastUpdated', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Current Stock</label>
              <input
                required
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => handleChange('stock', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">Minimum Stock</label>
              <input
                required
                type="number"
                min={0}
                value={form.minStock}
                onChange={(e) => handleChange('minStock', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4E56]"
              />
            </div>
          </div>

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
              disabled={isSaving}
              className="rounded-md bg-[#1D4E56] px-4 py-2 text-sm text-white hover:bg-[#2a6670]"
            >
              {isSaving ? 'Saving...' : type === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
    </Modal>
  )
}
