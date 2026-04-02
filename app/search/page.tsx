// app/search/page.tsx
import { searchBloggerPosts, getSidebarData } from 'lib/blogger'
import SearchContent from '@/components/SearchContent'
import Sidebar from '@/components/Sidebar'
import SectionContainer from '@/components/SectionContainer'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';

  // Húp song song: Kết quả search sâu từ GG và Dữ liệu đếm bài cho Sidebar
  const [searchResults, sidebarCategories] = await Promise.all([
    query ? searchBloggerPosts(query) : [],
    getSidebarData() 
  ]);

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row gap-10 py-10">
        {/* Sidebar chuẩn chỉnh có số lượng bài */}
        <Sidebar categories={sidebarCategories} />

        {/* Nội dung chính của trang Search */}
        <main className="flex-1 min-w-0">
          <SearchContent 
            initialPosts={searchResults} 
            query={query} 
          />
        </main>
      </div>
    </SectionContainer>
  )
}