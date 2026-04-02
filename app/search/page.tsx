// app/search/page.tsx
import { searchBloggerPosts, getSidebarData, getCategoryConfig } from 'lib/blogger'
import SearchContent from '@/components/SearchContent'
import Sidebar from '@/components/Sidebar'
import SectionContainer from '@/components/SectionContainer'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ''

  // Húp đồng thời 3 thứ: Kết quả search, Dữ liệu Sidebar, và Từ điển Label
  const [searchResults, sidebarCategories, config] = await Promise.all([
    query ? searchBloggerPosts(query) : [],
    getSidebarData(),
    getCategoryConfig(),
  ])

  return (
    <SectionContainer>
      <div className="flex flex-col gap-10 py-10 md:flex-row">
        {/* SIDEBAR DÙNG CHUNG - Luôn hiện số lượng chuẩn bài */}
        <Sidebar categories={sidebarCategories} />

        <main className="min-w-0 flex-1">
          {/* Truyền thêm config xuống để SearchContent biết đường mà hiện Tiếng Việt trên Label absolute */}
          <SearchContent initialPosts={searchResults} query={query} config={config} />
        </main>
      </div>
    </SectionContainer>
  )
}
