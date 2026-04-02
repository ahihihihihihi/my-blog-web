// app/[label]/[slug]/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from '@/components/Image'

/**
 * Hàm này giúp Next.js biết trước tất cả các đường dẫn cần tạo file tĩnh (.html)
 * Giải quyết lỗi: "is missing generateStaticParams() so it cannot be used with output: export"
 */
export async function generateStaticParams() {
  try {
    const allPosts = await getBloggerData()
    // Tạo danh sách các trang dựa trên nhãn (label) và slug bài viết
    return allPosts.flatMap((post) =>
      post.allLabels.map((label) => ({
        label: encodeURIComponent(label),
        slug: post.postSlug,
      }))
    )
  } catch (error) {
    console.error('Lỗi khi chạy generateStaticParams:', error)
    return []
  }
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ label: string; slug: string }>
}) {
  const { label, slug } = await params
  const decodedLabel = decodeURIComponent(label)

  // 1. Lấy dữ liệu đồng thời từ Blogger và File cấu hình category
  const [allPosts, config] = await Promise.all([getBloggerData(), getCategoryConfig()])

  // 2. Tìm bài viết khớp với slug và label
  const postIndex = allPosts.findIndex(
    (p) => p.postSlug === slug && p.allLabels.includes(decodedLabel)
  )
  const post = allPosts[postIndex]

  if (!post) return notFound()

  // 3. Định dạng ngày tháng (VD: 2 tháng 4, 2026)
  const formattedDate = new Date(post.updated).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // 4. Xác định Label chính để hiển thị điều hướng
  const primaryLabelSlug =
    post.allLabels.find((l: string) => config.some((c: any) => c.slug === l)) || decodedLabel
  const primaryLabelName =
    config.find((c: any) => c.slug === primaryLabelSlug)?.name || primaryLabelSlug

  // 5. Tìm bài viết cũ hơn để làm phần điều hướng phía dưới
  const prevPost = allPosts[postIndex + 1]

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 xl:max-w-5xl xl:px-0">
      <article>
        {/* Tiêu đề và Thông tin phụ */}
        <header className="space-y-4 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <time dateTime={post.updated}>{formattedDate}</time>
            <span>•</span>
            <Link
              href={`/${primaryLabelSlug}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold uppercase transition-colors"
            >
              {primaryLabelName}
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
        </header>

        {/* Ảnh đại diện bài viết */}
        {post.imgSrc && (
          <div className="my-10 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={post.imgSrc}
              alt={post.title}
              width={1200}
              height={630}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Nội dung bài viết (Render từ HTML Blogger) */}
        <div className="prose dark:prose-invert max-w-none py-10 text-lg leading-relaxed lg:prose-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Điều hướng cuối bài */}
        <footer className="mt-16 border-t border-gray-200 pt-10 dark:border-gray-700">
          <div className="mb-8 text-center">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
              Xem thêm nội dung
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nút về danh mục */}
            <Link
              href={`/${primaryLabelSlug}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center transition-all hover:border-primary-500 hover:bg-white dark:border-gray-700 dark:bg-gray-800/50"
            >
              <span className="mb-2 text-xs font-bold text-gray-400 uppercase">Chuyên mục</span>
              <span className="text-primary-500 font-bold sm:text-xl">
                ← {primaryLabelName}
              </span>
            </Link>

            {/* Bài viết cũ hơn */}
            {prevPost ? (
              <Link
                href={`/${primaryLabelSlug}/${prevPost.postSlug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-right shadow-md transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
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
                  <h4 className="group-hover:text-primary-500 mb-3 line-clamp-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {prevPost.title}
                  </h4>
                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {prevPost.description}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-800/30">
                Đây là bài viết cuối cùng của danh mục này.
              </div>
            )}
          </div>
        </footer>
      </article>
    </div>
  )
}