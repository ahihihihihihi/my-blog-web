// app/[label]/[slug]/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from '@/components/Image'

export default async function PostDetail({ params }: { params: Promise<{ label: string; slug: string }> }) {
  const { label, slug } = await params;
  
  // 1. Lấy dữ liệu đồng thời từ Blogger và File Config
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);
  
  // 2. Tìm bài viết hiện tại
  const postIndex = allPosts.findIndex((p) => p.postSlug === slug && p.allLabels.includes(label));
  const post = allPosts[postIndex];

  if (!post) return notFound();

  // 3. Định dạng ngày tháng cập nhật (VD: 2 tháng 4, 2026)
  const formattedDate = new Date(post.updated).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 4. Xác định Label chính (nhãn đầu tiên khớp với từ điển) để làm mốc điều hướng
  const primaryLabelSlug = post.allLabels.find((l: string) => config.some((c: any) => c.slug === l)) || label;
  const primaryLabelName = config.find((c: any) => c.slug === primaryLabelSlug)?.name || primaryLabelSlug;

  // 5. Tìm bài viết Trước/Sau trong cùng chuyên mục chính
  const relatedPosts = allPosts.filter((p) => p.allLabels.includes(primaryLabelSlug));
  const currentInRelatedIndex = relatedPosts.findIndex((p) => p.postSlug === slug);

  // Blogger trả về bài mới nhất ở đầu mảng: [index - 1] là Mới hơn, [index + 1] là Cũ hơn
  const nextPost = relatedPosts[currentInRelatedIndex - 1]; 
  const prevPost = relatedPosts[currentInRelatedIndex + 1];

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-20">
      {/* HEADER: Label, Title, Date */}
      <header className="mb-8 border-b pb-8 dark:border-gray-700">
        <div className="mb-4 flex flex-wrap gap-3">
          {post.allLabels.map((lSlug: string) => {
            const conf = config.find((c: any) => c.slug === lSlug);
            if (!conf) return null;
            return (
              <Link 
                key={lSlug}
                href={`/${lSlug}`}
                className="text-xs font-bold uppercase tracking-widest text-primary-500 hover:text-primary-600"
              >
                {conf.name}
              </Link>
            )
          })}
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          <time dateTime={post.updated}>📅 {formattedDate}</time>
          <span className="mx-2">•</span>
          <span className="uppercase tracking-wide">{primaryLabelName}</span>
        </div>
      </header>

      {/* ẢNH ĐẠI DIỆN CHÍNH */}
      {post.imgSrc && (
        <div className="mb-10 overflow-hidden rounded-xl shadow-lg">
          <Image 
            src={post.imgSrc} 
            alt={post.title} 
            width={1600} 
            height={900} 
            className="w-full object-cover aspect-video" 
          />
        </div>
      )}

      {/* NỘI DUNG BÀI VIẾT */}
      <div 
        className="prose max-w-none dark:prose-invert" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      {/* FOOTER: ĐIỀU HƯỚNG BÀI VIẾT DẠNG CARD (BẢN FIX ĐẦY ĐỦ TEXT) */}
      <div className="mt-20 border-t pt-10 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-10 text-gray-900 dark:text-gray-100 text-center italic">
          Xem thêm các bài viết mục <span className="text-primary-500">{primaryLabelName}</span>
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* CARD: BÀI MỚI HƠN */}
          {nextPost ? (
            <Link 
              href={`/${primaryLabelSlug}/${nextPost.postSlug}`}
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-md hover:shadow-2xl bg-white dark:bg-gray-800 overflow-hidden"
            >
              {nextPost.imgSrc && (
                <div className="h-40 overflow-hidden">
                  <Image src={nextPost.imgSrc} alt={nextPost.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <span className="text-xs uppercase font-bold text-gray-400 mb-2 block">← Bài mới hơn</span>
                <h4 className="text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-primary-500 mb-3 line-clamp-2">
                  {nextPost.title}
                </h4>
                {/* TRẢ LẠI TEXT DẠO ĐẦU ĐÂY BẠN HIỀN :)))) */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {nextPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/20 text-sm">
              Bạn đang xem bài viết mới nhất
            </div>
          )}

          {/* CARD: BÀI CŨ HƠN */}
          {prevPost ? (
            <Link 
              href={`/${primaryLabelSlug}/${prevPost.postSlug}`}
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-md hover:shadow-2xl bg-white dark:bg-gray-800 overflow-hidden text-right items-end"
            >
              {prevPost.imgSrc && (
                <div className="h-40 w-full overflow-hidden">
                  <Image src={prevPost.imgSrc} alt={prevPost.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <span className="text-xs uppercase font-bold text-gray-400 mb-2 block">Bài cũ hơn →</span>
                <h4 className="text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-primary-500 mb-3 line-clamp-2">
                  {prevPost.title}
                </h4>
                {/* TRẢ LẠI TEXT DẠO ĐẦU ĐÂY BẠN HIỀN :)))) */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {prevPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/20 text-sm">
              Đây là bài viết đầu tiên
            </div>
          )}
        </div>
      </div>
    </article>
  )
}