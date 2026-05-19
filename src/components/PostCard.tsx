import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link } from 'wouter';
import type { Post } from '@/lib/types';
import { api } from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';
import { timeAgo } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (id: number) => void;
  currentUserId?: number;
}

export function PostCard({ post, onPostDeleted, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);
    try {
      if (liked) {
        await api.likes.unlike(post.id);
        setLikeCount(c => c - 1);
      } else {
        await api.likes.like(post.id);
        setLikeCount(c => c + 1);
      }
      setLiked(l => !l);
    } catch {}
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Bu postni o\'chirasizmi?')) return;
    try {
      await api.posts.delete(post.id);
      onPostDeleted?.(post.id);
    } catch {}
  }

  return (
    <article className="border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={`/profile/${post.author_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <UserAvatar
            username={post.author.username}
            profilePicUrl={post.author.profile_pic_url}
            size={36}
            gradient
          />
          <div>
            <p className="text-sm font-semibold leading-none">{post.author.username}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(post.created_at)}</p>
          </div>
        </Link>
        {currentUserId === post.author_id && (
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Image */}
      {post.media_url && (
        <Link href={`/post/${post.id}`}>
          <img
            src={post.media_url}
            alt="post"
            className="w-full object-cover max-h-[600px] cursor-pointer"
          />
        </Link>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`transition-transform hover:scale-110 active:scale-95 ${liked ? 'text-red-500' : 'text-foreground hover:text-red-400'}`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
            </button>
            <Link href={`/post/${post.id}`} className="text-foreground hover:text-muted-foreground transition-colors">
              <MessageCircle className="w-6 h-6" />
            </Link>
            <button className="text-foreground hover:text-muted-foreground transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setSaved(s => !s)}
            className={`transition-transform hover:scale-110 ${saved ? 'text-foreground' : 'text-foreground hover:text-muted-foreground'}`}
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-foreground' : ''}`} />
          </button>
        </div>

        {likeCount > 0 && (
          <p className="text-sm font-semibold">{likeCount.toLocaleString()} likes</p>
        )}

        {post.content && (
          <p className="text-sm mt-1">
            <Link href={`/profile/${post.author_id}`} className="font-semibold mr-2 hover:underline">
              {post.author.username}
            </Link>
            <span className="text-foreground/90">{post.content}</span>
          </p>
        )}

        {post.comment_count > 0 && (
          <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground mt-1 block hover:text-foreground transition-colors">
            View all {post.comment_count} comments
          </Link>
        )}
      </div>
    </article>
  );
}
