'use client'

import { useState, useEffect } from 'react'
import { noise2D } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function Noise2DPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    seed: 'remotion',
    x: 0,
    y: 0,
    scale: 100,
    totalFrames: 120,
    animateX: true,
    animateY: true,
    timeScale: 0.1
  })

  const getNoiseValue = (x: number, y: number) => {
    return noise2D(parameters.seed, x, y)
  }

  // アニメーション用の座標計算
  const animatedX = parameters.animateX 
    ? parameters.x + currentFrame * parameters.timeScale 
    : parameters.x
  const animatedY = parameters.animateY 
    ? parameters.y + currentFrame * parameters.timeScale 
    : parameters.y

  const currentNoiseValue = getNoiseValue(animatedX / parameters.scale, animatedY / parameters.scale)

  const generateCode = () => {
    return `import { noise2D } from 'remotion'

const noiseValue = noise2D(
  '${parameters.seed}', // seed
  ${(animatedX / parameters.scale).toFixed(3)}, // x coordinate
  ${(animatedY / parameters.scale).toFixed(3)}  // y coordinate
)

// 現在の値: ${currentNoiseValue.toFixed(4)}
// 範囲: -1 to 1

// Usage example:
const opacity = (noiseValue + 1) / 2 // 0-1 range
const position = noiseValue * 100    // -100 to 100`
  }

  // ノイズビジュアライゼーション用のグリッド生成
  const generateNoiseGrid = () => {
    const gridSize = 20
    const grid = []
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (animatedX + i * 10) / parameters.scale
        const y = (animatedY + j * 10) / parameters.scale
        const value = getNoiseValue(x, y)
        grid.push({ x: i, y: j, value })
      }
    }
    return grid
  }

  const noiseGrid = generateNoiseGrid()

  return (
    <PageLayout
      title="noise2D"
      description="2Dパーリンノイズを生成し、自然なランダム値でアニメーションを作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Seed
              </label>
              <input
                type="text"
                value={parameters.seed}
                onChange={(e) =>
                  setParameters(prev => ({ ...prev, seed: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seed value"
              />
            </div>

            <Slider
              label="X Coordinate"
              value={parameters.x}
              min={-500}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, x: value }))
              }
            />

            <Slider
              label="Y Coordinate"
              value={parameters.y}
              min={-500}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, y: value }))
              }
            />

            <Slider
              label="Scale"
              value={parameters.scale}
              min={10}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, scale: value }))
              }
            />

            <Slider
              label="Time Scale"
              value={parameters.timeScale}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, timeScale: value }))
              }
            />

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.animateX}
                  onChange={(e) =>
                    setParameters(prev => ({ ...prev, animateX: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Animate X</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.animateY}
                  onChange={(e) =>
                    setParameters(prev => ({ ...prev, animateY: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Animate Y</span>
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
                <p className="text-sm font-semibold">Noise Value: {currentNoiseValue.toFixed(4)}</p>
                <p className="text-sm text-gray-600">座標: ({animatedX.toFixed(1)}, {animatedY.toFixed(1)})</p>
              </div>
              
              {/* ノイズグリッド表示 */}
              <div className="mb-2">
                <div className="grid grid-cols-20 gap-0 w-60 h-60 mx-auto border">
                  {noiseGrid.map((cell, index) => (
                    <div
                      key={index}
                      className="w-4 h-4"
                      style={{
                        backgroundColor: `rgba(${cell.value > 0 ? '59, 130, 246' : '239, 68, 68'}, ${Math.abs(cell.value)})`
                      }}
                      title={`(${cell.x}, ${cell.y}): ${cell.value.toFixed(3)}`}
                    />
                  ))}
                </div>
              </div>

              {/* 現在値のビジュアル表示 */}
              <div className="mb-2">
                <div className="w-full h-8 bg-gray-200 rounded border relative">
                  <div
                    className="absolute top-0 h-full bg-blue-500 rounded transition-all duration-100"
                    style={{ 
                      width: `${Math.abs(currentNoiseValue) * 100}%`,
                      backgroundColor: currentNoiseValue >= 0 ? '#3b82f6' : '#ef4444'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {currentNoiseValue.toFixed(4)}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-1.0</span>
                  <span>0</span>
                  <span>1.0</span>
                </div>
              </div>

              {/* 動く円（ノイズ値で制御） */}
              <div className="relative w-full h-24 bg-gray-100 rounded border mb-2">
                <div
                  className="absolute w-6 h-6 bg-blue-500 rounded-full transition-all duration-100"
                  style={{
                    left: `${50 + currentNoiseValue * 40}%`,
                    top: `${50 + getNoiseValue((animatedY + 100) / parameters.scale, (animatedX + 100) / parameters.scale) * 40}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Seed:</span>
                  <span className="font-mono">{parameters.seed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scale:</span>
                  <span>{parameters.scale}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual X:</span>
                  <span>{(animatedX / parameters.scale).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual Y:</span>
                  <span>{(animatedY / parameters.scale).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Range:</span>
                  <span>-1.0 to 1.0</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}