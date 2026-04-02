const { withContentlayer } = require('next-contentlayer2')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output: 'export',
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      ignoreDuringBuilds: true, // Lờ đi lỗi Prettier/ESLint
    },
    typescript: {
      ignoreBuildErrors: true, // Lờ đi lỗi Type
    },
    images: {
      unoptimized: true,
    },
    // TUYỆT ĐỐI KHÔNG CÓ async headers() Ở ĐÂY
  })
}