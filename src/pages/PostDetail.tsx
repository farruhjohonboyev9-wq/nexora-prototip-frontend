import { useEffect, useState, FormEvent } from 'react';
import { useRoute, Link } from 'wouter';
import { Heart, Send, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';
import { timeAgo } from '@/lib/utils';
import type { Post, Comment, LikeCount } from '@/lib/types';

export function PostDetail() {
  const [, params] = useRoute('/post/:id');
  const postId = Number(params?.id);
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeData, setLikeData] = useState<LikeCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!postId) return;
    Promise.all([
      api.posts.getById(postId),
      api.comments.get(postId),
      api.likes.getCount(postId),
    ]).then(([p, c, l]) => {
      setPost(p);
      setComments(c);
      setLikeData(l);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  async function toggleLike() {
    if (!likeData || liking) return;
    setLiking(true);
    try {
      if (likeData.is_liked) {
        await api.likes.unlike(postId);
        setLikeData(l => l ? { ...l, is_liked: false, like_count: l.like_count - 1 } : l);
      } else {
        await api.likes.like(postId);
        setLikeData(l => l ? { ...l, is_liked: true, like_count: l.like_count + 1 } : l);
      }
    } catch {}
    setLiking(false);
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const c = await api.comments.add(postId, commentText.trim());
      setComments(prev => [...prev, c]);
      setCommentText('');
    } catch {}
    setSubmitting(false);
  }

  async function deleteComment(id: number) {
    try {
      await api.comments.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="font-semibold">Post not found</p>
        <Link href="/feed" className="text-primary text-sm hover:underline">Back to feed</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <div className="border-b border-border px-4 py-3">
        <Link href="/feed" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Post header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Link href={`/profile/${post.author_id}`}>
            <UserAvatar username={post.author.username} profilePicUrl={post.author.profile_pic_url} size={40} gradient />
          </Link>
          <div>
            <Link href={`/profile/${post.author_id}`} className="font-semibold text-sm hover:underline">
              {post.author.username}
            </Link>
            <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        {/* Image */}
        {post.media_url && (
          <img src={post.media_url} alt="post" className="w-full object-contain max-h-[520px] bg-black" />
        )}

        {/* Actions */}
        <div className="px-4 py-3 border-b border-border">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 transition-all ${likeData?.is_liked ? 'text-red-500' : 'text-foreground hover:text-red-400'}`}
          >
            <Heart className={`w-6 h-6 ${likeData?.is_liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm font-semibold">{likeData?.like_count ?? 0} likes</span>
          </button>
          {post.content && (
            <p className="text-sm mt-2">
              <Link href={`/profile/${post.author_id}`} className="font-semibold mr-2 hover:underline">
                {post.author.username}
              </Link>
              {post.content}
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="divide-y divide-border">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-3 px-4 py-3 group">
              <Link href={`/profile/${c.author_id}`}>
                <UserAvatar username={c.author.username} profilePicUrl={c.author.profile_pic_url} size={32} />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <Link href={`/profile/${c.author_id}`} className="font-semibold mr-2 hover:underline">
                    {c.author.username}
                  </Link>
                  {c.content}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(c.created_at)}</p>
              </div>
              {user?.id === c.author_id && (
                <button
                  onClick={() => deleteComment(c.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Comment input */}
        <form onSubmit={submitComment} className="sticky bottom-0 bg-background border-t border-border px-4 py-3 flex items-center gap-3">
          {user && <UserAvatar username={user.username} profilePicUrl={user.profile_pic_url} size={32} />}
          <input
            type="text"
            placeholder="Add a comment…"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            maxLength={500}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            className="text-primary font-semibold text-sm disabled:opacity-40 flex items-center gap-1"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
