// app/page.tsx
import { getBloggerData, getSidebarData, getCategoryConfig } from 'lib/blogger'
import Sidebar from '@/components/Sidebar'
import SectionContainer from '@/components/SectionContainer'
import Link from '@/components/Link'
import Image from '@/components/Image'
import PostCard from '@/components/PostCard'

export default async function HomePage() {
  // Húp dữ liệu song song từ "người khổng lồ"
  const [allPosts, sidebarCategories, config] = await Promise.all([
    getBloggerData(),
    getSidebarData(),
    getCategoryConfig(),
  ])

  const displayPosts = allPosts.slice(0, 6)

  return (
    <SectionContainer>
      <div className="flex flex-col gap-10 py-10 md:flex-row">
        {/* SIDEBAR DÙNG CHUNG */}
        <Sidebar categories={sidebarCategories} />

        <main className="min-w-0 flex-1">
          <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-gray-900 uppercase dark:text-gray-100">
            Mới cập nhật
          </h1>
          <div className="space-y-12">
            {allPosts.slice(0, 6).map((post) => (
              <PostCard key={post.postSlug} post={post} config={config} />
            ))}
          </div>
        </main>
      </div>
    </SectionContainer>
  )
}
