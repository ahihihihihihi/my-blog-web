import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, allLabels, categoryConfig }) => {
  // Logic lọc: Tìm nhãn đầu tiên của bài viết có tồn tại trong từ điển config
  const displayLabel = allLabels?.find((lSlug) => 
    categoryConfig?.some((config) => config.slug === lSlug)
  );
  
  // Lấy tên hiển thị tương ứng từ config
  const labelName = categoryConfig?.find((c) => c.slug === displayLabel)?.name;

  return (
    <div className="md max-w-[544px] p-4 md:w-1/2">
      <div
        className={`${
          imgSrc && 'h-full'
        } overflow-hidden rounded-md border-2 border-gray-200/60 dark:border-gray-700/60`}
      >
        {imgSrc && (
          <div className="relative"> {/* Thêm relative để làm gốc cho nhãn absolute */}
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                <Image
                  alt={title}
                  src={imgSrc}
                  className="object-cover object-center md:h-36 lg:h-48"
                  width={544}
                  height={306}
                />
              </Link>
            ) : (
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-36 lg:h-48"
                width={544}
                height={306}
              />
            )}

            {/* Hiển thị Nhãn Absolute */}
            {labelName && (
              <div className="absolute top-2 left-2 z-10">
                <span className="rounded bg-primary-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  {labelName}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
          {href && (
            <Link
              href={href}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
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