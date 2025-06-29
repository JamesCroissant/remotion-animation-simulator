'use client'

import { useState, useEffect } from 'react'
import { interpolate } from 'remotion'
import { PageLayout } from '@/components/layout/PageLayout'
import { ParameterPanel } from '@/components/ui/ParameterPanel'
import { Slider } from '@/components/ui/Slider'
import { AnimationPreview } from '@/components/ui/AnimationPreview'
import { PlayControls } from '@/components/ui/PlayControls'

interface SequenceItem {
  id: string
  name: string
  from: number
  durationInFrames: number
  color: string
}

export default function SequencePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [parameters, setParameters] = useState({
    totalFrames: 120,
    sequences: [
      { id: '1', name: 'Intro', from: 0, durationInFrames: 30, color: '#3b82f6' },
      { id: '2', name: 'Main', from: 25, durationInFrames: 40, color: '#10b981' },
      { id: '3', name: 'Outro', from: 60, durationInFrames: 30, color: '#f59e0b' },
    ] as SequenceItem[]
  })

  const getActiveSequences = () => {
    return parameters.sequences.filter(seq => 
      currentFrame >= seq.from && currentFrame < seq.from + seq.durationInFrames
    )
  }

  const getSequenceProgress = (sequence: SequenceItem) => {
    if (currentFrame < sequence.from) return 0
    if (currentFrame >= sequence.from + sequence.durationInFrames) return 1
    return (currentFrame - sequence.from) / sequence.durationInFrames
  }

  const activeSequences = getActiveSequences()

  const addSequence = () => {
    const newId = (parameters.sequences.length + 1).toString()
    const newSequence: SequenceItem = {
      id: newId,
      name: `Sequence ${newId}`,
      from: Math.max(...parameters.sequences.map(s => s.from + s.durationInFrames), 0),
      durationInFrames: 30,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }
    setParameters(prev => ({
      ...prev,
      sequences: [...prev.sequences, newSequence]
    }))
  }

  const updateSequence = (id: string, updates: Partial<SequenceItem>) => {
    setParameters(prev => ({
      ...prev,
      sequences: prev.sequences.map(seq => 
        seq.id === id ? { ...seq, ...updates } : seq
      )
    }))
  }

  const removeSequence = (id: string) => {
    setParameters(prev => ({
      ...prev,
      sequences: prev.sequences.filter(seq => seq.id !== id)
    }))
  }

  const generateCode = () => {
    return `import { Sequence } from 'remotion'

// Current frame: ${currentFrame}
// Active sequences: ${activeSequences.map(s => s.name).join(', ') || 'None'}

export const MyComposition = () => {
  return (
    <>
${parameters.sequences.map(seq => `      <Sequence
        name="${seq.name}"
        from={${seq.from}}
        durationInFrames={${seq.durationInFrames}}
      >
        <YourComponent />
      </Sequence>`).join('\n')}
    </>
  )
}

// Sequence timing:
${parameters.sequences.map(seq => `// ${seq.name}: frames ${seq.from}-${seq.from + seq.durationInFrames - 1} (${seq.durationInFrames} frames)`).join('\n')}`
  }

  return (
    <PageLayout
      title="Sequence"
      description="複数のコンポーネントのタイミングを制御し、シーケンシャルなアニメーションを作成します"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <ParameterPanel title="シーケンス設定" codeOutput={generateCode()}>
            <Slider
              label="Total Frames"
              value={parameters.totalFrames}
              min={60}
              max={300}
              onChange={(value) => 
                setParameters(prev => ({ ...prev, totalFrames: value }))
              }
            />

            <div className="mb-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Sequences</h3>
                <button
                  onClick={addSequence}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Add Sequence
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {parameters.sequences.map((sequence) => (
                  <div key={sequence.id} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={sequence.name}
                        onChange={(e) => updateSequence(sequence.id, { name: e.target.value })}
                        className="font-medium text-sm bg-transparent border-none outline-none"
                      />
                      <button
                        onClick={() => removeSequence(sequence.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        disabled={parameters.sequences.length <= 1}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-gray-600 mb-1">From</label>
                        <input
                          type="number"
                          value={sequence.from}
                          onChange={(e) => updateSequence(sequence.id, { from: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          min={0}
                          max={parameters.totalFrames - 1}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Duration</label>
                        <input
                          type="number"
                          value={sequence.durationInFrames}
                          onChange={(e) => updateSequence(sequence.id, { durationInFrames: parseInt(e.target.value) || 1 })}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          min={1}
                          max={parameters.totalFrames}
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-gray-600 mb-1 text-xs">Color</label>
                      <input
                        type="color"
                        value={sequence.color}
                        onChange={(e) => updateSequence(sequence.id, { color: e.target.value })}
                        className="w-full h-6 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Ends at frame: {sequence.from + sequence.durationInFrames - 1}
                      {currentFrame >= sequence.from && currentFrame < sequence.from + sequence.durationInFrames && (
                        <span className="ml-2 text-green-600 font-medium">● ACTIVE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                <p className="text-sm font-semibold">Frame: {currentFrame}</p>
                <p className="text-sm text-gray-600">
                  Active: {activeSequences.length > 0 ? activeSequences.map(s => s.name).join(', ') : 'None'}
                </p>
              </div>
              
              {/* タイムライン表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Timeline Visualization</p>
                <div className="relative">
                  {/* 背景タイムライン */}
                  <div className="w-full h-8 bg-gray-200 rounded border relative">
                    {/* シーケンス表示 */}
                    {parameters.sequences.map((sequence) => (
                      <div
                        key={sequence.id}
                        className="absolute top-0 h-full rounded transition-all duration-200"
                        style={{
                          left: `${(sequence.from / parameters.totalFrames) * 100}%`,
                          width: `${(sequence.durationInFrames / parameters.totalFrames) * 100}%`,
                          backgroundColor: sequence.color,
                          opacity: currentFrame >= sequence.from && currentFrame < sequence.from + sequence.durationInFrames ? 0.8 : 0.4
                        }}
                        title={`${sequence.name}: ${sequence.from}-${sequence.from + sequence.durationInFrames - 1}`}
                      />
                    ))}
                    
                    {/* 現在フレーム */}
                    <div
                      className="absolute top-0 w-1 h-full bg-black z-10"
                      style={{ left: `${(currentFrame / parameters.totalFrames) * 100}%` }}
                    />
                  </div>

                  {/* フレーム番号 */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{Math.floor(parameters.totalFrames / 2)}</span>
                    <span>{parameters.totalFrames}</span>
                  </div>
                </div>
              </div>

              {/* アクティブシーケンスの詳細表示 */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Active Sequences</p>
                {activeSequences.length > 0 ? (
                  <div className="space-y-3">
                    {activeSequences.map((sequence) => {
                      const progress = getSequenceProgress(sequence)
                      const localFrame = currentFrame - sequence.from
                      return (
                        <div key={sequence.id} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{sequence.name}</span>
                            <span className="text-xs text-gray-600">
                              Frame {localFrame} / {sequence.durationInFrames}
                            </span>
                          </div>
                          
                          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
                            <div
                              className="h-full transition-all duration-100"
                              style={{
                                width: `${progress * 100}%`,
                                backgroundColor: sequence.color
                              }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{(progress * 100).toFixed(1)}%</span>
                            <span>Frames {sequence.from}-{sequence.from + sequence.durationInFrames - 1}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active sequences at frame {currentFrame}
                  </div>
                )}
              </div>

              {/* 視覚的表現 */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Visual Representation</p>
                <div className="grid grid-cols-3 gap-4 h-24">
                  {parameters.sequences.map((sequence) => {
                    const isActive = currentFrame >= sequence.from && currentFrame < sequence.from + sequence.durationInFrames
                    const progress = getSequenceProgress(sequence)
                    
                    return (
                      <div key={sequence.id} className="relative">
                        <div
                          className="w-full h-full rounded-lg border-2 flex items-center justify-center text-white font-bold text-sm transition-all duration-200"
                          style={{
                            backgroundColor: sequence.color,
                            opacity: isActive ? 1 : 0.3,
                            transform: isActive ? `scale(${0.8 + progress * 0.2})` : 'scale(0.8)',
                            borderColor: isActive ? '#000' : 'transparent'
                          }}
                        >
                          <div className="text-center">
                            <div>{sequence.name}</div>
                            {isActive && (
                              <div className="text-xs mt-1">{(progress * 100).toFixed(0)}%</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Sequences:</span>
                  <span>{parameters.sequences.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Sequences:</span>
                  <span>{activeSequences.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Frame:</span>
                  <span>{currentFrame} / {parameters.totalFrames}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration:</span>
                  <span>{Math.max(...parameters.sequences.map(s => s.from + s.durationInFrames), parameters.totalFrames)} frames</span>
                </div>
              </div>
            </div>
          </AnimationPreview>
        </div>
      </div>
    </PageLayout>
  )
}