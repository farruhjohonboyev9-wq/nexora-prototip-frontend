import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Grid, Settings, Loader2, ImagePlus } from 'lucide-react';
import { Link } from 'wouter';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';
import type { Post } from '@/lib/types';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!user) return;
    setBio(user.bio || '');
    setUsername(user.username || '');
    setProfilePicUrl(user.profile_pic_url || '');
    api.feed.getUserFeed(user.id, 0, 24)
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, [user]);

  async function saveProfile() {
    setSaving(true);
    setSaveError('');
    try {
      await api.users.updateMe({
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        profile_pic_url: profilePicUrl.trim() || undefined,
      });
      await refreshUser();
      setEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save');
    }
    setSaving(false);
  }

  if (!user) return null;

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-8 pb-6 border-b border-border">
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0">
            <UserAvatar username={user.username} profilePicUrl={user.profile_pic_url} size={86} gradient />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              <button
                onClick={() => setEditing(e => !e)}
                className="flex items-center gap-1.5 text-sm border border-border px-4 py-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Edit profile
              </button>
            </div>
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <p className="font-bold text-lg leading-none">{posts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">posts</p>
              </div>
            </div>
            {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="mt-6 space-y-3 bg-secondary/40 rounded-2xl p-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Profile picture URL</label>
              <input
                value={profilePicUrl}
                onChange={e => setProfilePicUrl(e.target.value)}
                placeholder="https://…"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            {saveError && <p className="text-destructive text-xs">{saveError}</p>}
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="gradient-bg text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setSaveError(''); }}
                className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts grid */}
      <div>
        <div className="flex items-center border-b border-border px-4 py-3">
          <Grid className="w-4 h-4 mr-2 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Posts</span>
        </div>
        {loadingPosts ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ImagePlus className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No posts yet</p>
            <Link href="/create" className="gradient-bg text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Create post
            </Link>
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
