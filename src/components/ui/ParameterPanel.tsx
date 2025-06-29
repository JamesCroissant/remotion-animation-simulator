'use client'

interface ParameterPanelProps {
  title: string
  children: React.ReactNode
  codeOutput?: string
}

export function ParameterPanel({ title, children, codeOutput }: ParameterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
        {title}
      </h2>
      
      <div className="space-y-3">
        {children}
      </div>

      {codeOutput && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">生成されたコード</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
            <code>{codeOutput}</code>
          </pre>
        </div>
      )}
    </div>
  )
}