'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function ClockWipePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 10,
    endFrame: 50,
    totalFrames: 60,
    startAngle: 0,
    clockwise: true,
    centerX: 150,
    centerY: 100
  })

  const getWipeAngle = () => {
    const progress = interpolate(
      currentFrame,
      [parameters.startFrame, parameters.endFrame],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    const totalAngle = 360
    const currentAngle = parameters.startAngle + (parameters.clockwise ? 1 : -1) * progress * totalAngle
    return currentAngle
  }

  const wipeAngle = getWipeAngle()
  const progress = interpolate(
    currentFrame,
    [parameters.startFrame, parameters.endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // SVGクリップパス生成
  const generateClipPath = () => {
    const centerX = parameters.centerX
    const centerY = parameters.centerY
    const radius = 200
    
    if (progress === 0) {
      return `polygon(${centerX}px ${centerY}px, ${centerX}px ${centerY}px, ${centerX}px ${centerY}px)`
    }
    
    if (progress >= 1) {
      return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    }

    // 時計回りの角度計算
    const angle = (parameters.startAngle + progress * 360) * (Math.PI / 180)
    const x = centerX + Math.cos(angle - Math.PI / 2) * radius
    const y = centerY + Math.sin(angle - Math.PI / 2) * radius
    
    // 開始点（12時方向）
    const startX = centerX
    const startY = centerY - radius

    let path = `${centerX}px ${centerY}px, ${startX}px ${startY}px`
    
    // 角度に応じて追加のポイントを計算
    const steps = Math.ceil(progress * 8) // 8分割で滑らかに
    for (let i = 1; i <= steps; i++) {
      const stepAngle = (parameters.startAngle + (i / steps) * progress * 360) * (Math.PI / 180)
      const stepX = centerX + Math.cos(stepAngle - Math.PI / 2) * radius
      const stepY = centerY + Math.sin(stepAngle - Math.PI / 2) * radius
      path += `, ${stepX}px ${stepY}px`
    }

    return `polygon(${path})`
  }

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const progress = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// Clock wipe effect calculation
const angle = ${parameters.startAngle} + progress * 360
const centerX = ${parameters.centerX}
const centerY = ${parameters.centerY}

// Generate clip-path for clock wipe
const clipPath = generateClockWipeClipPath(progress, centerX, centerY)

// Usage in JSX:
<div style={{ 
  clipPath: '${generateClipPath()}'
}}>
  Your content
</div>

// Current angle: ${wipeAngle.toFixed(1)}°`
  }

  return (
    <PageLayout
      title="clockWipe"
      description="時計回りのワイプエフェクトで要素を表示します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
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
              label="Start Angle"
              value={parameters.startAngle}
              min={0}
              max={360}
              step={15}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  startAngle: value
                }))
              }
              unit="°"
            />

            <Slider
              label="Center X"
              value={parameters.centerX}
              min={50}
              max={250}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  centerX: value
                }))
              }
              unit="px"
            />

            <Slider
              label="Center Y"
              value={parameters.centerY}
              min={50}
              max={150}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  centerY: value
                }))
              }
              unit="px"
            />

            <div className="mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.clockwise}
                  onChange={(e) =>
                    setParameters(prev => ({ ...prev, clockwise: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Clockwise</span>
              </label>
            </div>
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
                <p className="text-sm font-semibold">Angle: {wipeAngle.toFixed(1)}°</p>
                <p className="text-sm text-gray-600">Progress: {(progress * 100).toFixed(1)}%</p>
              </div>
              
              {/* クロックワイプエフェクト表示 */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-60 h-48">
                  {/* 背景要素 */}
                  <div className="absolute inset-0 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                    BACKGROUND
                  </div>
                  
                  {/* クロックワイプされる要素 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-base"
                    style={{
                      clipPath: generateClipPath()
                    }}
                  >
                    CLOCK WIPE
                  </div>

                  {/* 中心点とガイドライン */}
                  <div
                    className="absolute w-2 h-2 bg-black rounded-full"
                    style={{
                      left: parameters.centerX - 4,
                      top: parameters.centerY - 4
                    }}
                  />
                  
                  {/* 現在の角度を示す線 */}
                  <div
                    className="absolute w-0.5 bg-black origin-bottom"
                    style={{
                      left: parameters.centerX,
                      top: parameters.centerY - 80,
                      height: '80px',
                      transform: `rotate(${wipeAngle}deg)`,
                      transformOrigin: 'bottom center'
                    }}
                  />
                </div>
              </div>

              {/* 時計型プログレス表示 */}
              <div className="mb-2 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg width="96" height="96" className="transform -rotate-90">
                    {/* 背景円 */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    {/* プログレス円 */}
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
                      className="transition-all duration-100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {Math.round(progress * 100)}%
                  </div>
                </div>
              </div>

              {/* 角度設定 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Direction & Center</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <div className="font-medium">Direction</div>
                    <div>{parameters.clockwise ? '🕐 Clockwise' : '🕘 Counter-clockwise'}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <div className="font-medium">Center</div>
                    <div>({parameters.centerX}, {parameters.centerY})</div>
                  </div>
                </div>
              </div>

              {/* タイムライン */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Animation Timeline</p>
                <div className="relative w-full h-6 bg-gray-200 rounded border">
                  <div
                    className="absolute top-0 h-full bg-orange-300 rounded"
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
                  <span>Start Angle:</span>
                  <span>{parameters.startAngle}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Angle:</span>
                  <span>{wipeAngle.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Center Point:</span>
                  <span>({parameters.centerX}, {parameters.centerY})</span>
                </div>
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <span>{parameters.clockwise ? 'Clockwise' : 'Counter-clockwise'}</span>
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