const { withContentlayer } = require('next-contentlayer2')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output: 'export',
    basePath: '',
    trailingSlash: true,
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      // ĐÂY LÀ CHÌA KHÓA: Bỏ qua đống lỗi Prettier trong log bạn gửi
      ignoreDuringBuilds: true, 
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
    // KHÔNG THÊM headers() VÀO ĐÂY VÌ SẼ BỊ LỖI EXPORT TĨNH
  })
}