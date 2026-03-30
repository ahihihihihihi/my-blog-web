import jsonp from 'jsonp';

const BLOG_ID = import.meta.env.VITE_BLOGGER_ID;
const FEED_URL = `https://www.blogger.com/feeds/${BLOG_ID}/posts/default?alt=json-in-script&max-results=15`;
const DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/pw/AP1GczNoC9Jl6nRCgCOIXW2IYf_y1dfr5c9EkoiADe2gVEfz-NWR0ESQddToNWXJvK1cOc_2mCtMCRbB2xnr5-7pH35uuy-GbPjCxwr7lXpUBs7dXSpg12w';

// Hàm hỗ trợ giải mã các ký tự thực thể HTML như &amp; thành &
const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const getPosts = () => {
  return new Promise((resolve, reject) => {
    jsonp(FEED_URL, { param: 'callback' }, (err, data) => {
      if (err) return resolve([]);

      const entries = data.feed.entry || [];
      const formattedPosts = entries.map(entry => {
        const rawContent = entry.content ? entry.content.$t : "";
        
        // Regex lấy link ảnh đầu tiên
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = rawContent.match(imgRegex);
        
        let finalThumb = DEFAULT_IMAGE;
        if (match && match[1]) {
          // Thực hiện giải mã link ảnh để loại bỏ &amp;
          finalThumb = decodeHTML(match[1]);
        }
        
        return {
          id: entry.id.$t.split('post-').pop(),
          title: entry.title.$t,
          labels: entry.category ? entry.category.map(cat => cat.term) : [],
          published: entry.published.$t,
          updated: entry.updated.$t,
          thumbnail: finalThumb,
          url: entry.link.find(l => l.rel === 'alternate')?.href
        };
      });
      resolve(formattedPosts);
    });
  });
};