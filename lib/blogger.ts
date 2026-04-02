// lib/blogger.ts

const blogId = process.env.VITE_BLOGGER_ID;

function convertToSlug(text: string) {
  if (!text) return '';
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// 1. Lấy danh mục từ trang config.html trên Blogger
export async function getCategoryConfig() {
  try {
    const url = `https://www.blogger.com/feeds/${blogId}/pages/default?alt=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    
    const configPage = data.feed.entry.find((entry: any) => 
      entry.link.some((l: any) => l.href.includes('/config.html'))
    );

    if (configPage) {
      // Parse nội dung JSON (loại bỏ tag HTML nếu có)
      const rawJson = configPage.content.$t.replace(/<[^>]*>/g, '').trim();
      const parsed = JSON.parse(rawJson);
      return parsed.categories || [];
    }
  } catch (error) {
    console.error("Lỗi fetch config:", error);
  }
  return [];
}

// 2. Lấy toàn bộ bài viết và lọc nhãn theo config
export async function getBloggerData() {
  const config = await getCategoryConfig();
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&max-results=500`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  if (!data?.feed?.entry) return [];

  return data.feed.entry.map((entry: any) => {
    const content = entry.content?.$t || "";
    const originalLink = entry.link.find((l: any) => l.rel === 'alternate')?.href || "";
    
    // Chỉ giữ lại những nhãn có trong từ điển config
    const labels = entry.category 
      ? entry.category
          .map((c: any) => convertToSlug(c.term))
          .filter((slug: string) => config.some((item: any) => item.slug === slug))
      : [];

    const postSlug = originalLink.match(/\/([^/]+)\.html$/)?.[1] || entry.id.$t.split('post-')[1];

    return {
      title: entry.title.$t,
      updated: entry.updated.$t,
      imgSrc: content.match(/<img.*?src=["'](.*?)["']/)?.[1]?.replace(/&amp;/g, '&') || '/static/images/default.jpg',
      description: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      content: content,
      postSlug: postSlug,
      allLabels: labels, 
    };
  });
}

// lib/blogger.ts bổ sung thêm hàm này
export async function getCategoryCounts() {
  const [posts, config] = await Promise.all([getBloggerData(), getCategoryConfig()]);
  
  return config.map(cat => {
    const count = posts.filter(p => p.allLabels.includes(cat.slug)).length;
    return { ...cat, count };
  });
}



// Hàm search mới: Húp thẳng từ nội dung đã lọc của Blogger

export async function searchBloggerPosts(query: string) {
  const config = await getCategoryConfig();
  // Tham số q= để Blogger tự search toàn bộ nội dung
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&q=${encodeURIComponent(query)}&max-results=50`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (!data?.feed?.entry) return [];

    return data.feed.entry
      .map((entry: any) => {
        const content = entry.content?.$t || "";
        const originalLink = entry.link.find((l: any) => l.rel === 'alternate')?.href || "";
        
        // 1. Lấy danh sách label bài viết và chuyển thành slug
        const postLabels = entry.category 
          ? entry.category.map((c: any) => convertToSlug(c.term))
          : [];

        // 2. Chỉ giữ lại nhãn nào có trong từ điển config
        const validLabels = postLabels.filter((slug: string) => 
          config.some((item: any) => item.slug === slug)
        );

        // Nếu bài không có nhãn nào thuộc từ điển -> Loại (bài vớ vẩn)
        if (validLabels.length === 0) return null;

        // 3. FIX REGEX LẤY ẢNH & SLUG (Dùng dấu xoẹt kép \\)
        const imgRegex = /<img.*?src=["'](.*?)["']/;
        const slugRegex = /\/([^/]+)\.html$/;

        const imgSrc = content.match(imgRegex)?.[1]?.replace(/&amp;/g, '&') || '/static/images/default.jpg';
        const postSlug = originalLink.match(slugRegex)?.[1] || entry.id.$t.split('post-').length > 1 ? entry.id.$t.split('post-')[1] : 'unknown';

        return {
          title: entry.title.$t,
          updated: entry.updated.$t,
          imgSrc: imgSrc,
          description: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          postSlug: postSlug,
          allLabels: validLabels,
        };
      })
      .filter(Boolean); // Loại bỏ các bài null
  } catch (error) {
    console.error("Lỗi search Blogger:", error);
    return [];
  }
}

export async function getSidebarData() {
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);

  return config.map(cat => ({
    ...cat,
    count: allPosts.filter(p => p.allLabels.includes(cat.slug)).length
  }));
}

