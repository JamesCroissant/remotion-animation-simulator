'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function FreezePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    totalFrames: 120,
    freezeFrame: 30,
    animationStartFrame: 0,
    animationEndFrame: 60,
    animationType: 'scale' as 'scale' | 'rotation' | 'position' | 'opacity',
    freezeType: 'clamp' as 'clamp' | 'loop' | 'reverse'
  })

  const getFrozenFrame = () => {
    // アニメーションの範囲外の場合
    if (currentFrame < parameters.animationStartFrame || currentFrame > parameters.animationEndFrame) {
      return parameters.freezeFrame
    }
    
    // フリーズフレーム以降の場合
    if (currentFrame >= parameters.freezeFrame) {
      switch (parameters.freezeType) {
        case 'clamp':
          return parameters.freezeFrame
        case 'loop':
          const loopDuration = parameters.freezeFrame - parameters.animationStartFrame
          return parameters.animationStartFrame + ((currentFrame - parameters.animationStartFrame) % loopDuration)
        case 'reverse':
          const reverseDuration = (parameters.freezeFrame - parameters.animationStartFrame) * 2
          const reverseProgress = (currentFrame - parameters.animationStartFrame) % reverseDuration
          return reverseProgress < (reverseDuration / 2)
            ? parameters.animationStartFrame + reverseProgress
            : parameters.animationStartFrame + (reverseDuration - reverseProgress)
        default:
          return parameters.freezeFrame
      }
    }
    
    return currentFrame
  }

  const frozenFrame = getFrozenFrame()
  const isFrozen = currentFrame >= parameters.freezeFrame && parameters.freezeType === 'clamp'

  const getAnimationValue = () => {
    const progress = interpolate(
      frozenFrame,
      [parameters.animationStartFrame, parameters.freezeFrame],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    switch (parameters.animationType) {
      case 'scale':
        return 0.5 + progress * 1.5
      case 'rotation':
        return progress * 360
      case 'position':
        return progress * 200
      case 'opacity':
        return progress
      default:
        return 0
    }
  }

  const animationValue = getAnimationValue()

  const generateCode = () => {
    return `import { interpolate, useCurrentFrame } from 'remotion'

const frame = useCurrentFrame() // ${currentFrame}
const freezeFrame = ${parameters.freezeFrame}

// Determine the effective frame for animation
const effectiveFrame = ${parameters.freezeType === 'clamp' ? 
  `frame >= freezeFrame ? freezeFrame : frame` :
  parameters.freezeType === 'loop' ?
  `frame >= freezeFrame 
    ? ${parameters.animationStartFrame} + ((frame - ${parameters.animationStartFrame}) % ${parameters.freezeFrame - parameters.animationStartFrame})
    : frame` :
  `// reverse logic here`
}

// Frozen frame: ${frozenFrame}
// Is frozen: ${isFrozen}

const animationValue = interpolate(
  effectiveFrame,
  [${parameters.animationStartFrame}, ${parameters.freezeFrame}],
  [${parameters.animationType === 'scale' ? '0.5, 2' : 
     parameters.animationType === 'rotation' ? '0, 360' :
     parameters.animationType === 'position' ? '0, 200' :
     '0, 1'}],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// Current value: ${animationValue.toFixed(2)}

// Usage in JSX:
<div style={{
  ${parameters.animationType === 'scale' ? `transform: 'scale($\{animationValue})'` :
    parameters.animationType === 'rotation' ? `transform: 'rotate($\{animationValue}deg)'` :
    parameters.animationType === 'position' ? `transform: 'translateX($\{animationValue}px)'` :
    `opacity: animationValue`}
}}>
  Your frozen content
</div>`
  }

  return (
    <PageLayout
      title="Freeze"
      description="アニメーションを特定のフレームで停止・固定します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="フリーズ設定" codeOutput={generateCode()}>
            <Slider
              label="Total Frames"
              value={parameters.totalFrames}
              min={60}
              max={200}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, totalFrames: value }))
              }
            />

            <Slider
              label="Animation Start Frame"
              value={parameters.animationStartFrame}
              min={0}
              max={parameters.freezeFrame - 10}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, animationStartFrame: value }))
              }
            />

            <Slider
              label="Freeze Frame"
              value={parameters.freezeFrame}
              min={parameters.animationStartFrame + 10}
              max={parameters.totalFrames - 10}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, freezeFrame: value }))
              }
            />

            <Slider
              label="Animation End Frame"
              value={parameters.animationEndFrame}
              min={parameters.freezeFrame}
              max={parameters.totalFrames}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, animationEndFrame: value }))
              }
            />

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Animation Type
              </label>
              <select
                value={parameters.animationType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    animationType: e.target.value as 'scale' | 'rotation' | 'position' | 'opacity'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scale">Scale</option>
                <option value="rotation">Rotation</option>
                <option value="position">Position</option>
                <option value="opacity">Opacity</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Freeze Type
              </label>
              <select
                value={parameters.freezeType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    freezeType: e.target.value as 'clamp' | 'loop' | 'reverse'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clamp">Clamp (Stay frozen)</option>
                <option value="loop">Loop (Restart animation)</option>
                <option value="reverse">Reverse (Ping-pong)</option>
              </select>
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
                <p className="text-sm font-semibold">
                  {isFrozen ? '🧊 FROZEN' : '▶️ ANIMATING'}
                </p>
                <p className="text-sm text-gray-600">
                  Frame: {currentFrame} → Effective: {frozenFrame}
                </p>
              </div>
              
              {/* タイムライン表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Animation Timeline</p>
                <div className="relative w-full h-12 bg-gray-200 rounded border">
                  {/* アニメーション範囲 */}
                  <div
                    className="absolute top-0 h-full bg-blue-200 rounded"
                    style={{
                      left: `${(parameters.animationStartFrame / parameters.totalFrames) * 100}%`,
                      width: `${((parameters.freezeFrame - parameters.animationStartFrame) / parameters.totalFrames) * 100}%`
                    }}
                  />
                  
                  {/* フリーズ範囲 */}
                  <div
                    className="absolute top-0 h-full bg-red-200 rounded"
                    style={{
                      left: `${(parameters.freezeFrame / parameters.totalFrames) * 100}%`,
                      width: `${((parameters.animationEndFrame - parameters.freezeFrame) / parameters.totalFrames) * 100}%`
                    }}
                  />
                  
                  {/* フリーズライン */}
                  <div
                    className="absolute top-0 w-1 h-full bg-red-500 z-10"
                    style={{ left: `${(parameters.freezeFrame / parameters.totalFrames) * 100}%` }}
                  />
                  
                  {/* 現在フレーム */}
                  <div
                    className="absolute top-0 w-1 h-full bg-black z-20"
                    style={{ left: `${(currentFrame / parameters.totalFrames) * 100}%` }}
                  />
                  
                  {/* 有効フレーム（フリーズ時は異なる） */}
                  {frozenFrame !== currentFrame && (
                    <div
                      className="absolute top-0 w-1 h-full bg-orange-500 z-15"
                      style={{ left: `${(frozenFrame / parameters.totalFrames) * 100}%` }}
                    />
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span className="text-blue-600">Start: {parameters.animationStartFrame}</span>
                  <span className="text-red-600">Freeze: {parameters.freezeFrame}</span>
                  <span className="text-gray-600">End: {parameters.animationEndFrame}</span>
                  <span>{parameters.totalFrames}</span>
                </div>
              </div>

              {/* 凡例 */}
              <div className="mb-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-blue-200 border"></div>
                    <span>Animation Range</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-3 bg-red-200 border"></div>
                    <span>Freeze Range</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-3 bg-black"></div>
                    <span>Current Frame</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-3 bg-orange-500"></div>
                    <span>Effective Frame</span>
                  </div>
                </div>
              </div>

              {/* アニメーション表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Animation Preview {isFrozen && '(Frozen)'}
                </p>
                <div className="flex items-center justify-center h-24 relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-100 ${
                      isFrozen ? 'ring-4 ring-red-400' : ''
                    }`}
                    style={{
                      transform: 
                        parameters.animationType === 'scale' ? `scale(${animationValue})` :
                        parameters.animationType === 'rotation' ? `rotate(${animationValue}deg)` :
                        parameters.animationType === 'position' ? `translateX(${animationValue - 100}px)` :
                        'none',
                      opacity: parameters.animationType === 'opacity' ? animationValue : 1
                    }}
                  >
                    {isFrozen ? '🧊' : '▶️'}
                  </div>
                  
                  {/* 参照線 */}
                  {parameters.animationType === 'position' && (
                    <div className="absolute w-1 h-full bg-gray-300 left-1/2 transform -translate-x-1/2 opacity-30" />
                  )}
                </div>
              </div>

              {/* フリーズ情報 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Freeze Status</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded text-center ${isFrozen ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="text-xs text-gray-600">Status</div>
                    <div className={`text-lg font-bold ${isFrozen ? 'text-red-600' : 'text-blue-600'}`}>
                      {isFrozen ? 'FROZEN' : 'ANIMATING'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-xs text-gray-600">Effective Frame</div>
                    <div className="text-lg font-bold text-orange-600">{frozenFrame}</div>
                  </div>
                </div>
              </div>

              {/* フリーズタイプの説明 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Freeze Type: {parameters.freezeType}</p>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {parameters.freezeType === 'clamp' && 'Animation stops at freeze frame and stays there'}
                  {parameters.freezeType === 'loop' && 'Animation restarts from beginning after freeze frame'}
                  {parameters.freezeType === 'reverse' && 'Animation plays forward then backward repeatedly'}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Frame:</span>
                  <span>{currentFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Frame:</span>
                  <span>{frozenFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freeze Frame:</span>
                  <span>{parameters.freezeFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Animation Type:</span>
                  <span className="capitalize">{parameters.animationType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Value:</span>
                  <span>
                    {parameters.animationType === 'scale' && animationValue.toFixed(2)}
                    {parameters.animationType === 'rotation' && `${animationValue.toFixed(1)}°`}
                    {parameters.animationType === 'position' && `${animationValue.toFixed(1)}px`}
                    {parameters.animationType === 'opacity' && animationValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Is Frozen:</span>
                  <span className={isFrozen ? 'text-red-600 font-medium' : 'text-blue-600'}>
                    {isFrozen ? 'Yes' : 'No'}
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