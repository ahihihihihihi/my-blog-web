import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import PostList from '@/components/PostList'
import { notFound } from 'next/navigation'

export default async function LabelPage({ params }: { params: Promise<{ label: string }> }) {
  const { label } = await params;

  // Lấy song song: bài viết và cấu hình từ điển
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);
  
  // Tìm thông tin chuyên mục hiện tại trong từ điển
  const currentCategory = config.find((c: any) => c.slug === label);
  const displayName = currentCategory ? currentCategory.name : label.replace(/-/g, ' ');

  // Lọc bài viết thuộc label này
  const filteredPosts = allPosts.filter((post) => post.allLabels.includes(label));

  // Nếu không có bài nào và label không có trong từ điển, có thể trả về 404
  if (filteredPosts.length === 0 && !currentCategory) {
    return notFound();
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 uppercase">
          {displayName}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Danh sách bài viết thuộc chuyên mục {displayName}
        </p>
      </div>
      <div className="container py-12">
        {/* TRUYỀN config VÀO ĐÂY LÀ HẾT LỖI GẠCH ĐỎ */}
        <PostList 
          posts={filteredPosts} 
          label={label} 
          categoryConfig={config} 
        />
      </div>
    </div>
  )
}