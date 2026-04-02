'use client'

import { useState } from 'react'
import Card from './Card'

interface PostListProps {
  posts: any[]
  label: string
  categoryConfig: any[]
}

export default function PostList({ posts, label, categoryConfig }: PostListProps) {
  const [displayCount, setDisplayCount] = useState(6)

  const displayPosts = posts.slice(0, displayCount)
  const hasMore = displayCount < posts.length

  return (
    <div>
      <div className="-m-4 flex flex-wrap">
        {displayPosts.map((post) => {
          // Tìm nhãn đầu tiên hợp lệ để làm link
          const primaryLabel =
            post.allLabels.find((l: string) => categoryConfig?.some((c: any) => c.slug === l)) ||
            label

          return (
            <Card
              key={`${label}-${post.postSlug}`}
              title={post.title}
              description={post.description}
              imgSrc={post.imgSrc}
              href={`/${primaryLabel}/${post.postSlug}`}
              allLabels={post.allLabels}
              categoryConfig={categoryConfig}
              updated={post.updated}
            />
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setDisplayCount(displayCount + 6)}
            className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-2 font-bold text-white transition"
          >
            Xem thêm bài viết
          </button>
        </div>
      )}
    </div>
  )
}
