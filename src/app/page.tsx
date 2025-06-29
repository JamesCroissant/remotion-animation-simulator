import Link from 'next/link'

export default function Home() {
  const animationCategories = [
    {
      name: '基本アニメーション',
      functions: [
        { name: 'interpolate', path: '/interpolate', description: '値の補間によるアニメーション' },
        { name: 'spring', path: '/spring', description: '物理ベースのバネアニメーション' },
        { name: 'interpolateColors', path: '/interpolate-colors', description: '色の補間アニメーション' },
      ]
    },
    {
      name: 'トランジション効果',
      functions: [
        { name: 'fade', path: '/fade', description: 'フェードイン/アウト効果' },
        { name: 'slide', path: '/slide', description: 'スライド遷移効果' },
        { name: 'wipe', path: '/wipe', description: 'ワイプ効果' },
        { name: 'flip', path: '/flip', description: '回転遷移効果' },
        { name: 'clockWipe', path: '/clock-wipe', description: '時計回りワイプ効果' },
        { name: 'iris', path: '/iris', description: 'アイリス効果' },
      ]
    },
    {
      name: 'ノイズ・エフェクト',
      functions: [
        { name: 'noise2D', path: '/noise-2d', description: '2Dパーリンノイズ' },
        { name: 'noise3D', path: '/noise-3d', description: '3Dパーリンノイズ' },
        { name: 'noise4D', path: '/noise-4d', description: '4Dパーリンノイズ' },
      ]
    },
    {
      name: 'イージング関数',
      functions: [
        { name: 'Easing', path: '/easing', description: 'カスタムイージングカーブ' },
      ]
    },
    {
      name: 'コンポーネント',
      functions: [
        { name: 'Sequence', path: '/sequence', description: 'タイミング制御' },
        { name: 'Loop', path: '/loop', description: 'ループアニメーション' },
        { name: 'Freeze', path: '/freeze', description: 'フレーム固定' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Remotion Animation Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remotionの全アニメーション関数を視覚的に理解し、パラメータを調整してリアルタイムで効果を確認できるツール
          </p>
        </header>

        <div className="grid gap-8">
          {animationCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.functions.map((func) => (
                  <Link
                    key={func.name}
                    href={func.path}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 mb-2">
                      {func.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {func.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            各関数をクリックして、パラメータを調整しながらアニメーションを体験してください
          </p>
        </footer>
      </div>
    </div>
  )
}
