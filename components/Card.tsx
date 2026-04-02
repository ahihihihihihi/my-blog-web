import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, allLabels, categoryConfig, updated }) => {
  // 1. Logic lọc nhãn: Tìm nhãn đầu tiên của bài viết có trong từ điển config
  const displayLabelSlug = allLabels?.find((lSlug) => 
    categoryConfig?.some((config) => config.slug === lSlug)
  );
  
  // 2. Lấy tên hiển thị tương ứng (ví dụ: "Du Lịch")
  const labelName = categoryConfig?.find((c) => c.slug === displayLabelSlug)?.name;

  // 3. Định dạng ngày tháng (VD: 30/3/2026)
  const formattedDate = updated ? new Date(updated).toLocaleDateString('vi-VN') : null;

  return (
    <div className="md max-w-[544px] p-4 md:w-1/2">
      <div
        className={`${
          imgSrc && 'h-full'
        } overflow-hidden rounded-xl border-2 border-gray-200/60 bg-white dark:border-gray-700/60 dark:bg-gray-800/30 transition-all hover:shadow-lg`}
      >
        {imgSrc && (
          <div className="relative aspect-video overflow-hidden">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`} className="block h-full w-full">
                <Image
                  alt={title}
                  src={imgSrc}
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  width={544}
                  height={306}
                />
              </Link>
            ) : (
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center"
                width={544}
                height={306}
              />
            )}

            {/* NHÃN ABSOLUTE TRÊN ẢNH */}
            {labelName && (
              <div className="absolute top-3 left-3 z-10">
                <span className="rounded bg-primary-500/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  {labelName}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* HIỂN THỊ NGÀY THÁNG */}
          {formattedDate && (
            <div className="mb-2 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
              <time dateTime={updated}>📅 {formattedDate}</time>
            </div>
          )}

          {/* TIÊU ĐỀ - THÊM break-words ĐỂ CHỐNG TRÀN */}
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight break-words">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`} className="text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors">
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          {/* MÔ TẢ - THÊM break-words VÀ line-clamp */}
          <p className="prose mb-4 max-w-none text-sm text-gray-500 dark:text-gray-400 line-clamp-2 break-words">
            {description}
          </p>

          {href && (
            <Link
              href={href}
              className="text-sm font-bold uppercase tracking-widest text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${title}`}
            >
              Đọc tiếp &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card