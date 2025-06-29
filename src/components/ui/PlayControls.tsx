'use client'

import { useState, useEffect } from 'react'

interface PlayControlsProps {
  currentFrame: number
  totalFrames: number
  onFrameChange: (frame: number) => void
  isPlaying: boolean
  onPlayToggle: () => void
}

export function PlayControls({ 
  currentFrame, 
  totalFrames, 
  onFrameChange, 
  isPlaying, 
  onPlayToggle 
}: PlayControlsProps) {
  const [fps] = useState(30)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      onFrameChange((currentFrame + 1) % totalFrames)
    }, 1000 / fps)

    return () => clearInterval(interval)
  }, [isPlaying, currentFrame, totalFrames, fps, onFrameChange])

  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg">
      <div className="flex items-center space-x-3 mb-2">
        <button
          onClick={onPlayToggle}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition-colors text-sm"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <span className="text-xs">
          {currentFrame} / {totalFrames}
        </span>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => onFrameChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>{totalFrames - 1}</span>
        </div>
      </div>
    </div>
  )
}