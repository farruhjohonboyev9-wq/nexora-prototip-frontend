import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2, Hash } from 'lucide-react';
import { Link } from 'wouter';
import { api } from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';
import type { Post, SearchUser, TrendingHashtag } from '@/lib/types';

export function Explore() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [trending, setTrending] = useState<TrendingHashtag[]>([]);
  const [gridPosts, setGridPosts] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingGrid, setLoadingGrid] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.feed.getByEngagement(0, 24)
      .then(setGridPosts)
      .catch(() => {})
      .finally(() => setLoadingGrid(false));
    api.hashtags.trending()
      .then(setTrending)
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }
    setSearching(true);
    try {
      const res = await api.search.all(q.trim());
      setUsers(res.users);
      setPosts(res.posts);
    } catch {}
    setSearching(false);
  }, []);

  function handleSearch(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  }

  const hasResults = users.length > 0 || posts.length > 0;
  const showSearch = query.length > 0;

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search people, posts…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {showSearch ? (
        <div className="p-4 space-y-6">
          {/* Users */}
          {users.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">People</p>
              <div className="space-y-3">
                {users.map(u => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-3 hover:bg-secondary/50 p-2 rounded-xl transition-colors">
                    <UserAvatar username={u.username} profilePicUrl={u.profile_pic_url} size={42} gradient />
                    <div>
                      <p className="font-semibold text-sm">{u.username}</p>
                      {u.bio && <p className="text-xs text-muted-foreground line-clamp-1">{u.bio}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {posts.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Posts</p>
              <div className="grid grid-cols-3 gap-1">
                {posts.map(p => (
                  <Link key={p.id} href={`/post/${p.id}`} className="aspect-square">
                    {p.media_url ? (
                      <img src={p.media_url} alt="post" className="w-full h-full object-cover rounded-sm hover:opacity-90 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-secondary rounded-sm flex items-center justify-center p-2 hover:bg-secondary/70 transition-colors">
                        <p className="text-xs text-muted-foreground line-clamp-3 text-center">{p.content}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!hasResults && !searching && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-muted-foreground text-sm">No results for "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Trending hashtags */}
          {trending.length > 0 && (
            <div className="px-4 py-4 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Trending</p>
              <div className="flex flex-wrap gap-2">
                {trending.map(tag => (
                  <Link
                    key={tag.name}
                    href={`/hashtag/${tag.name}`}
                    className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{tag.name}</span>
                    <span className="text-muted-foreground text-xs ml-1">{tag.post_count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          {loadingGrid ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-px bg-border">
              {gridPosts.map(p => (
                <Link key={p.id} href={`/post/${p.id}`} className="aspect-square bg-background">
                  {p.media_url ? (
                    <img src={p.media_url} alt="post" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center p-3 hover:bg-secondary/70 transition-colors">
                      <p className="text-xs text-muted-foreground line-clamp-4 text-center">{p.content}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
