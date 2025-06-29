'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function FlipPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 15,
    endFrame: 45,
    totalFrames: 60,
    axis: 'horizontal' as 'horizontal' | 'vertical',
    degrees: 180,
    perspective: 1000
  })

  const getFlipRotation = () => {
    const progress = interpolate(
      currentFrame,
      [parameters.startFrame, parameters.endFrame],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    const rotation = progress * parameters.degrees

    if (parameters.axis === 'horizontal') {
      return `perspective(${parameters.perspective}px) rotateY(${rotation}deg)`
    } else {
      return `perspective(${parameters.perspective}px) rotateX(${rotation}deg)`
    }
  }

  const flipTransform = getFlipRotation()
  const progress = interpolate(
    currentFrame,
    [parameters.startFrame, parameters.endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const progress = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

const rotation = progress * ${parameters.degrees}

// Flip ${parameters.axis} effect
const transform = 'perspective(${parameters.perspective}px) rotate${parameters.axis === 'horizontal' ? 'Y' : 'X'}($\{rotation}deg)'

// Usage in JSX:
<div style={{ 
  transform: '${flipTransform}',
  transformStyle: 'preserve-3d'
}}>
  Your content
</div>

// Progress: ${(progress * 100).toFixed(1)}%`
  }

  return (
    <PageLayout
      title="flip"
      description="要素を3D回転させてフリップ効果を作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Flip Axis
              </label>
              <select
                value={parameters.axis}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    axis: e.target.value as 'horizontal' | 'vertical'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="horizontal">Horizontal (Y-axis)</option>
                <option value="vertical">Vertical (X-axis)</option>
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
              label="Degrees"
              value={parameters.degrees}
              min={90}
              max={720}
              step={15}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  degrees: value
                }))
              }
              unit="°"
            />

            <Slider
              label="Perspective"
              value={parameters.perspective}
              min={300}
              max={2000}
              step={50}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  perspective: value
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
                <p className="text-sm font-semibold">Rotation: {(progress * parameters.degrees).toFixed(1)}°</p>
                <p className="text-sm text-gray-600">Progress: {(progress * 100).toFixed(1)}%</p>
              </div>
              
              {/* フリップエフェクト表示 */}
              <div className="flex items-center justify-center mb-3" style={{ perspective: `${parameters.perspective}px` }}>
                <div
                  className="relative w-48 h-24"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipTransform
                  }}
                >
                  {/* フロント面 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base backface-hidden">
                    FRONT
                  </div>
                  
                  {/* バック面 */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-green-500 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-base backface-hidden"
                    style={{
                      transform: parameters.axis === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)'
                    }}
                  >
                    BACK
                  </div>
                </div>
              </div>

              {/* 軸インジケーター */}
              <div className="mb-2 text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <span className="text-sm">Axis:</span>
                  <span className="text-lg">
                    {parameters.axis === 'horizontal' ? '↔️' : '↕️'}
                  </span>
                  <span className="text-sm capitalize">{parameters.axis}</span>
                  <span className="text-sm text-gray-500">
                    ({parameters.axis === 'horizontal' ? 'Y-axis' : 'X-axis'})
                  </span>
                </div>
              </div>

              {/* 回転角度ゲージ */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Rotation Angle</p>
                <div className="relative w-full h-8 bg-gray-200 rounded border">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded transition-all duration-100"
                    style={{ width: `${(progress * parameters.degrees / 360) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {(progress * parameters.degrees).toFixed(0)}° / {parameters.degrees}°
                  </div>
                </div>
              </div>

              {/* タイムライン */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Animation Timeline</p>
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

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Flip Axis:</span>
                  <span className="capitalize">{parameters.axis} ({parameters.axis === 'horizontal' ? 'Y-axis' : 'X-axis'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Rotation:</span>
                  <span>{parameters.degrees}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Perspective:</span>
                  <span>{parameters.perspective}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Angle:</span>
                  <span>{(progress * parameters.degrees).toFixed(1)}°</span>
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
      
      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </PageLayout>
  )
}