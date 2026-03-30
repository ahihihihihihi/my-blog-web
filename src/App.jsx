import { useEffect, useState } from 'react';
import { getPosts } from './services/blogger';
import jQuery from 'jquery';

// Thiết lập môi trường toàn cục cho các script cũ
window.jQuery = window.$ = jQuery;

function App() {
  const [posts, setPosts] = useState([]); //
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu bài viết
    getPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

useEffect(() => {
    if (!loading) {
      const loadScripts = async () => {
        try {
          // Gán jQuery trước
          window.jQuery = window.$ = jQuery;
          
          // Sau đó mới import các file phụ thuộc
          await import('./assets/js/browser.min.js');
          await import('./assets/js/breakpoints.min.js');
          await import('./assets/js/util.js');
          await import('./assets/js/main.js');
          
          if (window.mainInit) window.mainInit();
          document.body.classList.remove('is-preload');
        } catch (err) {
          console.error("Lỗi khởi tạo:", err);
        }
      };
      loadScripts();
    }
  }, [loading]);

  // Thay vì tự chạy ở cuối file
// window.mainInit(); 

// Hãy gọi nó trong App.jsx
useEffect(() => {
    if (window.mainInit) {
        window.mainInit();
    }
}, []); // Chạy sau khi component mount

  return (
    <div id="wrapper">
      <div id="main">
        <div className="inner">
          <header id="header">
            <a href="/" className="logo"><strong>Editorial</strong> by VnExpress Blogspot</a>
          </header>

          <section id="banner">
            <div className="content">
              <header>
                <h1>Chào mừng đến với Blog News</h1>
              </header>
              <p>Dữ liệu Blogger ID: {import.meta.env.VITE_BLOGGER_ID}</p>
            </div>
            <span className="image object">
              {/* Kiểm tra posts[0] tồn tại trước khi lấy thumbnail để tránh crash */}
              {posts.length > 0 && <img src={posts[0].thumbnail} alt="" />}
            </span>
          </section>

          <section>
            <header className="major"><h2>Bài viết mới nhất</h2></header>
            <div className="posts">
              {loading ? <p>Đang tải...</p> : posts.map(post => (
                <article key={post.id}>
                  <a href={post.url} className="image"><img src={post.thumbnail} alt="" /></a>
                  <h3>{post.title}</h3>
                  <ul className="actions">
                    <li><a href={post.url} className="button">Xem thêm</a></li>
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar - Đảm bảo cấu trúc giống hệt template gốc để jQuery tìm thấy */}
      <div id="sidebar">
        <div className="inner">
          <nav id="menu">
            <header className="major"><h2>Menu</h2></header>
            <ul>
              <li><a href="/">Trang chủ</a></li>
            </ul>
          </nav>
          <footer id="footer"><p className="copyright">&copy; VnExpress.</p></footer>
        </div>
        {/* Quan trọng: Thẻ này dùng để đóng mở Sidebar trong main.js */}
        <a href="#sidebar" className="toggle">Toggle</a>
      </div>
    </div>
  );
}

export default App;