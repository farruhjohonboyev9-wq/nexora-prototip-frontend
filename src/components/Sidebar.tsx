import { useLocation, Link } from 'wouter';
import {
  Home, Search, PlusSquare, Bell, User, LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';

const navItems = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/create', icon: PlusSquare, label: 'Create' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-[72px] xl:w-60 bg-sidebar border-r border-sidebar-border flex flex-col py-6 px-3 z-50">
      {/* Logo */}
      <div className="mb-8 px-2">
        <span className="hidden xl:block text-2xl font-extrabold gradient-text tracking-tight">Nexora</span>
        <span className="xl:hidden text-2xl font-extrabold gradient-text">N</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = location === href || location.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
              <span className="hidden xl:block text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile + logout */}
      {user && (
        <div className="flex flex-col gap-1 mt-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent transition-colors"
          >
            <UserAvatar username={user.username} profilePicUrl={user.profile_pic_url} size={28} gradient />
            <div className="hidden xl:block overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden xl:block text-sm">Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around py-2 z-50 md:hidden">
      {navItems.map(({ href, icon: Icon }) => {
        const active = location === href || location.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={`p-3 rounded-xl transition-all ${active ? 'text-primary' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'}`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        );
      })}
    </nav>
  );
}
