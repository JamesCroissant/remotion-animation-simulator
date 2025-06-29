'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function LoopPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    totalFrames: 120,
    loopDuration: 30,
    loopType: 'restart' as 'restart' | 'reverse' | 'pingpong',
    animationType: 'rotation' as 'rotation' | 'scale' | 'position' | 'color',
    animationIntensity: 1
  })

  const getLoopFrame = () => {
    const loopProgress = currentFrame % parameters.loopDuration
    const loopCycle = Math.floor(currentFrame / parameters.loopDuration)
    
    switch (parameters.loopType) {
      case 'restart':
        return loopProgress
      
      case 'reverse':
        return loopCycle % 2 === 0 ? loopProgress : parameters.loopDuration - 1 - loopProgress
      
      case 'pingpong':
        const pingPongDuration = parameters.loopDuration * 2
        const pingPongProgress = currentFrame % pingPongDuration
        return pingPongProgress < parameters.loopDuration 
          ? pingPongProgress 
          : pingPongDuration - pingPongProgress
      
      default:
        return loopProgress
    }
  }

  const loopFrame = getLoopFrame()
  const loopProgress = loopFrame / parameters.loopDuration
  const currentLoopCycle = Math.floor(currentFrame / parameters.loopDuration) + 1

  const getAnimationValue = () => {
    switch (parameters.animationType) {
      case 'rotation':
        return loopProgress * 360 * parameters.animationIntensity
      
      case 'scale':
        return 0.5 + (Math.sin(loopProgress * Math.PI * 2) * 0.5 + 0.5) * parameters.animationIntensity
      
      case 'position':
        return Math.sin(loopProgress * Math.PI * 2) * 100 * parameters.animationIntensity
      
      case 'color':
        return loopProgress * 360
      
      default:
        return 0
    }
  }

  const animationValue = getAnimationValue()

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

// Loop configuration
const loopDuration = ${parameters.loopDuration}
const currentLoopFrame = currentFrame % loopDuration // ${loopFrame}
const loopProgress = currentLoopFrame / loopDuration // ${loopProgress.toFixed(3)}

// Loop type: ${parameters.loopType}
${parameters.loopType === 'reverse' ? `
const loopCycle = Math.floor(currentFrame / loopDuration)
const actualFrame = loopCycle % 2 === 0 
  ? currentLoopFrame 
  : loopDuration - 1 - currentLoopFrame
` : parameters.loopType === 'pingpong' ? `
const pingPongDuration = loopDuration * 2
const pingPongProgress = currentFrame % pingPongDuration
const actualFrame = pingPongProgress < loopDuration 
  ? pingPongProgress 
  : pingPongDuration - pingPongProgress
` : `
const actualFrame = currentLoopFrame
`}

// Animation value: ${animationValue.toFixed(2)}
// Current loop cycle: ${currentLoopCycle}

// Usage in JSX:
<div style={{
  ${parameters.animationType === 'rotation' ? `transform: 'rotate($\{loopProgress * 360}deg)'` :
    parameters.animationType === 'scale' ? `transform: 'scale($\{0.5 + Math.sin(loopProgress * Math.PI * 2) * 0.5})'` :
    parameters.animationType === 'position' ? `transform: 'translateX($\{Math.sin(loopProgress * Math.PI * 2) * 100}px)'` :
    `backgroundColor: 'hsl($\{loopProgress * 360}, 70%, 50%)'`}
}}>
  Your looping content
