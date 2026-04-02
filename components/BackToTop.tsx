'use client'

import { useEffect, useState } from 'react'

const BackToTop = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi cuộn xuống quá 400px
      if (window.scrollY > 400) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Cuộn mượt mà lên đỉnh
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`bg-primary-500 hover:bg-primary-600 fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0'
      }`}
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  )
}

export default BackToTop
