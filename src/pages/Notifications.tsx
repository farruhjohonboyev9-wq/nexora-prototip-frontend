import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Loader2, Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';
import { timeAgo } from '@/lib/utils';
import type { Notification } from '@/lib/types';

function getNotifIcon(type: string) {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />;
    case 'follow': return <UserPlus className="w-4 h-4 text-green-400" />;
    default: return <Bell className="w-4 h-4 text-primary" />;
  }
}

function getNotifText(type: string) {
  switch (type) {
    case 'like': return 'liked your post';
    case 'comment': return 'commented on your post';
    case 'follow': return 'started following you';
    default: return 'interacted with you';
  }
}

export function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    api.notifications.get()
      .then(setNotifs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markAllRead() {
    setMarking(true);
    try {
      await api.notifications.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
    setMarking(false);
  }

  async function deleteNotif(id: number) {
    try {
      await api.notifications.delete(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch {}
  }

  const unread = notifs.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div>
          <h1 className="font-bold text-lg">Notifications</h1>
          {unread > 0 && <p className="text-xs text-muted-foreground">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            disabled={marking}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Bell className="w-12 h-12 text-muted-foreground" />
          <p className="font-semibold">No notifications yet</p>
          <p className="text-muted-foreground text-sm">When someone likes or comments on your posts, you'll see it here.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifs.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors ${!notif.is_read ? 'bg-primary/5' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <Link href={`/profile/${notif.actor_id}`}>
                  <UserAvatar username={notif.actor.username} profilePicUrl={notif.actor.profile_pic_url} size={42} gradient />
                </Link>
                <span className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                  {getNotifIcon(notif.notification_type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <Link href={`/profile/${notif.actor_id}`} className="font-semibold hover:underline">
                    {notif.actor.username}
                  </Link>
                  {' '}
                  <span className="text-foreground/80">{getNotifText(notif.notification_type)}</span>
                  {' '}
                  <span className="text-muted-foreground text-xs">{timeAgo(notif.created_at)}</span>
                </p>
              </div>
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full gradient-bg flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
