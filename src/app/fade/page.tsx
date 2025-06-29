'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

export default function FadePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    startFrame: 10,
    endFrame: 50,
    totalFrames: 60,
    fadeType: 'in' as 'in' | 'out' | 'inOut',
    duration: 30
  })

  const getFadeOpacity = () => {
    switch (parameters.fadeType) {
      case 'in':
        return interpolate(
          currentFrame,
          [parameters.startFrame, parameters.startFrame + parameters.duration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      case 'out':
        return interpolate(
          currentFrame,
          [parameters.endFrame - parameters.duration, parameters.endFrame],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      case 'inOut':
        if (currentFrame < parameters.startFrame + parameters.duration / 2) {
          return interpolate(
            currentFrame,
            [parameters.startFrame, parameters.startFrame + parameters.duration / 2],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )
        } else {
          return interpolate(
            currentFrame,
            [parameters.endFrame - parameters.duration / 2, parameters.endFrame],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )
        }
      default:
        return 1
    }
  }

  const opacity = getFadeOpacity()

  const generateCode = () => {
    return `import { interpolate } from 'remotion'

// Fade ${parameters.fadeType} transition
const opacity = interpolate(
  currentFrame, // ${currentFrame}
  [${parameters.startFrame}, ${parameters.startFrame + parameters.duration}],
  [${parameters.fadeType === 'out' ? '1, 0' : '0, 1'}],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
)

// Usage in JSX:
<div style={{ opacity: ${opacity.toFixed(3)} }}>
  Your content
</div>`
  }

  return (
    <PageLayout
      title="fade"
      description="要素のフェードイン・フェードアウト効果を作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="パラメータ設定" codeOutput={generateCode()}>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Fade Type
              </label>
              <select
                value={parameters.fadeType}
                onChange={(e) =>
                  setParameters(prev => ({
                    ...prev,
                    fadeType: e.target.value as 'in' | 'out' | 'inOut'
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in">Fade In</option>
                <option value="out">Fade Out</option>
                <option value="inOut">Fade In & Out</option>
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
              label="Duration (frames)"
              value={parameters.duration}
              min={5}
              max={40}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  duration: value
                }))
              }
            />

            <Slider
              label="Total Frames"
              value={parameters.totalFrames}
              min={30}
              max={120}
              onChange={(value) => 
                setParameters(prev => ({
                  ...prev,
                  totalFrames: value
                }))
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
                <p className="text-sm font-semibold">Opacity: {opacity.toFixed(3)}</p>
                <p className="text-sm text-gray-600">フレーム: {currentFrame}</p>
              </div>
              
              {/* メイン要素 */}
              <div className="flex items-center justify-center h-28">
                <div
                  className="w-32 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg"
                  style={{ opacity }}
                >
                  FADE
                </div>
              </div>

              {/* タイムライン表示 */}
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">タイムライン</p>
                <div className="relative w-full h-8 bg-gray-200 rounded border">
                  {/* フェード範囲 */}
                  {parameters.fadeType === 'in' && (
                    <div
                      className="absolute top-0 h-full bg-green-300 rounded"
                      style={{
                        left: `${(parameters.startFrame / parameters.totalFrames) * 100}%`,
                        width: `${(parameters.duration / parameters.totalFrames) * 100}%`
                      }}
                    />
                  )}
                  {parameters.fadeType === 'out' && (
                    <div
                      className="absolute top-0 h-full bg-red-300 rounded"
                      style={{
                        left: `${((parameters.endFrame - parameters.duration) / parameters.totalFrames) * 100}%`,
                        width: `${(parameters.duration / parameters.totalFrames) * 100}%`
                      }}
                    />
                  )}
                  {parameters.fadeType === 'inOut' && (
                    <>
                      <div
                        className="absolute top-0 h-full bg-green-300 rounded"
                        style={{
                          left: `${(parameters.startFrame / parameters.totalFrames) * 100}%`,
                          width: `${((parameters.duration / 2) / parameters.totalFrames) * 100}%`
                        }}
                      />
                      <div
                        className="absolute top-0 h-full bg-red-300 rounded"
                        style={{
                          left: `${((parameters.endFrame - parameters.duration / 2) / parameters.totalFrames) * 100}%`,
                          width: `${((parameters.duration / 2) / parameters.totalFrames) * 100}%`
                        }}
                      />
                    </>
                  )}
                  
                  {/* 現在フレーム */}
                  <div
                    className="absolute top-0 w-1 h-full bg-black"
                    style={{ left: `${(currentFrame / parameters.totalFrames) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{parameters.totalFrames}</span>
                </div>
              </div>

              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fade Type:</span>
                  <span className="capitalize">{parameters.fadeType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Frame:</span>
                  <span>{parameters.startFrame}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{parameters.duration} frames</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Opacity:</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}