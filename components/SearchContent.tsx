// components/SearchContent.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from '@/components/Link'
import Image from '@/components/Image'

export default function SearchContent({ initialPosts, query }) {
  const [inputValue, setInputValue] = useState(query || '')
  const [mounted, setMounted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6) // Mặc định hiện 6 bài đầu tiên
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setVisibleCount(6) // Reset lại số lượng hiển thị khi search từ khóa mới
    router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`)
  }

  if (!mounted) return null

  // Cắt mảng bài viết theo số lượng đang cho phép hiển thị
  const displayPosts = initialPosts.slice(0, visibleCount)

  return (
    <div className="space-y-10">
      {/* Thanh Search Lớn */}
      <div className="relative">
        <form onSubmit={onSearch} className="max-w-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tìm kiếm bài viết trên blog..."
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg focus:border-primary-500 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm"
            />
            <button type="submit" className="absolute right-3 rounded-lg bg-primary-500 px-6 py-2 font-bold text-white hover:bg-primary-600 transition-colors">
              TÌM
            </button>
          </div>
        </form>
        {query && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            Kết quả cho: <span className="text-primary-500 font-bold">"{query}"</span> — Tìm thấy {initialPosts.length} bài
          </p>
        )}
      </div>

      {/* Danh sách kết quả */}
      <div className="space-y-12">
        {displayPosts.map((post) => (
          <article key={post.postSlug} className="group flex flex-col sm:flex-row gap-6 items-start animate-fadeIn">
            <div className="relative w-full sm:w-64 shrink-0 aspect-[16/10] overflow-hidden rounded-xl border dark:border-gray-800 shadow-sm">
              <Link href={`/blog/${post.postSlug}`}>
                <Image src={post.imgSrc} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            </div>

            <div className="flex-1 py-1">
              <div className="text-xs text-gray-400 mb-2 font-medium">
                📅 {new Date(post.updated).toLocaleDateString('vi-VN')}
              </div>
              <Link href={`/blog/${post.postSlug}`}>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors leading-tight mb-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-4 break-words">
                {post.description}
              </p>
              <Link href={`/blog/${post.postSlug}`} className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline">
                Đọc tiếp &rarr;
              </Link>
            </div>
          </article>
        ))}

        {/* NÚT XEM THÊM - Chỉ hiện khi còn bài chưa load */}
        {visibleCount < initialPosts.length && (
          <div className="mt-16 text-center border-t pt-10 dark:border-gray-800">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-10 py-3 text-sm font-bold text-white hover:bg-primary-500 transition-all dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-primary-500 dark:hover:text-white shadow-xl"
            >
              Xem thêm bài viết ({initialPosts.length - visibleCount} bài còn lại)
            </button>
          </div>
        )}

        {initialPosts.length === 0 && query && (
          <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-lg">Hệ thống không tìm thấy bài nào khớp với từ khóa của bạn.</p>
            <p className="text-sm text-gray-400 mt-2">Thử tìm với từ khóa khác xem sao bạn hiền!</p>
          </div>
        )}
      </div>
    </div>
  )
}