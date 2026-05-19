import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Grid, Loader2, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'wouter';
import { api } from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import type { User, Post, FollowStatus } from '@/lib/types';

export function UserProfile() {
  const [, params] = useRoute('/profile/:id');
  const userId = Number(params?.id);
  const { user: me } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      api.users.getById(userId),
      api.feed.getUserFeed(userId, 0, 24),
      api.follows.getStatus(userId),
    ]).then(([u, p, fs]) => {
      setUser(u);
      setPosts(p);
      setFollowStatus(fs);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  async function toggleFollow() {
    if (!followStatus || followLoading) return;
    setFollowLoading(true);
    try {
      if (followStatus.is_following) {
        await api.follows.unfollow(userId);
        setFollowStatus(s => s ? { ...s, is_following: false, followers_count: s.followers_count - 1 } : s);
      } else {
        await api.follows.follow(userId);
        setFollowStatus(s => s ? { ...s, is_following: true, followers_count: s.followers_count + 1 } : s);
      }
    } catch {}
    setFollowLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="font-semibold">User not found</p>
      </div>
    );
  }

  const isMe = me?.id === userId;

  return (
    <div>
      <div className="px-4 pt-8 pb-6 border-b border-border">
        <div className="flex items-start gap-8">
          <UserAvatar username={user.username} profilePicUrl={user.profile_pic_url} size={86} gradient />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              {!isMe && (
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-1.5 text-sm px-5 py-1.5 rounded-lg font-semibold transition-all ${
                    followStatus?.is_following
                      ? 'border border-border hover:bg-secondary'
                      : 'gradient-bg text-white hover:opacity-90'
                  } disabled:opacity-60`}
                >
                  {followLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : followStatus?.is_following ? (
                    <><UserMinus className="w-3.5 h-3.5" /> Unfollow</>
                  ) : (
                    <><UserPlus className="w-3.5 h-3.5" /> Follow</>
                  )}
                </button>
              )}
            </div>
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <p className="font-bold text-lg leading-none">{posts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg leading-none">{followStatus?.followers_count ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg leading-none">{followStatus?.following_count ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">following</p>
              </div>
            </div>
            {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center border-b border-border px-4 py-3">
          <Grid className="w-4 h-4 mr-2 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Posts</span>
        </div>
        {posts.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-px bg-border">
            {posts.map(p => (
              <Link key={p.id} href={`/post/${p.id}`} className="aspect-square bg-background">
                {p.media_url ? (
                  <img src={p.media_url} alt="post" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center p-2 hover:bg-secondary/70 transition-colors">
                    <p className="text-xs text-muted-foreground line-clamp-4 text-center">{p.content}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
