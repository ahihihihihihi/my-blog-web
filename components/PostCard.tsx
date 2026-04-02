// components/PostCard.tsx
import Link from '@/components/Link'
import Image from '@/components/Image'

export default function PostCard({ post, config }: { post: any; config: any[] }) {
  // Tìm tên hiển thị tiếng Việt từ từ điển
  const labelName = config.find((c) => c.slug === post.primaryLabel)?.name || post.primaryLabel

  return (
    <article className="group flex flex-col items-start gap-6 sm:flex-row">
      {/* KHỐI ẢNH CÓ LABEL ABSOLUTE */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border shadow-sm sm:w-64 dark:border-gray-800">
        <Link href={`/${post.primaryLabel}/${post.postSlug}`}>
          <Image
            src={post.imgSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* CÁI LABEL ĐẬU TRÊN GÓC ẢNH */}
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-primary-500 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
              {labelName}
            </span>
          </div>
        </Link>
      </div>

      {/* KHỐI NỘI DUNG */}
      <div className="flex-1 py-1">
        <div className="mb-2 text-xs font-medium text-gray-400">
          📅 {new Date(post.updated).toLocaleDateString('vi-VN')}
        </div>
        <Link href={`/${post.primaryLabel}/${post.postSlug}`}>
          <h2 className="group-hover:text-primary-500 mb-2 text-xl font-extrabold text-gray-900 transition-colors dark:text-gray-100">
            {post.title}
          </h2>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {post.description}
        </p>
        <Link
          href={`/${post.primaryLabel}/${post.postSlug}`}
          className="text-primary-500 text-xs font-bold tracking-widest uppercase hover:underline"
        >
          Đọc tiếp &rarr;
        </Link>
      </div>
    </article>
  )
}
