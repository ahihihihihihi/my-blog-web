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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">
          Kết quả cho: <span className="text-primary-500">"{query}"</span>
        </h1>
        {/* HIỆN CHỈ SỐ: ĐANG HIỆN X/Y BÀI */}
        <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          Hiển thị {Math.min(displayCount, totalResults)} / {totalResults} bài viết
        </span>
      </div>

      <div className="relative mb-10">
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Lọc nhanh trong kết quả này..."
          className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
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
            <span className="absolute h-full w-full bg-gradient-to-br from-primary-500 to-orange-400 group-hover:from-primary-600 group-hover:to-orange-500"></span>
            <span className="relative rounded-full bg-white dark:bg-gray-900 px-8 py-3 transition-all duration-75 ease-in group-hover:bg-opacity-0">
              <span className="relative text-gray-900 dark:text-white group-hover:text-white">
                Xem thêm bài viết (Còn {remainingPosts} bài)
              </span>
            </span>
          </button>
          <p className="text-xs text-gray-400 italic">Nhấn để xem thêm nội dung...</p>
        </div>
      )}

      {totalResults === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 font-medium">Hix, không tìm thấy bài nào khớp cả!</p>
        </div>
      )}
    </div>
  )
}