import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  tags: string[]
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load posts')
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="blog-page section">
      <div className="blog-header">
        <h1>Devblog</h1>
        <p className="blog-intro">Notes on building software, shipping products, and the occasional deep dive.</p>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && (
        <div className="blog-empty">
          <p>The devblog is not live yet. Check back soon.</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="blog-empty">
          <p>No posts published yet. Check back soon.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="blog-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card">
              <div className="blog-card-meta">
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {post.tags && post.tags.length > 0 && (
                  <span className="blog-tags">
                    {post.tags.map(t => <span key={t}>{t}</span>)}
                  </span>
                )}
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt || ''}</p>
              <div className="blog-readmore">Read more →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
