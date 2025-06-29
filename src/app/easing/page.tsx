'use client'

import { useState, useEffect } from 'react'
import { interpolate, Easing } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function EasingPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 0,
    endFrame: 60,
    totalFrames: 60,
    easingType: 'linear' as keyof typeof easingFunctions,
    customBezier: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
  })

  const easingFunctions = {
    linear: undefined,
    ease: Easing.ease,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    quad: Easing.quad,
    cubic: Easing.cubic,
    poly: Easing.poly(4),
    sin: Easing.sin,
    circle: Easing.circle,
    exp: Easing.exp,
    elastic: Easing.elastic(1),
    back: Easing.back(1.7),
    bounce: Easing.bounce,
    bezier: Easing.bezier(...parameters.customBezier)
  }

  const easedValue = interpolate(
    currentFrame,
    [parameters.startFrame, parameters.endFrame],
    [0, 300],
    {
      easing: easingFunctions[parameters.easingType],
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )

  const progress = interpolate(
    currentFrame,
    [parameters.startFrame, parameters.endFrame],
    [0, 1],
    {
      easing: easingFunctions[parameters.easingType],
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  )

  // イージングカーブ描画用のポイント生成
  const generateCurvePoints = () => {
    const points = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      let easedT = t
      
      if (easingFunctions[parameters.easingType]) {
        easedT = interpolate(
          t * parameters.endFrame,
          [0, parameters.endFrame],
          [0, 1],
          { easing: easingFunctions[parameters.easingType] }
        )
      }
      
      points.push({ x: t * 100, y: (1 - easedT) * 100 })
    }
    return points
  }

  const curvePoints = generateCurvePoints()
  const pathString = `M ${curvePoints.map(p => `${p.x},${p.y}`).join(' L ')}`

  const generateCode = () => {
    return `import { interpolate, Easing } from 'remotion'

const easedValue = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [0, 300],
  {
    easing: ${parameters.easingType === 'linear' ? 'undefined' : `Easing.${parameters.easingType}`}${
      parameters.easingType === 'bezier' ? `(${parameters.customBezier.join(', ')})` : 
      parameters.easingType === 'poly' ? '(4)' : 
      parameters.easingType === 'elastic' ? '(1)' : 
      parameters.easingType === 'back' ? '(1.7)' : ''
    },
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  }
)

// 現在の値: ${easedValue.toFixed(2)}
// 進行率: ${(progress * 100).toFixed(1)}%`
  }

  return (
    <PageLayout
      title="Easing Functions"
      description="様々なイージング関数を使ってアニメーションカーブをカスタマイズします"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Easing Type
              </label>
              <select
                value={parameters.easingType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    easingType: e.target.value as keyof typeof easingFunctions
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="easeIn">Ease In</option>
                <option value="easeOut">Ease Out</option>
                <option value="easeInOut">Ease In Out</option>
                <option value="quad">Quadratic</option>
                <option value="cubic">Cubic</option>
                <option value="poly">Polynomial</option>
                <option value="sin">Sine</option>
                <option value="circle">Circle</option>
                <option value="exp">Exponential</option>
                <option value="elastic">Elastic</option>
                <option value="back">Back</option>
                <option value="bounce">Bounce</option>
                <option value="bezier">Custom Bezier</option>
              </select>
            </div>

            {parameters.easingType === 'bezier' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Bezier Control Points</p>
                {parameters.customBezier.map((value, index) => (
                  <Slider
                    key={index}
                    label={`Point ${index + 1}`}
                    value={value}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(newValue) => {
                      const newBezier = [...parameters.customBezier] as [number, number, number, number]
                      newBezier[index] = newValue
                      setParameters(prev => ({ ...prev, customBezier: newBezier }))
                    }}
                  />
                ))}
              </div>
            )}

            <Slider
              label="Start Frame"
              value={parameters.startFrame}
              min={0}
              max={parameters.totalFrames - 10}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, startFrame: value }))
              }
            />

            <Slider
              label="End Frame"
              value={parameters.endFrame}
              min={parameters.startFrame + 10}
              max={parameters.totalFrames}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, endFrame: value }))
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
                <p className="text-sm font-semibold">Value: {easedValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Progress: {(progress * 100).toFixed(1)}%</p>
              </div>
              
              {/* イージングカーブ表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Easing Curve</p>
                <div className="relative w-full h-24 bg-gray-100 border rounded">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* グリッド */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    
                    {/* 軸 */}
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#6b7280" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="100" stroke="#6b7280" strokeWidth="1" />
                    
                    {/* イージングカーブ */}
                    <path 
                      d={pathString} 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="2"
                    />
                    
                    {/* 現在位置 */}
                    <circle 
                      cx={(currentFrame - parameters.startFrame) / (parameters.endFrame - parameters.startFrame) * 100}
                      cy={(1 - progress) * 100}
                      r="3" 
                      fill="#ef4444"
                    />
                  </svg>
                  
                  {/* 軸ラベル */}
                  <div className="absolute bottom-0 left-0 text-xs text-gray-500 transform translate-y-full">0</div>
                  <div className="absolute bottom-0 right-0 text-xs text-gray-500 transform translate-y-full">1</div>
                  <div className="absolute top-0 left-0 text-xs text-gray-500 transform -translate-x-full">1</div>
                  <div className="absolute bottom-0 left-0 text-xs text-gray-500 transform -translate-x-full">0</div>
                </div>
              </div>

              {/* アニメーションプレビュー */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Animation Preview</p>
                <div className="relative w-full h-16 bg-gray-100 rounded border">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full transition-all duration-100"
                    style={{
                      left: `${(easedValue / 300) * 100}%`,
                      transform: `translateX(-50%) translateY(-50%)`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Easing Type:</span>
                  <span className="capitalize">{parameters.easingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Range:</span>
                  <span>{parameters.startFrame} - {parameters.endFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Frame:</span>
                  <span>{currentFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Linear Progress:</span>
                  <span>{(((currentFrame - parameters.startFrame) / (parameters.endFrame - parameters.startFrame)) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Eased Progress:</span>
                  <span>{(progress * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}