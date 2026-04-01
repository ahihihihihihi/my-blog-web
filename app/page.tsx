// app/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import Card from '@/components/Card'
import Link from 'next/link'

export default async function Page() {
  // 1. Húp đồng thời cả bài viết và cấu hình từ điển
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);

  // 2. Lọc bài viết: Chỉ lấy bài có ít nhất một nhãn nằm trong từ điển config
  const filteredPosts = allPosts.filter((post) => 
    post.allLabels.some((lSlug: string) => config.some((c: any) => c.slug === lSlug))
  );

  // 3. Chỉ lấy 10 bài mới nhất để trang chủ load cho nhanh
  const latestPosts = filteredPosts.slice(0, 10);

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Phần Tiêu đề trang chủ */}
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Mới nhất
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Cập nhật tin tức mới nhất từ hệ thống Blogger CMS
        </p>
      </div>

      {/* Danh sách bài viết dạng Card */}
      <div className="container py-12">
        <div className="-m-4 flex flex-wrap">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => {
              // Lấy nhãn đầu tiên hợp lệ để làm URL (ví dụ: /the-gioi/slug-bai-viet)
              const primaryLabel = post.allLabels.find((l: string) => 
                config.some((c: any) => c.slug === l)
              ) || 'uncategorized';

              return (
                <Card
                    key={post.postSlug}
                    title={post.title}
                    description={post.description}
                    imgSrc={post.imgSrc}
                    // URL bài viết dùng nhãn đầu tiên hợp lệ
                    href={`/${post.allLabels.find(l => config.some(c => c.slug === l)) || 'uncategorized'}/${post.postSlug}`}
                    allLabels={post.allLabels} // <--- QUAN TRỌNG
                    categoryConfig={config}    // <--- QUAN TRỌNG
                />
              )
            })
          ) : (
            <p className="ml-4">Đang cập nhật bài viết...</p>
          )}
        </div>
      </div>

      {/* Nút xem thêm nếu cần (Dẫn về trang tổng hoặc chỉ hiện top bài) */}
      {filteredPosts.length > 10 && (
        <div className="flex justify-end text-base font-medium leading-6 pt-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Tất cả bài viết"
          >
            Tất cả bài viết &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}