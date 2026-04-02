// lib/blogger.ts

const blogId = process.env.VITE_BLOGGER_ID

function convertToSlug(text: string) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 1. Lấy danh mục từ trang config.html trên Blogger
export async function getCategoryConfig() {
  try {
    const url = `https://www.blogger.com/feeds/${blogId}/pages/default?alt=json`
    const res = await fetch(url, { next: { revalidate: 0 } })
    const data = await res.json()

    const configPage = data.feed.entry.find((entry: any) =>
      entry.link.some((l: any) => l.href.includes('/config.html'))
    )

    if (configPage) {
      const rawJson = configPage.content.$t.replace(/<[^>]*>/g, '').trim()
      const parsed = JSON.parse(rawJson)
      return parsed.categories || []
    }
  } catch (error) {
    console.error('Lỗi fetch config:', error)
  }
  return []
}

// 2. Lấy 500 bài viết MỚI CẬP NHẬT (orderby=updated)
export async function getBloggerData() {
  const config = await getCategoryConfig()
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&max-results=500&orderby=updated`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    if (!data?.feed?.entry) return []

    return data.feed.entry.map((entry: any) => {
      const content = entry.content?.$t || ''
      const originalLink = entry.link.find((l: any) => l.rel === 'alternate')?.href || ''
      const postLabels = entry.category ? entry.category.map((c: any) => convertToSlug(c.term)) : []

      // Lọc nhãn: Tìm nhãn đầu tiên xuất hiện trong file config của bạn
      const primaryLabel =
        postLabels.find((slug: string) => config.some((c: any) => c.slug === slug)) || 'news'
      const postSlug =
        originalLink.match(/\/([^/]+)\.html$/)?.[1] || entry.id.$t.split('post-').pop()

      return {
        title: entry.title.$t,
        updated: entry.updated.$t,
        content: content, // Trả về content đầy đủ để trang chi tiết húp
        imgSrc:
          content.match(/<img.*?src=["'](.*?)["']/)?.[1]?.replace(/&amp;/g, '&') ||
          '/static/images/default.jpg',
        description: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        postSlug: postSlug,
        allLabels: postLabels,
        primaryLabel: primaryLabel, // QUAN TRỌNG: Dùng cái này để làm link
      }
    })
  } catch (error) {
    return []
  }
}

// 3. Húp số lượng bài cho Sidebar siêu tốc (Không giới hạn 500 bài)

export async function getSidebarData() {
  const config = await getCategoryConfig()

  const categoriesWithCount = await Promise.all(
    config.map(async (cat: any) => {
      try {
        // CHIẾN THUẬT CHỐT:
        // 1. Dùng cat.slug (ví dụ: the-gioi) để query vì nhãn trên bài viết là không dấu
        // 2. Thêm dấu / vào sau slug để Google API nhận diện chính xác label
        const url = `https://www.blogger.com/feeds/${blogId}/posts/default/-/${cat.slug}/?alt=json&max-results=0`

        // Buộc húp mới, không chơi với cache cũ
        const res = await fetch(url, { next: { revalidate: 3600 } })
        const data = await res.json()

        // Húp lấy con số $t (số 7 thần thánh của bạn đấy)
        const total = parseInt(data.feed?.openSearch$totalResults?.$t || '0')

        return {
          ...cat, // Giữ nguyên name (Tiếng Việt) và slug
          count: total,
        }
      } catch (error) {
        console.error(`Lỗi húp số cho label ${cat.slug}:`, error)
        return { ...cat, count: 0 }
      }
    })
  )

  return categoriesWithCount
}

// 4. Search sâu tận gốc rễ (Húp từ nội dung Blogger)

export async function searchBloggerPosts(query: string) {
  const config = await getCategoryConfig()
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&q=${encodeURIComponent(query)}&max-results=50&orderby=updated`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    if (!data?.feed?.entry) return []

    return data.feed.entry.map((entry: any) => {
      const content = entry.content?.$t || ''
      const originalLink = entry.link.find((l: any) => l.rel === 'alternate')?.href || ''
      const postLabels = entry.category ? entry.category.map((c: any) => convertToSlug(c.term)) : []

      // Tìm nhãn chính để làm URL và hiển thị Absolute Label
      const primaryLabel =
        postLabels.find((slug: string) => config.some((c: any) => c.slug === slug)) || 'news'
      const postSlug =
        originalLink.match(/\/([^/]+)\.html$/)?.[1] || entry.id.$t.split('post-').pop()

      return {
        title: entry.title.$t,
        updated: entry.updated.$t,
        content: content,
        imgSrc:
          content.match(/<img.*?src=["'](.*?)["']/)?.[1]?.replace(/&amp;/g, '&') ||
          '/static/images/default.jpg',
        description: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        postSlug: postSlug,
        allLabels: postLabels,
        primaryLabel: primaryLabel,
      }
    })
  } catch (error) {
    return []
  }
}
