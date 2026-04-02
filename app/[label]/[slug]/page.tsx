// app/[label]/[slug]/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from '@/components/Image'

export default async function PostDetail({
  params,
}: {
  params: Promise<{ label: string; slug: string }>
}) {
  const { label, slug } = await params

  // 1. Lấy dữ liệu đồng thời từ Blogger và File Config
  const [allPosts, config] = await Promise.all([getBloggerData(), getCategoryConfig()])

  // 2. Tìm bài viết hiện tại
  const postIndex = allPosts.findIndex((p) => p.postSlug === slug && p.allLabels.includes(label))
  const post = allPosts[postIndex]

  if (!post) return notFound()

  // 3. Định dạng ngày tháng cập nhật (VD: 2 tháng 4, 2026)
  const formattedDate = new Date(post.updated).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // 4. Xác định Label chính (nhãn đầu tiên khớp với từ điển) để làm mốc điều hướng
  const primaryLabelSlug =
    post.allLabels.find((l: string) => config.some((c: any) => c.slug === l)) || label
  const primaryLabelName =
    config.find((c: any) => c.slug === primaryLabelSlug)?.name || primaryLabelSlug

  // 5. Tìm bài viết Trước/Sau trong cùng chuyên mục chính
  const relatedPosts = allPosts.filter((p) => p.allLabels.includes(primaryLabelSlug))
  const currentInRelatedIndex = relatedPosts.findIndex((p) => p.postSlug === slug)

  // Blogger trả về bài mới nhất ở đầu mảng: [index - 1] là Mới hơn, [index + 1] là Cũ hơn
  const nextPost = relatedPosts[currentInRelatedIndex - 1]
  const prevPost = relatedPosts[currentInRelatedIndex + 1]

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-20">
      {/* HEADER: Label, Title, Date */}
      <header className="mb-8 border-b pb-8 dark:border-gray-700">
        <div className="mb-4 flex flex-wrap gap-3">
          {post.allLabels.map((lSlug: string) => {
            const conf = config.find((c: any) => c.slug === lSlug)
            if (!conf) return null
            return (
              <Link
                key={lSlug}
                href={`/${lSlug}`}
                className="text-primary-500 hover:text-primary-600 text-xs font-bold tracking-widest uppercase"
              >
                {conf.name}
              </Link>
            )
          })}
        </div>

        <h1 className="mb-4 text-3xl leading-tight font-extrabold text-gray-900 sm:text-5xl dark:text-gray-100">
          {post.title}
        </h1>

        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <time dateTime={post.updated}>📅 {formattedDate}</time>
          <span className="mx-2">•</span>
          <span className="tracking-wide uppercase">{primaryLabelName}</span>
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
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      {/* NỘI DUNG BÀI VIẾT */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* FOOTER: ĐIỀU HƯỚNG BÀI VIẾT DẠNG CARD (BẢN FIX ĐẦY ĐỦ TEXT) */}
      <div className="mt-20 border-t pt-10 dark:border-gray-700">
        <h3 className="mb-10 text-center text-2xl font-bold text-gray-900 italic dark:text-gray-100">
          Xem thêm các bài viết mục <span className="text-primary-500">{primaryLabelName}</span>
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* CARD: BÀI MỚI HƠN */}
          {nextPost ? (
            <Link
              href={`/${primaryLabelSlug}/${nextPost.postSlug}`}
              className="group hover:border-primary-500 dark:hover:border-primary-500 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            >
              {nextPost.imgSrc && (
                <div className="h-40 overflow-hidden">
                  <Image
                    src={nextPost.imgSrc}
                    alt={nextPost.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                  ← Bài mới hơn
                </span>
                <h4 className="group-hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-snug font-bold text-gray-900 dark:text-gray-100">
                  {nextPost.title}
                </h4>
                {/* TRẢ LẠI TEXT DẠO ĐẦU ĐÂY BẠN HIỀN :)))) */}
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {nextPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-sm text-gray-400 dark:bg-gray-900/20">
              Bạn đang xem bài viết mới nhất
            </div>
          )}

          {/* CARD: BÀI CŨ HƠN */}
          {prevPost ? (
            <Link
              href={`/${primaryLabelSlug}/${prevPost.postSlug}`}
              className="group hover:border-primary-500 dark:hover:border-primary-500 flex flex-col items-end overflow-hidden rounded-xl border border-gray-200 bg-white text-right shadow-md transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            >
              {prevPost.imgSrc && (
                <div className="h-40 w-full overflow-hidden">
                  <Image
                    src={prevPost.imgSrc}
                    alt={prevPost.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                  Bài cũ hơn →
                </span>
                <h4 className="group-hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-snug font-bold text-gray-900 dark:text-gray-100">
                  {prevPost.title}
                </h4>
                {/* TRẢ LẠI TEXT DẠO ĐẦU ĐÂY BẠN HIỀN :)))) */}
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {prevPost.description}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-sm text-gray-400 dark:bg-gray-900/20">
              Đây là bài viết đầu tiên
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
