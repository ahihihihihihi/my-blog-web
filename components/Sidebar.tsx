// components/Sidebar.tsx
import Link from './Link'

export default function Sidebar({ categories }) {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="sticky top-24 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="text-primary-500 mb-6 border-b border-gray-200 pb-2 font-bold tracking-wider uppercase dark:border-gray-700">
          Chuyên mục
        </h3>
        <nav className="flex flex-col gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group hover:text-primary-500 flex items-center justify-between text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
            >
              <span className="transition-transform group-hover:translate-x-1">{cat.name}</span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 shadow-inner dark:bg-gray-700">
                {cat.count || 0}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
