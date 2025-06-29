'use client'

import { useRef, useEffect } from 'react'

interface AnimationPreviewProps {
  children: React.ReactNode
  className?: string
}

export function AnimationPreview({ children, className = '' }: AnimationPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`bg-gray-900 rounded-lg p-3 ${className}`}>
      <div className="bg-white rounded-lg h-[250px] flex items-center justify-center relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}