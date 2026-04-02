// components/Sidebar.tsx
import Link from './Link'

export default function Sidebar({ categories }) {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-24 rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-primary-500 font-bold uppercase tracking-wider mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          Chuyên mục
        </h3>
        <nav className="flex flex-col gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
            >
              <span className="group-hover:translate-x-1 transition-transform">
                {cat.name}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-500 font-bold shadow-inner">
                {cat.count || 0}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}