'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function WipePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 15,
    endFrame: 45,
    totalFrames: 60,
    direction: 'left' as 'left' | 'right' | 'up' | 'down',
    width: 300,
    height: 200
  })

  const getWipeProgress = () => {
    return interpolate(
      currentFrame,
      [parameters.startFrame, parameters.endFrame],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }

  const progress = getWipeProgress()

  const getClipPath = () => {
    switch (parameters.direction) {
      case 'left':
        return `inset(0 ${100 - progress * 100}% 0 0)`
      case 'right':
        return `inset(0 0 0 ${100 - progress * 100}%)`
      case 'up':
        return `inset(${100 - progress * 100}% 0 0 0)`
      case 'down':
        return `inset(0 0 ${100 - progress * 100}% 0)`
      default:
        return 'inset(0)'
    }
  }

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const progress = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// Wipe ${parameters.direction} effect
const clipPath = 'inset(${
  parameters.direction === 'up' ? `$\{100 - progress * 100}% 0 0 0` :
  parameters.direction === 'down' ? `0 0 $\{100 - progress * 100}% 0` :
  parameters.direction === 'left' ? `0 $\{100 - progress * 100}% 0 0` :
  `0 0 0 $\{100 - progress * 100}%`
})'

// Usage in JSX:
<div style={{ clipPath: '${getClipPath()}' }}>
  Your content
</div>

// Progress: ${(progress * 100).toFixed(1)}%`
  }

  return (
    <PageLayout
      title="wipe"
      description="要素をワイプエフェクトで表示・非表示にします"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Wipe Direction
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
                <option value="left">← Left to Right</option>
                <option value="right">Right to Left →</option>
                <option value="up">↑ Top to Bottom</option>
                <option value="down">Bottom to Top ↓</option>
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
              label="Width"
              value={parameters.width}
              min={150}
              max={400}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  width: value
                }))
              }
              unit="px"
            />

            <Slider
              label="Height"
              value={parameters.height}
              min={100}
              max={300}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  height: value
                }))
              }
              unit="px"
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
            <div className="w-full h-full relative">
              <div className="text-center mb-2">
                <p className="text-sm font-semibold">Progress: {(progress * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">ClipPath: {getClipPath()}</p>
              </div>
              
              {/* ワイプエフェクト表示 */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  {/* 背景要素 */}
                  <div
                    className="bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold"
                    style={{
                      width: parameters.width,
                      height: parameters.height
                    }}
                  >
                    BACKGROUND
                  </div>
                  
                  {/* ワイプされる要素 */}
                  <div
                    className="absolute top-0 left-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-base"
                    style={{
                      width: parameters.width,
                      height: parameters.height,
                      clipPath: getClipPath()
                    }}
                  >
                    WIPE
                  </div>
                </div>
              </div>

              {/* 方向インジケーター */}
              <div className="mb-2 text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <span className="text-sm">Direction:</span>
                  <span className="text-lg">
                    {parameters.direction === 'left' && '→'}
                    {parameters.direction === 'right' && '←'}
                    {parameters.direction === 'up' && '↓'}
                    {parameters.direction === 'down' && '↑'}
                  </span>
                  <span className="text-sm capitalize">
                    {parameters.direction === 'left' && 'Left to Right'}
                    {parameters.direction === 'right' && 'Right to Left'}
                    {parameters.direction === 'up' && 'Top to Bottom'}
                    {parameters.direction === 'down' && 'Bottom to Top'}
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Wipe Progress</p>
                <div className="w-full h-4 bg-gray-200 rounded border overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-100"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              {/* タイムライン */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Animation Timeline</p>
                <div className="relative w-full h-6 bg-gray-200 rounded border">
                  <div
                    className="absolute top-0 h-full bg-purple-300 rounded"
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

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <span className="capitalize">{parameters.direction}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{parameters.width} × {parameters.height}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{parameters.endFrame - parameters.startFrame} frames</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Frame:</span>
                  <span>{currentFrame}</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}