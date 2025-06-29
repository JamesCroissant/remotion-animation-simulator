import Link from 'next/link'

interface PageLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-blue-600">
              ← Home
            </Link>
            <h1 className="text-lg font-medium text-gray-700">{title}</h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
          <p className="text-sm text-gray-600">{description}</p>
        </header>

        {children}
      </div>
    </div>
  )
}