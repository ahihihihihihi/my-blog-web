// app/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import Link from '@/components/Link'
import Image from '@/components/Image'
import SectionContainer from '@/components/SectionContainer'

export default async function HomePage() {
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);

  // 1. LỌC BÀI VIẾT: Chỉ lấy bài có nhãn nằm trong từ điển config
  const validPosts = allPosts.filter((post) => 
    post.allLabels.some((label) => config.some((c) => c.slug === label))
  );

  // Lấy 6 bài mới nhất từ danh sách bài hợp lệ
  const displayPosts = validPosts.slice(0, 6);

  // 2. Tính toán số lượng bài cho Sidebar dựa trên validPosts
  const categoriesWithCount = config.map(cat => ({
    ...cat,
    count: validPosts.filter(p => p.allLabels.includes(cat.slug)).length
  }));

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row gap-10 py-10">
        {/* SIDEBAR BÊN TRÁI - DANH MỤC */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-primary-500 font-bold uppercase tracking-wider mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              Chuyên mục
            </h3>
            <nav className="flex flex-col gap-4">
              {categoriesWithCount.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-500">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* DANH SÁCH BÀI VIẾT BÊN PHẢI */}
        <main className="flex-1 min-w-0"> {/* min-w-0 để chống tràn flex */}
          <h1 className="text-2xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 uppercase tracking-tight">
            Mới cập nhật
          </h1>
          
          <div className="space-y-10">
            {displayPosts.map((post) => {
              // Tìm label chính từ từ điển
              const primaryLabelSlug = post.allLabels.find((l) => config.some((c) => c.slug === l)) || post.allLabels[0];
              const primaryLabel = config.find((c) => c.slug === primaryLabelSlug);

              return (
                <article key={post.postSlug} className="group relative flex flex-col sm:flex-row gap-6 items-start">
                  {/* ẢNH ĐẠI DIỆN VỚI LABEL ABSOLUTE */}
                  <div className="relative w-full sm:w-64 shrink-0 aspect-[16/10] overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all border dark:border-gray-800">
                    <Link href={`/${primaryLabelSlug}/${post.postSlug}`}>
                      <Image
                        src={post.imgSrc}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-primary-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg z-10">
                        {primaryLabel?.name || primaryLabelSlug}
                      </span>
                    </Link>
                  </div>

                  {/* NỘI DUNG BÊN PHẢI */}
                  <div className="flex flex-col flex-1 py-1 min-w-0"> {/* min-w-0 ở đây cực quan trọng để chống tràn text */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                      <time>📅 {new Date(post.updated).toLocaleDateString('vi-VN')}</time>
                    </div>
                    
                    <Link href={`/${primaryLabelSlug}/${post.postSlug}`}>
                      <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors mb-2 break-words">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed mb-4 break-words">
                      {post.description}
                    </p>
                    
                    <Link 
                      href={`/${primaryLabelSlug}/${post.postSlug}`}
                      className="text-xs font-bold text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      Đọc tiếp <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </SectionContainer>
  )
}