</div>`
  }

  return (
    <PageLayout
      title="Loop"
      description="アニメーションをループさせ、繰り返しパターンを作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="ループ設定" codeOutput={generateCode()}>
            <Slider
              label="Total Frames"
              value={parameters.totalFrames}
              min={60}
              max={300}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, totalFrames: value }))
              }
            />

            <Slider
              label="Loop Duration"
              value={parameters.loopDuration}
              min={10}
              max={60}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, loopDuration: value }))
              }
              unit=" frames"
            />

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Loop Type
              </label>
              <select
                value={parameters.loopType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    loopType: e.target.value as 'restart' | 'reverse' | 'pingpong'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="restart">Restart (0→1, 0→1, 0→1...)</option>
                <option value="reverse">Reverse (0→1, 1→0, 0→1...)</option>
                <option value="pingpong">Ping Pong (0→1→0→1...)</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Animation Type
              </label>
              <select
                value={parameters.animationType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    animationType: e.target.value as 'rotation' | 'scale' | 'position' | 'color'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rotation">Rotation</option>
                <option value="scale">Scale</option>
                <option value="position">Position</option>
                <option value="color">Color</option>
              </select>
            </div>

            <Slider
              label="Animation Intensity"
              value={parameters.animationIntensity}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, animationIntensity: value }))
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
            <div className="w-full h-full relative">
              <div className="text-center mb-2">
                <p className="text-sm font-semibold">Loop Cycle: {currentLoopCycle}</p>
                <p className="text-sm text-gray-600">
                  Frame {loopFrame} / {parameters.loopDuration} (Progress: {(loopProgress * 100).toFixed(1)}%)
                </p>
              </div>
              
              {/* ループタイプの可視化 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Loop Pattern: {parameters.loopType}</p>
                <div className="w-full h-12 bg-gray-200 rounded border relative overflow-hidden">
                  {/* ループパターンの背景表示 */}
                  {Array.from({ length: Math.ceil(parameters.totalFrames / parameters.loopDuration) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-r border-gray-400"
                      style={{
                        left: `${((i + 1) * parameters.loopDuration / parameters.totalFrames) * 100}%`,
                        width: '1px'
                      }}
                    />
                  ))}
                  
                  {/* プログレスバー */}
                  <div
                    className="absolute top-1 h-10 bg-blue-400 rounded transition-all duration-100"
                    style={{
                      left: `${(Math.floor(currentFrame / parameters.loopDuration) * parameters.loopDuration / parameters.totalFrames) * 100}%`,
                      width: `${(loopProgress * parameters.loopDuration / parameters.totalFrames) * 100}%`
                    }}
                  />
                  
                  {/* 現在フレーム */}
                  <div
                    className="absolute top-0 w-1 h-full bg-black z-10"
                    style={{ left: `${(currentFrame / parameters.totalFrames) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Loop 1</span>
                  <span>Loop 2</span>
                  <span>Loop 3+</span>
                </div>
              </div>

              {/* アニメーション表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Animation Preview</p>
                <div className="flex items-center justify-center h-28 relative">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-100"
                    style={{
                      transform: 
                        parameters.animationType === 'rotation' ? `rotate(${animationValue}deg)` :
                        parameters.animationType === 'scale' ? `scale(${animationValue})` :
                        parameters.animationType === 'position' ? `translateX(${animationValue}px)` :
                        'none',
                      backgroundColor: parameters.animationType === 'color' 
                        ? `hsl(${animationValue}, 70%, 50%)` 
                        : undefined
                    }}
                  >
                    LOOP
                  </div>
                  
                  {/* 中央参照線 */}
                  {parameters.animationType === 'position' && (
                    <>
                      <div className="absolute w-1 h-full bg-gray-300 left-1/2 transform -translate-x-1/2 opacity-30" />
                      <div className="absolute h-1 w-full bg-gray-300 top-1/2 transform -translate-y-1/2 opacity-30" />
                    </>
                  )}
                </div>
              </div>

              {/* ループ情報表示 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Loop Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600">Current Loop</div>
                    <div className="text-lg font-bold text-blue-600">{currentLoopCycle}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-600">Loop Progress</div>
                    <div className="text-lg font-bold text-green-600">{(loopProgress * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* 波形表示（ループパターンの可視化） */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Loop Waveform</p>
                <div className="w-full h-16 bg-gray-100 rounded border relative">
                  <svg width="100%" height="100%" viewBox="0 0 100 64" className="absolute inset-0">
                    {/* 波形描画 */}
                    <path
                      d={Array.from({ length: 101 }, (_, i) => {
                        const x = i
                        let y
                        const localProgress = (i % (parameters.loopDuration * 100 / parameters.totalFrames)) / (parameters.loopDuration * 100 / parameters.totalFrames)
                        
                        switch (parameters.loopType) {
                          case 'restart':
                            y = 64 - localProgress * 48 - 8
                            break
                          case 'reverse':
                            const cycle = Math.floor(i / (parameters.loopDuration * 100 / parameters.totalFrames))
                            y = cycle % 2 === 0 
                              ? 64 - localProgress * 48 - 8
                              : 64 - (1 - localProgress) * 48 - 8
                            break
                          case 'pingpong':
                            y = 64 - (Math.sin(localProgress * Math.PI) * 24 + 24) - 8
                            break
                          default:
                            y = 32
                        }
                        
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* 現在位置 */}
                    <line
                      x1={currentFrame * 100 / parameters.totalFrames}
                      y1="0"
                      x2={currentFrame * 100 / parameters.totalFrames}
                      y2="64"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Loop Type:</span>
                  <span className="capitalize">{parameters.loopType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loop Duration:</span>
                  <span>{parameters.loopDuration} frames</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Loops:</span>
                  <span>{Math.ceil(parameters.totalFrames / parameters.loopDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Animation Type:</span>
                  <span className="capitalize">{parameters.animationType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Value:</span>
                  <span>
                    {parameters.animationType === 'rotation' && `${animationValue.toFixed(1)}°`}
                    {parameters.animationType === 'scale' && animationValue.toFixed(2)}
                    {parameters.animationType === 'position' && `${animationValue.toFixed(1)}px`}
                    {parameters.animationType === 'color' && `${animationValue.toFixed(1)}°`}
                  </span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}