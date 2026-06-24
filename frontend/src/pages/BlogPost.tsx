import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  publishedAt: string
  tags: string[]
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return

    fetch(`${API}/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      })
      .then(data => {
        setPost(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <div className="blog-page section"><p>Loading post...</p></div>
  }

  if (error || !post) {
    return (
      <div className="blog-page section">
        <p>This post is not available yet.</p>
        <Link to="/blog">← Back to blog</Link>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-header">
        <Link to="/blog" className="back-link">← All posts</Link>
        <div className="post-meta">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h1>{post.title}</h1>
      </div>

      <article className="blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  )
}
