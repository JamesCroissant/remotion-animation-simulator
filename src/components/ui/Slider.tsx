'use client'

import { useState, useCallback } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export function Slider({ label, value, min, max, step = 1, onChange, unit = '' }: SliderProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    setLocalValue(newValue)
    onChange(newValue)
  }, [onChange])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    setLocalValue(newValue)
    onChange(newValue)
  }, [onChange])

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <input
          type="number"
          value={localValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-16 px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  )
}