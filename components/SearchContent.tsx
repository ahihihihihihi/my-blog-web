// components/SearchContent.tsx
'use client'

import { useState } from 'react'
import PostCard from '@/components/PostCard'

export default function SearchContent({ initialPosts, query, config }: any) {
  const [searchValue, setSearchValue] = useState('')
  const [displayCount, setDisplayCount] = useState(6)

  // 1. Lọc bài viết
  const filteredPosts = initialPosts.filter((post: any) => {
    const searchContent = (post.title + post.description).toLowerCase()
    return searchContent.includes(searchValue.toLowerCase())
  })

  // 2. Tính toán các con số "biết nói"
  const totalResults = filteredPosts.length
  const remainingPosts = totalResults - displayCount

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-extrabold tracking-tight uppercase">
          Kết quả cho: <span className="text-primary-500">"{query}"</span>
        </h1>
        {/* HIỆN CHỈ SỐ: ĐANG HIỆN X/Y BÀI */}
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500 dark:bg-gray-800">
          Hiển thị {Math.min(displayCount, totalResults)} / {totalResults} bài viết
        </span>
      </div>

      <div className="relative mb-10">
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Lọc nhanh trong kết quả này..."
          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="space-y-12">
        {filteredPosts.slice(0, displayCount).map((post: any) => (
          <PostCard key={post.postSlug} post={post} config={config} />
        ))}
      </div>

      {/* NÚT XEM THÊM THÔNG MINH */}
      {displayCount < totalResults && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={() => setDisplayCount(displayCount + 6)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-0.5 font-bold"
          >
            <span className="from-primary-500 group-hover:from-primary-600 absolute h-full w-full bg-gradient-to-br to-orange-400 group-hover:to-orange-500"></span>
            <span className="group-hover:bg-opacity-0 relative rounded-full bg-white px-8 py-3 transition-all duration-75 ease-in dark:bg-gray-900">
              <span className="relative text-gray-900 group-hover:text-white dark:text-white">
                Xem thêm bài viết (Còn {remainingPosts} bài)
              </span>
            </span>
          </button>
          <p className="text-xs text-gray-400 italic">Nhấn để xem thêm nội dung...</p>
        </div>
      )}

      {totalResults === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <p className="font-medium text-gray-500">Hix, không tìm thấy bài nào khớp cả!</p>
        </div>
      )}
    </div>
  )
}
