// lib/blogger.ts

function convertToSlug(text: string) {
  if (!text) return 'uncategorized';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getBloggerData() {
  const blogId = process.env.VITE_BLOGGER_ID;
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default?alt=json&max-results=500`; // Lấy tối đa 500 bài
  
  const res = await fetch(url, { next: { revalidate: 60 } }); // Cache ngắn lại để dễ debug
  const data = await res.json();

  if (!data?.feed?.entry) return [];

  return data.feed.entry.map((entry: any) => {
    const content = entry.content?.$t || "";
    const originalLink = entry.link.find((l: any) => l.rel === 'alternate')?.href || "";
    
    // Lấy TẤT CẢ các nhãn của bài viết
    const labels = entry.category 
      ? entry.category.map((c: any) => convertToSlug(c.term)) 
      : ['uncategorized'];

    const postSlug = originalLink.match(/\/([^/]+)\.html$/)?.[1] || entry.id.$t.split('post-')[1];

    return {
      title: entry.title.$t,
      imgSrc: content.match(/<img.*?src=["'](.*?)["']/)?.[1]?.replace(/&amp;/g, '&') || '/static/images/time-machine.jpg',
      description: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      content: content,
      postSlug: postSlug,
      allLabels: labels, 
    };
  });
}