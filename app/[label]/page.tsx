import { getBloggerData } from 'lib/blogger'
import Card from '@/components/Card'

export default async function LabelPage({ params }: { params: Promise<{ label: string }> }) {
  const { label } = await params;
  const allPosts = await getBloggerData();
  
  // Lọc bài: Chỉ cần label trên URL nằm trong mảng nhãn của bài viết là hốt
  const filteredPosts = allPosts.filter((post) => post.allLabels.includes(label));

  // DEBUG: Nếu vẫn thấy thiếu bài, bạn mở Terminal (F12) xem nó in ra gì
  console.log(`--- Đang xem mục: ${label} ---`);
  console.log(`Tổng số bài húp được: ${allPosts.length}`);
  console.log(`Số bài khớp mục ${label}: ${filteredPosts.length}`);

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 uppercase">
          {label.replace(/-/g, ' ')}
        </h1>
      </div>
      <div className="container py-12">
        <div className="-m-4 flex flex-wrap">
          {filteredPosts.map((post) => (
            <Card
              key={`${label}-${post.postSlug}`} // Key cực kỳ quan trọng để ko bị lỗi React
              title={post.title}
              description={post.description}
              imgSrc={post.imgSrc}
              href={`/${label}/${post.postSlug}`} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}