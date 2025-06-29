'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function IrisPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 10,
    endFrame: 50,
    totalFrames: 60,
    centerX: 150,
    centerY: 100,
    startRadius: 0,
    endRadius: 250,
    shape: 'circle' as 'circle' | 'ellipse',
    ellipseRatioX: 1,
    ellipseRatioY: 0.7
  })

  const getCurrentRadius = () => {
    return interpolate(
      currentFrame,
      [parameters.startFrame, parameters.endFrame],
      [parameters.startRadius, parameters.endRadius],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }

  const currentRadius = getCurrentRadius()
  const progress = interpolate(
    currentFrame,
    [parameters.startFrame, parameters.endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const generateClipPath = () => {
    if (parameters.shape === 'circle') {
      return `circle(${currentRadius}px at ${parameters.centerX}px ${parameters.centerY}px)`
    } else {
      const radiusX = currentRadius * parameters.ellipseRatioX
      const radiusY = currentRadius * parameters.ellipseRatioY
      return `ellipse(${radiusX}px ${radiusY}px at ${parameters.centerX}px ${parameters.centerY}px)`
    }
  }

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

const radius = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.endFrame}],
  [${parameters.startRadius}, ${parameters.endRadius}],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// Iris ${parameters.shape} effect
const clipPath = '${parameters.shape}(${
  parameters.shape === 'circle' 
    ? `$\{radius}px at ${parameters.centerX}px ${parameters.centerY}px`
    : `$\{radius * ${parameters.ellipseRatioX}}px $\{radius * ${parameters.ellipseRatioY}}px at ${parameters.centerX}px ${parameters.centerY}px`
})'

// Usage in JSX:
<div style={{ 
  clipPath: '${generateClipPath()}'
}}>
  Your content
</div>

// Current radius: ${currentRadius.toFixed(1)}px`
  }

  return (
    <PageLayout
      title="iris"
      description="アイリス（虹彩）効果で円形または楕円形にワイプします"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Shape
              </label>
              <select
                value={parameters.shape}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    shape: e.target.value as 'circle' | 'ellipse'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
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

            <Slider
              label="Start Radius"
              value={parameters.startRadius}
              min={0}
              max={100}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  startRadius: value
                }))
              }
              unit="px"
            />

            <Slider
              label="End Radius"
              value={parameters.endRadius}
              min={50}
              max={400}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  endRadius: value
                }))
              }
              unit="px"
            />

            {parameters.shape === 'ellipse' && (
              <>
                <Slider
                  label="Ellipse Ratio X"
                  value={parameters.ellipseRatioX}
                  min={0.3}
                  max={2}
                  step={0.1}
                  onChange={(value) => 
                    setParameters(prev => ({
                      ...prev,
                      ellipseRatioX: value
                    }))
                  }
                />

                <Slider
                  label="Ellipse Ratio Y"
                  value={parameters.ellipseRatioY}
                  min={0.3}
                  max={2}
                  step={0.1}
                  onChange={(value) => 
                    setParameters(prev => ({
                      ...prev,
                      ellipseRatioY: value
                    }))
                  }
                />
              </>
            )}
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
                <p className="text-sm font-semibold">Radius: {currentRadius.toFixed(1)}px</p>
                <p className="text-sm text-gray-600">Progress: {(progress * 100).toFixed(1)}%</p>
              </div>
              
              {/* アイリスエフェクト表示 */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-60 h-48">
                  {/* 背景要素 */}
                  <div className="absolute inset-0 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                    BACKGROUND
                  </div>
                  
                  {/* アイリスでクリップされる要素 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base"
                    style={{
                      clipPath: generateClipPath()
                    }}
                  >
                    IRIS
                  </div>

                  {/* 中心点 */}
                  <div
                    className="absolute w-2 h-2 bg-red-500 rounded-full z-10"
                    style={{
                      left: parameters.centerX - 4,
                      top: parameters.centerY - 4
                    }}
                  />

                  {/* 半径ガイドライン */}
                  <div
                    className="absolute border border-red-400 border-dashed pointer-events-none"
                    style={{
                      left: parameters.centerX - currentRadius,
                      top: parameters.centerY - (parameters.shape === 'ellipse' ? currentRadius * parameters.ellipseRatioY : currentRadius),
                      width: currentRadius * 2,
                      height: parameters.shape === 'ellipse' 
                        ? currentRadius * parameters.ellipseRatioY * 2 
                        : currentRadius * 2,
                      borderRadius: parameters.shape === 'circle' ? '50%' : `${currentRadius}px / ${parameters.shape === 'ellipse' ? currentRadius * parameters.ellipseRatioY : currentRadius}px`
                    }}
                  />
                </div>
              </div>

              {/* 形状情報 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Shape Information</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <div className="font-medium">Shape</div>
                    <div className="capitalize">{parameters.shape}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-100 rounded">
                    <div className="font-medium">Center</div>
                    <div>({parameters.centerX}, {parameters.centerY})</div>
                  </div>
                </div>
                {parameters.shape === 'ellipse' && (
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium">X Radius</div>
                      <div>{(currentRadius * parameters.ellipseRatioX).toFixed(1)}px</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium">Y Radius</div>
                      <div>{(currentRadius * parameters.ellipseRatioY).toFixed(1)}px</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 半径プログレスバー */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Radius Progress</p>
                <div className="w-full h-6 bg-gray-200 rounded border relative">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded transition-all duration-100"
                    style={{ width: `${((currentRadius - parameters.startRadius) / (parameters.endRadius - parameters.startRadius)) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {currentRadius.toFixed(0)}px / {parameters.endRadius}px
                  </div>
                </div>
              </div>

              {/* タイムライン */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Animation Timeline</p>
                <div className="relative w-full h-6 bg-gray-200 rounded border">
                  <div
                    className="absolute top-0 h-full bg-indigo-300 rounded"
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
                  <span>Shape:</span>
                  <span className="capitalize">{parameters.shape}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Radius:</span>
                  <span>{currentRadius.toFixed(1)}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Radius Range:</span>
                  <span>{parameters.startRadius} - {parameters.endRadius}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Center:</span>
                  <span>({parameters.centerX}, {parameters.centerY})</span>
                </div>
                {parameters.shape === 'ellipse' && (
                  <>
                    <div className="flex justify-between">
                      <span>X Ratio:</span>
                      <span>{parameters.ellipseRatioX}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Y Ratio:</span>
                      <span>{parameters.ellipseRatioY}</span>
                    </div>
                  </>
                )}
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