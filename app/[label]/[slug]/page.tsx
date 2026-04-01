import { getBloggerData } from 'lib/blogger'
import { notFound } from 'next/navigation'

export default async function PostDetail({ params }: { params: Promise<{ label: string; slug: string }> }) {
  const { label, slug } = await params;
  const allPosts = await getBloggerData();
  
  const post = allPosts.find((p) => p.postSlug === slug && p.allLabels.includes(label));

  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">{post.title}</h1>
      <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}