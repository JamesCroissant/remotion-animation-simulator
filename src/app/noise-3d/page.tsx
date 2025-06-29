'use client'

import { useState, useEffect } from 'react'
import { noise3D } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function Noise3DPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    seed: 'remotion3d',
    x: 0,
    y: 0,
    z: 0,
    scale: 100,
    totalFrames: 120,
    animateX: true,
    animateY: true,
    animateZ: true,
    timeScale: 0.05
  })

  const getNoiseValue = (x: number, y: number, z: number) => {
    return noise3D(parameters.seed, x, y, z)
  }

  // アニメーション用の座標計算
  const animatedX = parameters.animateX 
    ? parameters.x + currentFrame * parameters.timeScale 
    : parameters.x
  const animatedY = parameters.animateY 
    ? parameters.y + currentFrame * parameters.timeScale 
    : parameters.y
  const animatedZ = parameters.animateZ 
    ? parameters.z + currentFrame * parameters.timeScale 
    : parameters.z

  const currentNoiseValue = getNoiseValue(
    animatedX / parameters.scale, 
    animatedY / parameters.scale, 
    animatedZ / parameters.scale
  )

  const generateCode = () => {
    return `import { noise3D } from 'remotion'

const noiseValue = noise3D(
  '${parameters.seed}', // seed
  ${(animatedX / parameters.scale).toFixed(3)}, // x coordinate
  ${(animatedY / parameters.scale).toFixed(3)}, // y coordinate
  ${(animatedZ / parameters.scale).toFixed(3)}  // z coordinate
)

// 現在の値: ${currentNoiseValue.toFixed(4)}
// 範囲: -1 to 1

// Usage examples:
const opacity = (noiseValue + 1) / 2     // 0-1 range
const position = noiseValue * 100        // -100 to 100
const rotation = noiseValue * 180        // -180 to 180 degrees
const scale = 0.5 + noiseValue * 0.5     // 0 to 1 scale`
  }

  // 3Dノイズの可視化用データ生成
  const generateNoise3DVisualization = () => {
    const layers = []
    const layerCount = 5
    const gridSize = 10
    
    for (let layer = 0; layer < layerCount; layer++) {
      const zOffset = (animatedZ + layer * 20) / parameters.scale
      const grid = []
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = (animatedX + i * 10) / parameters.scale
          const y = (animatedY + j * 10) / parameters.scale
          const value = getNoiseValue(x, y, zOffset)
          grid.push({ x: i, y: j, value, layer })
        }
      }
      layers.push(grid)
    }
    return layers
  }

  const noiseLayers = generateNoise3DVisualization()

  return (
    <PageLayout
      title="noise3D"
      description="3Dパーリンノイズを生成し、立体的なランダム値でアニメーションを作成します"
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
              label="Z Coordinate"
              value={parameters.z}
              min={-500}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, z: value }))
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
              max={0.5}
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

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.animateZ}
                  onChange={(e) =>
                    setParameters(prev => ({ ...prev, animateZ: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Animate Z</span>
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
                <p className="text-sm text-gray-600">
                  3D座標: ({animatedX.toFixed(1)}, {animatedY.toFixed(1)}, {animatedZ.toFixed(1)})
                </p>
              </div>
              
              {/* 3Dノイズ層の表示 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">3D Noise Layers (Z-depth visualization)</p>
                <div className="grid grid-cols-5 gap-2">
                  {noiseLayers.map((layer, layerIndex) => (
                    <div key={layerIndex} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Z+{layerIndex * 20}</div>
                      <div className="grid grid-cols-10 gap-0 border border-gray-300">
                        {layer.map((cell, cellIndex) => (
                          <div
                            key={cellIndex}
                            className="w-3 h-3"
                            style={{
                              backgroundColor: `rgba(${cell.value > 0 ? '59, 130, 246' : '239, 68, 68'}, ${Math.abs(cell.value) * 0.8 + 0.2})`
                            }}
                            title={`Layer ${layerIndex}: (${cell.x}, ${cell.y}): ${cell.value.toFixed(3)}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 現在値のビジュアル表示 */}
              <div className="mb-2">
                <div className="w-full h-8 bg-gray-200 rounded border relative">
                  <div
                    className="absolute top-0 h-full rounded transition-all duration-100"
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

              {/* 3次元での動く要素たち */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">3D Noise Applications</p>
                <div className="grid grid-cols-3 gap-4">
                  {/* 位置制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Position</div>
                    <div className="relative w-16 h-16 bg-gray-100 border rounded mx-auto">
                      <div
                        className="absolute w-3 h-3 bg-blue-500 rounded-full transition-all duration-100"
                        style={{
                          left: `${50 + currentNoiseValue * 30}%`,
                          top: `${50 + getNoiseValue((animatedY + 50) / parameters.scale, (animatedZ + 50) / parameters.scale, (animatedX + 50) / parameters.scale) * 30}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 回転制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Rotation</div>
                    <div className="w-16 h-16 mx-auto flex items-center justify-center">
                      <div
                        className="w-8 h-8 bg-green-500 transition-all duration-100"
                        style={{
                          transform: `rotate(${currentNoiseValue * 180}deg)`
                        }}
                      />
                    </div>
                  </div>

                  {/* スケール制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Scale</div>
                    <div className="w-16 h-16 mx-auto flex items-center justify-center">
                      <div
                        className="bg-purple-500 rounded-full transition-all duration-100"
                        style={{
                          width: `${(0.5 + Math.abs(currentNoiseValue) * 0.5) * 32}px`,
                          height: `${(0.5 + Math.abs(currentNoiseValue) * 0.5) * 32}px`
                        }}
                      />
                    </div>
                  </div>
                </div>
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
                  <span>Actual Z:</span>
                  <span>{(animatedZ / parameters.scale).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Animation:</span>
                  <span>
                    {[parameters.animateX && 'X', parameters.animateY && 'Y', parameters.animateZ && 'Z']
                      .filter(Boolean)
                      .join(', ') || 'None'}
                  </span>
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