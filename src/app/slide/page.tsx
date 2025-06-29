'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function SlidePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 10,
    endFrame: 50,
    totalFrames: 60,
    direction: 'left' as 'left' | 'right' | 'up' | 'down',
    distance: 300,
    easing: 'ease' as 'linear' | 'ease' | 'easeIn' | 'easeOut'
  })

  const getSlideTransform = () => {
    const progress = interpolate(
      currentFrame,
      [parameters.startFrame, parameters.endFrame],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    // イージング適用
    let easedProgress = progress
    switch (parameters.easing) {
      case 'easeIn':
        easedProgress = progress * progress
        break
      case 'easeOut':
        easedProgress = 1 - Math.pow(1 - progress, 2)
        break
      case 'ease':
        easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        break
    }

    const distance = parameters.distance * (1 - easedProgress)

    switch (parameters.direction) {
      case 'left':
        return `translateX(-${distance}px)`
      case 'right':
        return `translateX(${distance}px)`
      case 'up':
        return `translateY(-${distance}px)`
      case 'down':
        return `translateY(${distance}px)`
      default:
        return 'translateX(0)'
    }
  }

  const slideTransform = getSlideTransform()

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const progress = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// ${parameters.easing} easing applied
const distance = ${parameters.distance} * (1 - progress)

// Usage in JSX:
<div style={{ 
  transform: 'translate${parameters.direction === 'left' || parameters.direction === 'right' ? 'X' : 'Y'}(${parameters.direction === 'left' || parameters.direction === 'up' ? '-' : ''}$\{distance}px)' 
}}>
  Your content
</div>`
  }

  return (
    <PageLayout
      title="slide"
      description="要素のスライド遷移効果を作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Slide Direction
              </label>
              <select
                value={parameters.direction}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    direction: e.target.value as 'left' | 'right' | 'up' | 'down'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">← Left</option>
                <option value="right">Right →</option>
                <option value="up">↑ Up</option>
                <option value="down">Down ↓</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Easing
              </label>
              <select
                value={parameters.easing}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    easing: e.target.value as 'linear' | 'ease' | 'easeIn' | 'easeOut'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="easeIn">Ease In</option>
                <option value="easeOut">Ease Out</option>
              </select>
            </div>

            <Slider
              label="Start Frame"
              value={parameters.startFrame}
              min={0}
              max={parameters.totalFrames - 10}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  startFrame: value
                }))
              }
            />

            <Slider
              label="End Frame"
              value={parameters.endFrame}
              min={parameters.startFrame + 10}
              max={parameters.totalFrames}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  endFrame: value
                }))
              }
            />

            <Slider
              label="Distance (px)"
              value={parameters.distance}
              min={50}
              max={500}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  distance: value
                }))
              }
            />

            <Slider
              label="Total Frames"
              value={parameters.totalFrames}
              min={30}
              max={120}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  totalFrames: value
                }))
              }
            />
          </ParameterPanel>

          <PlayControls
            currentFrame={currentFrame}
            totalFrames={parameters.totalFrames}
            onFrameChange={setCurrentFrame}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
          />
        </div>

        <div className="space-y-2">
          <AnimationPreview>
            <div className="w-full h-full relative overflow-hidden">
              <div className="text-center mb-2">
                <p className="text-sm font-semibold">Transform: {slideTransform}</p>
                <p className="text-sm text-gray-600">フレーム: {currentFrame}</p>
              </div>
              
              {/* スライド要素 */}
              <div className="flex items-center justify-center h-28 relative">
                <div
                  className="w-32 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg"
                  style={{ transform: slideTransform }}
                >
                  SLIDE
                </div>
                
                {/* 中央基準線 */}
                <div className="absolute w-1 h-full bg-gray-300 left-1/2 transform -translate-x-1/2 opacity-30"></div>
                <div className="absolute h-1 w-full bg-gray-300 top-1/2 transform -translate-y-1/2 opacity-30"></div>
              </div>

              {/* 方向インジケーター */}
              <div className="mt-2 text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm">Direction:</span>
                  <span className="text-lg">
                    {parameters.direction === 'left' && '←'}
                    {parameters.direction === 'right' && '→'}
                    {parameters.direction === 'up' && '↑'}
                    {parameters.direction === 'down' && '↓'}
                  </span>
                  <span className="text-sm capitalize">{parameters.direction}</span>
                </div>
              </div>

              {/* タイムライン */}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">アニメーション範囲</p>
                <div className="relative w-full h-6 bg-gray-200 rounded border">
                  <div
                    className="absolute top-0 h-full bg-blue-300 rounded"
                    style={{
                      left: `${(parameters.startFrame / parameters.totalFrames) * 100}%`,
                      width: `${((parameters.endFrame - parameters.startFrame) / parameters.totalFrames) * 100}%`
                    }}
                  />
                  <div
                    className="absolute top-0 w-1 h-full bg-black"
                    style={{ left: `${(currentFrame / parameters.totalFrames) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <span className="capitalize">{parameters.direction}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span>{parameters.distance}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Easing:</span>
                  <span>{parameters.easing}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{parameters.endFrame - parameters.startFrame} frames</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}