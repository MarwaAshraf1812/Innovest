import React, { useState, useEffect } from 'react'
import { Send, Trash2, Edit2 } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../../../config/api'
import ProfileAvatar from '../../../components/ProfileAvatar'

export default function CommentSection({ pageId, currentUser, onViewProfile }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const fetchComments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_URL}/comments/${pageId}`)
      setComments(res.data?.data || res.data || [])
    } catch (err) {
      console.error('Failed to fetch comments:', err)
      setError('Could not load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pageId) {
      fetchComments()
    }
  }, [pageId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await axios.post(`${API_URL}/comments/${pageId}`, { content })
      setContent('')
      await fetchComments()
    } catch (err) {
      console.error('Failed to post comment:', err)
      setError(err.response?.data?.message || 'Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`)
      await fetchComments()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return
    setEditSubmitting(true)
    try {
      await axios.put(`${API_URL}/comments/${commentId}`, { content: editContent })
      setEditingCommentId(null)
      setEditContent('')
      await fetchComments()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update comment')
    } finally {
      setEditSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 pt-3 mt-3 border-t border-slate-100">
      <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Discussion Comments</h5>

      {error && (
        <p className="text-[10px] font-semibold text-rose-600 bg-rose-50 rounded-lg p-2 border border-rose-100">{error}</p>
      )}

      {/* Write Comment */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 text-slate-800 transition-all"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="h-8 w-8 bg-primary-600 hover:bg-primary-750 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors border-none disabled:bg-slate-200 disabled:cursor-not-allowed"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-650" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-[11px] text-slate-400 italic">No comments yet. Start the conversation!</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const commenterName = comment.userDetails 
              ? `${comment.userDetails.first_name || ''} ${comment.userDetails.last_name || ''}`.trim() || comment.userDetails.username 
              : comment.user 
                ? `${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim() || comment.user.username
                : comment.user_id?.username || comment.user_id || 'User'

            const commenterId = comment.userDetails?.id || comment.userDetails?._id || comment.user?.id || comment.user?._id || comment.user_id?.id || comment.user_id?._id || comment.user_id;
            const canDelete = currentUser?.id === commenterId || currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'
            const canEdit = currentUser?.id === commenterId
            const isEditing = editingCommentId === comment.comment_id

            return (
              <div key={comment.comment_id || comment._id} className="p-3 bg-slate-50 rounded-xl border border-slate-105 flex justify-between items-start gap-3">
                <ProfileAvatar
                  userId={commenterId}
                  role={comment.userDetails?.role || comment.user?.role || 'ENTREPRENEUR'}
                  imageUrl={comment.userDetails?.profile_image || comment.user?.profile_image}
                  initials={commenterName?.[0]?.toUpperCase()}
                  className="h-8 w-8 mt-0.5"
                />
                
                <div className="space-y-1 flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <button 
                      className="text-[10px] font-black text-slate-905 cursor-pointer hover:text-primary-600 hover:underline transition-colors border-none bg-transparent p-0 text-left"
                      onClick={() => {
                        if (commenterId) {
                          onViewProfile?.(commenterId);
                        }
                      }}
                    >
                      {commenterName}
                    </button>
                    <span className="text-[8px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2 w-full mt-1">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 text-slate-800"
                        autoFocus
                      />
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleEditSubmit(comment.comment_id)}
                          disabled={editSubmitting || !editContent.trim()}
                          className="px-2 py-0.5 bg-primary-600 hover:bg-primary-750 text-white rounded text-[10px] font-bold border-none cursor-pointer disabled:bg-slate-200"
                        >
                          {editSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null)
                            setEditContent('')
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded text-[10px] font-bold border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-700 leading-normal">{comment.content}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {canEdit && !isEditing && (
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.comment_id)
                        setEditContent(comment.content)
                      }}
                      className="text-slate-400 hover:text-primary-600 bg-transparent border-none cursor-pointer p-0 transition-colors"
                      title="Edit comment"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.comment_id)}
                      className="text-slate-400 hover:text-rose-500 bg-transparent border-none cursor-pointer p-0 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
