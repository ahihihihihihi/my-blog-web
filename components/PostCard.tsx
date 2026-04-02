// components/PostCard.tsx
import Link from '@/components/Link'
import Image from '@/components/Image'

export default function PostCard({ post, config }: { post: any; config: any[] }) {
  // Tìm tên hiển thị tiếng Việt từ từ điển
  const labelName = config.find((c) => c.slug === post.primaryLabel)?.name || post.primaryLabel

  return (
    <article className="group flex flex-col sm:flex-row gap-6 items-start">
      {/* KHỐI ẢNH CÓ LABEL ABSOLUTE */}
      <div className="relative w-full sm:w-64 shrink-0 aspect-[16/10] overflow-hidden rounded-xl border dark:border-gray-800 shadow-sm">
        <Link href={`/${post.primaryLabel}/${post.postSlug}`}>
          <Image
            src={post.imgSrc}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* CÁI LABEL ĐẬU TRÊN GÓC ẢNH */}
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
              {labelName}
            </span>
          </div>
        </Link>
      </div>

      {/* KHỐI NỘI DUNG */}
      <div className="flex-1 py-1">
        <div className="text-xs text-gray-400 mb-2 font-medium">
          📅 {new Date(post.updated).toLocaleDateString('vi-VN')}
        </div>
        <Link href={`/${post.primaryLabel}/${post.postSlug}`}>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors mb-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-4">
          {post.description}
        </p>
        <Link
          href={`/${post.primaryLabel}/${post.postSlug}`}
          className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline"
        >
          Đọc tiếp &rarr;
        </Link>
      </div>
    </article>
  )
}