// components/SearchButton.tsx
const SearchButton = () => {
  return (
    <form action="/search" method="GET" className="relative flex items-center">
      <input
        type="text"
        name="q" // Cực kỳ quan trọng: name="q" sẽ tạo ra ?q= trên URL
        placeholder="Tìm bài viết..."
        className="focus:border-primary-500 w-32 rounded-full border border-gray-300 bg-gray-50 px-4 py-1 text-sm focus:outline-none sm:w-48 md:w-64 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <button type="submit" className="hover:text-primary-500 absolute right-3 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  )
}

export default SearchButton
