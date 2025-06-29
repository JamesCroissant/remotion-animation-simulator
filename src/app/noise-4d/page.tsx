'use client'

import { useState, useEffect } from 'react'
import { noise4D } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function Noise4DPage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    seed: 'remotion4d',
    x: 0,
    y: 0,
    z: 0,
    w: 0,
    scale: 100,
    totalFrames: 120,
    animateX: true,
    animateY: true,
    animateZ: true,
    animateW: true,
    timeScale: 0.03
  })

  const getNoiseValue = (x: number, y: number, z: number, w: number) => {
    return noise4D(parameters.seed, x, y, z, w)
  }

  // アニメーション用の座標計算
  const animatedX = parameters.animateX 
    ? parameters.x + currentFrame * parameters.timeScale 
    : parameters.x
  const animatedY = parameters.animateY 
    ? parameters.y + currentFrame * parameters.timeScale * 0.7 
    : parameters.y
  const animatedZ = parameters.animateZ 
    ? parameters.z + currentFrame * parameters.timeScale * 1.3 
    : parameters.z
  const animatedW = parameters.animateW 
    ? parameters.w + currentFrame * parameters.timeScale * 0.5 
    : parameters.w

  const currentNoiseValue = getNoiseValue(
    animatedX / parameters.scale, 
    animatedY / parameters.scale, 
    animatedZ / parameters.scale,
    animatedW / parameters.scale
  )

  const generateCode = () => {
    return `import { noise4D } from 'remotion'

const noiseValue = noise4D(
  '${parameters.seed}', // seed
  ${(animatedX / parameters.scale).toFixed(3)}, // x coordinate
  ${(animatedY / parameters.scale).toFixed(3)}, // y coordinate
  ${(animatedZ / parameters.scale).toFixed(3)}, // z coordinate
  ${(animatedW / parameters.scale).toFixed(3)}  // w coordinate (4th dimension)
)

// 現在の値: ${currentNoiseValue.toFixed(4)}
// 範囲: -1 to 1

// 4D noise is ideal for:
// - Complex particle systems
// - Temporal noise patterns
// - Multi-dimensional animations
// - Advanced procedural generation

// Usage examples:
const opacity = (noiseValue + 1) / 2        // 0-1 range
const color = noiseValue * 127 + 128        // 0-255 color range
const displacement = noiseValue * 50        // -50 to 50 displacement`
  }

  // 4Dノイズの可視化 - 複数のスライスを表示
  const generateNoise4DVisualization = () => {
    const slices = []
    const sliceCount = 4
    const gridSize = 8
    
    for (let slice = 0; slice < sliceCount; slice++) {
      const wOffset = (animatedW + slice * 30) / parameters.scale
      const grid = []
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = (animatedX + i * 15) / parameters.scale
          const y = (animatedY + j * 15) / parameters.scale
          const z = animatedZ / parameters.scale
          const value = getNoiseValue(x, y, z, wOffset)
          grid.push({ x: i, y: j, value, slice })
        }
      }
      slices.push(grid)
    }
    return slices
  }

  const noiseSlices = generateNoise4DVisualization()

  // 複数のノイズ応用例
  const getMultipleNoiseApplications = () => {
    const baseScale = parameters.scale
    return {
      position: getNoiseValue(
        animatedX / baseScale, 
        animatedY / baseScale, 
        animatedZ / baseScale, 
        animatedW / baseScale
      ),
      rotation: getNoiseValue(
        (animatedX + 100) / baseScale, 
        (animatedY + 100) / baseScale, 
        (animatedZ + 100) / baseScale, 
        (animatedW + 100) / baseScale
      ),
      scale: getNoiseValue(
        (animatedX + 200) / baseScale, 
        (animatedY + 200) / baseScale, 
        (animatedZ + 200) / baseScale, 
        (animatedW + 200) / baseScale
      ),
      color: getNoiseValue(
        (animatedX + 300) / baseScale, 
        (animatedY + 300) / baseScale, 
        (animatedZ + 300) / baseScale, 
        (animatedW + 300) / baseScale
      ),
      opacity: getNoiseValue(
        (animatedX + 400) / baseScale, 
        (animatedY + 400) / baseScale, 
        (animatedZ + 400) / baseScale, 
        (animatedW + 400) / baseScale
      )
    }
  }

  const applications = getMultipleNoiseApplications()

  return (
    <PageLayout
      title="noise4D"
      description="4Dパーリンノイズを生成し、時間軸を含む4次元のランダム値でアニメーションを作成します"
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
              label="W Coordinate (4th dimension)"
              value={parameters.w}
              min={-500}
              max={500}
              step={1}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, w: value }))
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
              max={0.2}
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

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={parameters.animateW}
                  onChange={(e) =>
                    setParameters(prev => ({ ...prev, animateW: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Animate W (4th dimension)</span>
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
                <p className="text-sm font-semibold">4D Noise: {currentNoiseValue.toFixed(4)}</p>
                <p className="text-sm text-gray-600">
                  4D座標: ({animatedX.toFixed(1)}, {animatedY.toFixed(1)}, {animatedZ.toFixed(1)}, {animatedW.toFixed(1)})
                </p>
              </div>
              
              {/* 4Dノイズのスライス表示 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">4D Noise Slices (W-dimension)</p>
                <div className="grid grid-cols-4 gap-2">
                  {noiseSlices.map((slice, sliceIndex) => (
                    <div key={sliceIndex} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">W+{sliceIndex * 30}</div>
                      <div className="grid grid-cols-8 gap-0 border border-gray-300">
                        {slice.map((cell, cellIndex) => (
                          <div
                            key={cellIndex}
                            className="w-2.5 h-2.5"
                            style={{
                              backgroundColor: `rgba(${cell.value > 0 ? '59, 130, 246' : '239, 68, 68'}, ${Math.abs(cell.value) * 0.8 + 0.2})`
                            }}
                            title={`Slice ${sliceIndex}: (${cell.x}, ${cell.y}): ${cell.value.toFixed(3)}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 現在値のビジュアル表示 */}
              <div className="mb-2">
                <div className="w-full h-6 bg-gray-200 rounded border relative">
                  <div
                    className="absolute top-0 h-full rounded transition-all duration-100"
                    style={{ 
                      width: `${Math.abs(currentNoiseValue) * 100}%`,
                      backgroundColor: currentNoiseValue >= 0 ? '#3b82f6' : '#ef4444'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {currentNoiseValue.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* 複数の4Dノイズ応用例 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">4D Noise Applications</p>
                <div className="grid grid-cols-5 gap-2">
                  {/* 位置制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Position</div>
                    <div className="relative w-12 h-12 bg-gray-100 border rounded mx-auto">
                      <div
                        className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full transition-all duration-100"
                        style={{
                          left: `${50 + applications.position * 30}%`,
                          top: `${50 + applications.position * 30}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 回転制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Rotation</div>
                    <div className="w-12 h-12 mx-auto flex items-center justify-center">
                      <div
                        className="w-6 h-6 bg-green-500 transition-all duration-100"
                        style={{
                          transform: `rotate(${applications.rotation * 180}deg)`
                        }}
                      />
                    </div>
                  </div>

                  {/* スケール制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Scale</div>
                    <div className="w-12 h-12 mx-auto flex items-center justify-center">
                      <div
                        className="bg-purple-500 rounded-full transition-all duration-100"
                        style={{
                          width: `${(0.3 + Math.abs(applications.scale) * 0.7) * 24}px`,
                          height: `${(0.3 + Math.abs(applications.scale) * 0.7) * 24}px`
                        }}
                      />
                    </div>
                  </div>

                  {/* カラー制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Color</div>
                    <div className="w-12 h-12 mx-auto flex items-center justify-center">
                      <div
                        className="w-6 h-6 rounded transition-all duration-100"
                        style={{
                          backgroundColor: `hsl(${(applications.color + 1) * 180}, 70%, 50%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* 透明度制御 */}
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Opacity</div>
                    <div className="w-12 h-12 mx-auto flex items-center justify-center">
                      <div
                        className="w-6 h-6 bg-orange-500 rounded transition-all duration-100"
                        style={{
                          opacity: (applications.opacity + 1) / 2
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 応用例の数値表示 */}
                <div className="mt-2 grid grid-cols-5 gap-2 text-xs text-center text-gray-600">
                  <div>{applications.position.toFixed(3)}</div>
                  <div>{applications.rotation.toFixed(3)}</div>
                  <div>{applications.scale.toFixed(3)}</div>
                  <div>{applications.color.toFixed(3)}</div>
                  <div>{applications.opacity.toFixed(3)}</div>
                </div>
              </div>

              {/* 複合アニメーション例 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Complex 4D Animation</p>
                <div className="flex justify-center">
                  <div
                    className="w-16 h-16 rounded-lg transition-all duration-100 flex items-center justify-center text-white font-bold text-xs"
                    style={{
                      transform: `
                        translate(${applications.position * 30}px, ${applications.rotation * 20}px) 
                        rotate(${applications.color * 45}deg) 
                        scale(${0.8 + Math.abs(applications.scale) * 0.4})
                      `,
                      backgroundColor: `hsl(${(currentNoiseValue + 1) * 180}, 70%, 50%)`,
                      opacity: 0.3 + Math.abs(applications.opacity) * 0.7
                    }}
                  >
                    4D
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
                  <span>Actual W:</span>
                  <span>{(animatedW / parameters.scale).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Animation:</span>
                  <span>
                    {[parameters.animateX && 'X', parameters.animateY && 'Y', parameters.animateZ && 'Z', parameters.animateW && 'W']
                      .filter(Boolean)
                      .join(', ') || 'None'}
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