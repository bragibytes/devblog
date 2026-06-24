import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostDraft {
  title: string
  slug: string
  content: string
  tags: string
  published: boolean
}

interface Post {
  id: string
  title: string
  slug: string
  content?: string
  tags?: string[]
  published: boolean
  updatedAt?: string
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const ADMIN_TOKEN_KEY = 'bragibytes_admin_token'

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [posts, setPosts] = useState<Post[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<PostDraft>({
    title: '',
    slug: '',
    content: '# New Post\n\nStart writing here...',
    tags: '',
    published: true,
  })
  const [saving, setSaving] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)

  // Editor view mode for small screens
  const [editorMode, setEditorMode] = useState<'split' | 'write' | 'preview'>('split')

  const isAuthed = !!token

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  const loadPosts = async () => {
    if (!token) return
    setLoadingPosts(true)
    try {
      const res = await fetch(`${API}/admin/posts?all=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (e) {
      console.error('Failed to load posts', e)
    }
    setLoadingPosts(false)
  }

  useEffect(() => {
    if (token) {
      loadPosts()
    }
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Login failed')
      }

      const data = await res.json()
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      setToken(data.token)
      setPassword('')
    } catch (err: any) {
      setLoginError(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setToken('')
    setPosts([])
  }

  const generateSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleTitleChange = (title: string) => {
    setDraft(d => ({
      ...d,
      title,
      slug: editingId ? d.slug : generateSlug(title),
    }))
  }

  const handleSave = async () => {
    setSaving(true)

    const payload = {
      title: draft.title,
      slug: draft.slug,
      content: draft.content,
      excerpt: draft.content.substring(0, 160).replace(/\n/g, ' '),
      tags: draft.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: draft.published,
    }

    try {
      let res
      if (editingId) {
        res = await fetch(`${API}/admin/posts/${editingId}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`${API}/admin/posts`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error('Failed to save post')

      await loadPosts()

      // Reset
      setDraft({ title: '', slug: '', content: '# New Post\n\nStart writing here...', tags: '', published: true })
      setEditingId(null)
    } catch (err: any) {
      alert(err.message || 'Save failed')
    }

    setSaving(false)
  }

  const editPost = async (post: Post) => {
    // Fetch full post content
    try {
      const res = await fetch(`${API}/posts/${post.slug}`)
      const full = await res.json()
      setEditingId(post.id)
      setDraft({
        title: post.title,
        slug: post.slug,
        content: full.content || '# ' + post.title,
        tags: (post.tags || []).join(', '),
        published: post.published,
      })
    } catch {
      // fallback
      setEditingId(post.id)
      setDraft({
        title: post.title,
        slug: post.slug,
        content: '# ' + post.title,
        tags: (post.tags || []).join(', '),
        published: post.published,
      })
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return

    try {
      const res = await fetch(`${API}/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      await loadPosts()
    } catch (e) {
      alert('Failed to delete post')
    }
  }

  if (!isAuthed) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin</h1>
          <p>Enter password to manage posts</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Sign in</button>
            {loginError && <div className="error">{loginError}</div>}
          </form>
          <div className="hint">Set ADMIN_PASSWORD in backend/.env</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin • Devblog</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-layout">
        {/* Editor */}
        <div className="admin-editor">
          <div className="editor-header">
            <h2>{editingId ? 'Edit Post' : 'New Post'}</h2>

            {/* View mode switcher - very useful on small screens */}
            <div className="editor-modes">
              <button
                type="button"
                className={editorMode === 'write' ? 'active' : ''}
                onClick={() => setEditorMode('write')}
              >
                Write
              </button>
              <button
                type="button"
                className={editorMode === 'split' ? 'active' : ''}
                onClick={() => setEditorMode('split')}
              >
                Split
              </button>
              <button
                type="button"
                className={editorMode === 'preview' ? 'active' : ''}
                onClick={() => setEditorMode('preview')}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="form-row">
            <input
              className="title-input"
              placeholder="Post title"
              value={draft.title}
              onChange={e => handleTitleChange(e.target.value)}
            />
            <input
              className="slug-input"
              placeholder="slug"
              value={draft.slug}
              onChange={e => setDraft(d => ({ ...d, slug: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <input
              className="tags-input"
              placeholder="tags (comma separated)"
              value={draft.tags}
              onChange={e => setDraft(d => ({ ...d, tags: e.target.value }))}
            />
            <label className="published-toggle">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={e => setDraft(d => ({ ...d, published: e.target.checked }))}
              />
              Published
            </label>
          </div>

          <div className={`markdown-editor mode-${editorMode}`}>
            {(editorMode === 'write' || editorMode === 'split') && (
              <textarea
                value={draft.content}
                onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
                placeholder="Write your post in Markdown..."
                spellCheck={false}
              />
            )}

            {(editorMode === 'preview' || editorMode === 'split') && (
              <div className="markdown-preview">
                <div className="preview-label">Preview</div>
                <div className="preview-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {draft.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="editor-actions">
            <button onClick={handleSave} disabled={saving || !draft.title}>
              {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
            </button>
            {editingId && (
              <button className="secondary" onClick={() => {
                setEditingId(null)
                setDraft({ title: '', slug: '', content: '# New Post\n\n', tags: '', published: true })
              }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Post list */}
        <div className="admin-posts">
          <h2>Your Posts {loadingPosts && <span style={{fontSize:12}}>(loading...)</span>}</h2>
          {posts.length === 0 ? (
            <p className="empty">No posts yet. Create one using the editor.</p>
          ) : (
            <ul>
              {posts.map(post => (
                <li key={post.id}>
                  <div className="post-info">
                    <strong>{post.title}</strong>
                    <span className="slug">/{post.slug}</span>
                    <span className={post.published ? 'status pub' : 'status draft'}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => editPost(post)}>Edit</button>
                    <button className="danger" onClick={() => deletePost(post.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
