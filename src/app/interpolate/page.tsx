'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function InterpolatePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    inputRange: [0, 60] as [number, number],
    outputRange: [0, 200] as [number, number],
    totalFrames: 60,
    extrapolateLeft: 'clamp' as 'clamp' | 'extend' | 'identity',
    extrapolateRight: 'clamp' as 'clamp' | 'extend' | 'identity'
  })

  const animatedValue = interpolate(
    currentFrame,
    parameters.inputRange,
    parameters.outputRange,
    {
      extrapolateLeft: parameters.extrapolateLeft,
      extrapolateRight: parameters.extrapolateRight
    }
  )

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const animatedValue = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.inputRange.join(', ')}], // inputRange
  [${parameters.outputRange.join(', ')}], // outputRange
  {
    extrapolateLeft: '${parameters.extrapolateLeft}',
    extrapolateRight: '${parameters.extrapolateRight}'
  }
)

// 現在の値: ${animatedValue.toFixed(2)}`
  }

  return (
    <PageLayout
      title="interpolate"
      description="フレーム値を指定した範囲で補間し、アニメーション値を生成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <Slider
              label="Input Range Start"
              value={parameters.inputRange[0]}
              min={0}
              max={100}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  inputRange: [value, prev.inputRange[1]]
                }))
              }
            />
            
            <Slider
              label="Input Range End"
              value={parameters.inputRange[1]}
              min={0}
              max={200}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  inputRange: [prev.inputRange[0], value]
                }))
              }
            />

            <Slider
              label="Output Range Start"
              value={parameters.outputRange[0]}
              min={-200}
              max={200}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  outputRange: [value, prev.outputRange[1]]
                }))
              }
            />

            <Slider
              label="Output Range End"
              value={parameters.outputRange[1]}
              min={-200}
              max={400}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  outputRange: [prev.outputRange[0], value]
                }))
              }
            />

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Extrapolate Left
              </label>
              <select
                value={parameters.extrapolateLeft}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    extrapolateLeft: e.target.value as 'clamp' | 'extend' | 'identity'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clamp">clamp</option>
                <option value="extend">extend</option>
                <option value="identity">identity</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Extrapolate Right
              </label>
              <select
                value={parameters.extrapolateRight}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    extrapolateRight: e.target.value as 'clamp' | 'extend' | 'identity'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clamp">clamp</option>
                <option value="extend">extend</option>
                <option value="identity">identity</option>
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

        <div className="lg:col-span-2 space-y-2">
          <AnimationPreview>
            <div className="w-full h-full relative">
              <div className="text-center mb-2">
                <p className="text-sm font-semibold">値: {animatedValue.toFixed(2)} | フレーム: {currentFrame}</p>
              </div>
              
              <div className="relative w-full h-24 bg-gray-100 rounded border overflow-hidden">
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full transition-all duration-100"
                  style={{
                    left: `${Math.max(0, Math.min(100, (animatedValue / 200) * 100))}%`,
                    transform: `translateX(-50%) translateY(-50%)`
                  }}
                />
                
                <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                  0
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  200
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between text-sm">
                  <span>Input Range:</span>
                  <span>[{parameters.inputRange.join(', ')}]</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Output Range:</span>
                  <span>[{parameters.outputRange.join(', ')}]</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>現在のInput:</span>
                  <span>{currentFrame}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>補間結果:</span>
                  <span>{animatedValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}