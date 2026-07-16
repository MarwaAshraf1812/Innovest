import React, { useState, useEffect } from 'react'
import { MapPin, MessageSquare, Heart } from 'lucide-react'
import axios from 'axios'
import Card from '../../../components/ui/Card'
import CommentSection from './CommentSection'
import { API_URL } from '../../../config/api'
import ProfileAvatar from '../../../components/ProfileAvatar'

export default function PostCard({ post, currentUser, onViewProfile, canComment = true }) {
  const [showComments, setShowComments] = useState(false)

  // Like state — optimistic, seeded from the post data
  const [liked, setLiked]         = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes ?? 0)
  const [likeLoading, setLikeLoading] = useState(false)

  // On mount, check if the current user has already liked this page
  useEffect(() => {
    if (!currentUser?.id || !post.page_id) return
    axios
      .get(`${API_URL}/like/${post.page_id}/likes`)
      .then(res => {
        const likes = res.data || []
        const hasLiked = likes.some(l => l.user_id === currentUser.id)
        setLiked(hasLiked)
        setLikeCount(likes.length)
      })
      .catch(() => {
        // fail silently — use post.likes as the count
      })
  }, [post.page_id, currentUser?.id])

  const handleToggleLike = async () => {
    if (!currentUser) return
    if (likeLoading) return

    // Optimistic UI update
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1)
    setLikeLoading(true)

    try {
      const res = await axios.post(`${API_URL}/like/toggle/${post.page_id}`)
      // Sync with server truth
      setLiked(res.data.liked)
      setLikeCount(res.data.likeCount)
    } catch (err) {
      // Rollback on failure
      setLiked(wasLiked)
      setLikeCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1))
    } finally {
      setLikeLoading(false)
    }
  }

  const authorInitials = post.authorDetails?.first_name
    ? post.authorDetails.first_name[0].toUpperCase()
    : 'F'

  return (
    <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-slate-350 transition-all duration-300">
      <div className="space-y-4">
        {/* Post Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <ProfileAvatar
              userId={post.authorDetails?.id || post.authorDetails?._id || post.author}
              role={post.authorDetails?.role || 'ENTREPRENEUR'}
              imageUrl={post.authorDetails?.profile_image}
              initials={authorInitials}
              className="h-10 w-10"
            />
            <div>
              <button
                onClick={() => {
                  const authId = post.authorDetails?.id || post.authorDetails?._id || post.author
                  if (authId) onViewProfile?.(authId)
                }}
                className="text-xs font-bold text-slate-900 hover:text-primary-650 hover:underline transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
              >
                {post.authorDetails?.first_name || 'Founder'} {post.authorDetails?.last_name || ''}
              </button>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                @{post.authorDetails?.username || 'user'} • {new Date(post.createdAt || post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-650 text-[9px] font-extrabold uppercase">
            {post.page_type || 'POST'}
          </span>
        </div>

        {/* Post Body */}
        <div className="space-y-2">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">{post.title}</h4>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Tags + Location */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-550 border border-slate-100 rounded font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {post.location && (
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {post.location}
            </span>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            disabled={likeLoading || !currentUser}
            className={`flex items-center gap-1.5 text-xs font-semibold bg-transparent border-none cursor-pointer p-0 transition-all select-none ${
              liked
                ? 'text-rose-500'
                : 'text-slate-400 hover:text-rose-500'
            } disabled:cursor-default disabled:opacity-60`}
            title={!currentUser ? 'Log in to like' : liked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-current scale-110' : ''} ${likeLoading ? 'animate-pulse' : ''}`}
            />
            <span>{likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => canComment && setShowComments(!showComments)}
            disabled={!canComment}
            title={!canComment ? 'Join this community to comment' : 'Toggle comments'}
            className={`flex items-center gap-1.5 text-xs font-semibold bg-transparent border-none p-0 transition-colors ${
              canComment
                ? 'text-slate-400 hover:text-primary-600 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments > 0 ? post.comments : ''} Comments</span>
          </button>
        </div>

        {/* Toggleable Comment Section */}
        {showComments && canComment && (
          <div className="pt-2 border-t border-slate-100/50">
            <CommentSection pageId={post.page_id} currentUser={currentUser} onViewProfile={onViewProfile} />
          </div>
        )}
      </div>
    </Card>
  )
}
