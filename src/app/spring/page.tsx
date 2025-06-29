'use client'

import { useState, useEffect } from 'react'
import { spring } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function SpringPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    fps: 30,
    totalFrames: 120,
    from: 0,
    to: 300,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
    }
  })

  const springValue = spring({
    frame: currentFrame,
    fps: parameters.fps,
    from: parameters.from,
    to: parameters.to,
    config: parameters.config
  })

  const generateCode = () => {
    return `import { spring } from 'remotion'

const springValue = spring({
  frame: currentFrame, // ${currentFrame}
  fps: ${parameters.fps},
  from: ${parameters.from},
  to: ${parameters.to},
  config: {
    damping: ${parameters.config.damping},
    stiffness: ${parameters.config.stiffness},
    mass: ${parameters.config.mass},
    overshootClamping: ${parameters.config.overshootClamping},
    restDisplacementThreshold: ${parameters.config.restDisplacementThreshold},
    restSpeedThreshold: ${parameters.config.restSpeedThreshold}
  }
})

// 現在の値: ${springValue.toFixed(2)}`
  }

  return (
    <PageLayout
      title="spring"
      description="物理ベースのバネアニメーションを生成し、自然な動きを作り出します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <Slider
              label="From (開始値)"
              value={parameters.from}
              min={-200}
              max={200}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  from: value
                }))
              }
            />
            
            <Slider
              label="To (終了値)"
              value={parameters.to}
              min={-200}
              max={500}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  to: value
                }))
              }
            />

            <Slider
              label="FPS"
              value={parameters.fps}
              min={15}
              max={60}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  fps: value
                }))
              }
            />

            <Slider
              label="Damping (減衰)"
              value={parameters.config.damping}
              min={1}
              max={50}
              step={0.1}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  config: { ...prev.config, damping: value }
                }))
              }
            />

            <Slider
              label="Stiffness (剛性)"
              value={parameters.config.stiffness}
              min={10}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  config: { ...prev.config, stiffness: value }
                }))
              }
            />

            <Slider
              label="Mass (質量)"
              value={parameters.config.mass}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  config: { ...prev.config, mass: value }
                }))
              }
            />

            <Slider
              label="Rest Displacement Threshold"
              value={parameters.config.restDisplacementThreshold}
              min={0.001}
              max={0.1}
              step={0.001}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  config: { ...prev.config, restDisplacementThreshold: value }
                }))
              }
            />

            <Slider
              label="Rest Speed Threshold"
              value={parameters.config.restSpeedThreshold}
              min={0.001}
              max={0.1}
              step={0.001}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  config: { ...prev.config, restSpeedThreshold: value }
                }))
              }
            />

            <div className="mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.config.overshootClamping}
                  onChange={(e) =>
                    setParameters(prev => ({
                      ...prev,
                      config: { ...prev.config, overshootClamping: e.target.checked }
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Overshoot Clamping (オーバーシュート抑制)
                </span>
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
                <p className="text-sm font-semibold">現在の値: {springValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">フレーム: {currentFrame}</p>
              </div>
              
              {/* 水平方向の動き */}
              <div className="relative w-full h-24 bg-gray-100 rounded border overflow-hidden mb-2">
                <div className="absolute top-1/2 left-2 w-1 h-12 bg-gray-400"></div>
                <div className="absolute top-1/2 text-xs text-gray-500 left-0 transform -translate-y-6">
                  開始
                </div>
                
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full transition-all duration-75 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    left: `${Math.max(8, Math.min(92, ((springValue - parameters.from) / (parameters.to - parameters.from)) * 84 + 8))}%`
                  }}
                >
                  ●
                </div>

                <div className="absolute top-1/2 right-2 w-1 h-12 bg-red-400"></div>
                <div className="absolute top-1/2 text-xs text-gray-500 right-0 transform -translate-y-6">
                  目標
                </div>
              </div>

              {/* 垂直方向の動き */}
              <div className="relative w-full h-24 bg-gray-100 rounded border overflow-hidden">
                <div className="absolute bottom-2 left-1/2 h-1 w-12 bg-gray-400 transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 text-xs text-gray-500 transform -translate-x-1/2">
                  開始
                </div>
                
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full transition-all duration-75 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    bottom: `${Math.max(8, Math.min(92, ((springValue - parameters.from) / (parameters.to - parameters.from)) * 84 + 8))}%`
                  }}
                >
                  ●
                </div>

                <div className="absolute top-2 left-1/2 h-1 w-12 bg-red-400 transform -translate-x-1/2"></div>
                <div className="absolute top-0 left-1/2 text-xs text-gray-500 transform -translate-x-1/2">
                  目標
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>From → To:</span>
                  <span>{parameters.from} → {parameters.to}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>進行率:</span>
                  <span>{(((springValue - parameters.from) / (parameters.to - parameters.from)) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Damping:</span>
                  <span>{parameters.config.damping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Stiffness:</span>
                  <span>{parameters.config.stiffness}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mass:</span>
                  <span>{parameters.config.mass}</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}