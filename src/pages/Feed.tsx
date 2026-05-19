import { useEffect, useState, useCallback } from 'react';
import type { Post } from '@/lib/types';
import { api } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = useCallback(async (skip: number) => {
    try {
      const data = await api.feed.getPersonalized(skip, 12);
      if (skip === 0) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 12);
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    }
  }, []);

  useEffect(() => {
    loadPosts(0).finally(() => setLoading(false));
  }, [loadPosts]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await loadPosts(nextPage * 12);
    setPage(nextPage);
    setLoadingMore(false);
  }

  function removePost(id: number) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground text-sm">{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); loadPosts(0).finally(() => setLoading(false)); }}
          className="gradient-bg text-white px-4 py-2 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="text-5xl">📸</div>
        <p className="font-semibold">No posts yet</p>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          Follow people or create your first post to see content here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={user?.id}
          onPostDeleted={removePost}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</> : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
