'use client'

import { useState, useEffect } from 'react'
import { interpolateColors } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function InterpolateColorsPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    progress: 0.5,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    totalFrames: 60,
    colorSpace: 'rgb' as 'rgb' | 'hsl'
  })

  const progress = currentFrame / (parameters.totalFrames - 1)
  const interpolatedColor = interpolateColors(
    progress,
    [0, 0.5, 1],
    parameters.colors,
    { colorSpace: parameters.colorSpace }
  )

  const generateCode = () => {
    return `import { interpolateColors } from 'remotion'

const progress = ${progress.toFixed(3)}

const interpolatedColor = interpolateColors(
  progress,
  [0, 0.5, 1], // input range
  [${parameters.colors.map(c => `'${c}'`).join(', ')}], // color range
  { colorSpace: '${parameters.colorSpace}' }
)

// 現在の色: ${interpolatedColor}`
  }

  return (
    <PageLayout
      title="interpolateColors"
      description="複数の色の間を滑らかに補間し、グラデーションアニメーションを作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color Space
              </label>
              <select
                value={parameters.colorSpace}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    colorSpace: e.target.value as 'rgb' | 'hsl'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rgb">RGB</option>
                <option value="hsl">HSL</option>
              </select>
            </div>

            {parameters.colors.map((color, index) => (
              <div key={index} className="mb-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Color {index + 1}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...parameters.colors]
                      newColors[index] = e.target.value
                      setParameters(prev => ({ ...prev, colors: newColors }))
                    }}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...parameters.colors]
                      newColors[index] = e.target.value
                      setParameters(prev => ({ ...prev, colors: newColors }))
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}

            <div className="flex space-x-2">
              <button
                onClick={() => setParameters(prev => ({ 
                  ...prev, 
                  colors: [...prev.colors, '#ffffff'] 
                }))}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                disabled={parameters.colors.length >= 10}
              >
                色を追加
              </button>
              <button
                onClick={() => setParameters(prev => ({ 
                  ...prev, 
                  colors: prev.colors.slice(0, -1) 
                }))}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                disabled={parameters.colors.length <= 2}
              >
                色を削除
              </button>
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
                <p className="text-sm font-semibold">現在の色: {interpolatedColor}</p>
                <p className="text-sm text-gray-600">進行: {(progress * 100).toFixed(1)}%</p>
              </div>
              
              {/* 大きな色表示 */}
              <div className="w-full h-24 rounded-lg border-2 border-gray-300 mb-2" 
                   style={{ backgroundColor: interpolatedColor }}>
              </div>

              {/* カラーパレット表示 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">カラーパレット</p>
                <div className="flex space-x-1 h-8 rounded overflow-hidden border">
                  {parameters.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* グラデーション表示 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">補間グラデーション</p>
                <div 
                  className="w-full h-8 rounded border"
                  style={{
                    background: `linear-gradient(to right, ${parameters.colors.join(', ')})`
                  }}
                >
                  <div 
                    className="w-2 h-full bg-black rounded-full transform -translate-x-1/2"
                    style={{ marginLeft: `${progress * 100}%` }}
                  />
                </div>
              </div>

              {/* RGB/HSL値表示 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>現在の色:</span>
                  <span className="font-mono">{interpolatedColor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Space:</span>
                  <span>{parameters.colorSpace.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>色数:</span>
                  <span>{parameters.colors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>フレーム:</span>
                  <span>{currentFrame} / {parameters.totalFrames - 1}</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}