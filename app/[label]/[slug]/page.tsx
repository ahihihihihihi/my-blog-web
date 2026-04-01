// app/[label]/[slug]/page.tsx
import { getBloggerData, getCategoryConfig } from 'lib/blogger'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PostDetail({ params }: { params: Promise<{ label: string; slug: string }> }) {
  const { label, slug } = await params;
  const [allPosts, config] = await Promise.all([
    getBloggerData(),
    getCategoryConfig()
  ]);
  
  const post = allPosts.find((p) => p.postSlug === slug && p.allLabels.includes(label));
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 pb-20">
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap gap-3">
          {post.allLabels.map((lSlug: string) => {
            const conf = config.find((c: any) => c.slug === lSlug);
            if (!conf) return null;
            return (
              <Link 
                key={lSlug}
                href={`/${lSlug}`}
                className="text-xs font-bold uppercase tracking-widest text-primary-500 hover:text-primary-600"
              >
                {conf.name}
              </Link>
            )
          })}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl">
          {post.title}
        </h1>
      </header>

      {post.imgSrc && <img src={post.imgSrc} alt={post.title} className="w-full rounded-xl mb-10 shadow-lg" />}

      <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <div className="mt-10 border-t pt-6 dark:border-gray-700">
        <p className="text-sm text-gray-500">
          Chuyên mục: {post.allLabels.map((lSlug: string, i: number) => {
            const conf = config.find((c: any) => c.slug === lSlug);
            return (
              <span key={lSlug}>
                <Link href={`/${lSlug}`} className="text-primary-500 hover:underline">{conf?.name || lSlug}</Link>
                {i < post.allLabels.length - 1 ? ', ' : ''}
              </span>
            )
          })}
        </p>
      </div>
    </article>
  )
}