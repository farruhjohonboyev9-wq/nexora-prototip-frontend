interface UserAvatarProps {
  username: string;
  profilePicUrl?: string | null;
  size?: number;
  gradient?: boolean;
}

export function UserAvatar({ username, profilePicUrl, size = 36, gradient = false }: UserAvatarProps) {
  const initial = username?.[0]?.toUpperCase() ?? '?';

  const style = {
    width: size,
    height: size,
    minWidth: size,
    fontSize: size * 0.4,
  };

  if (profilePicUrl) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${gradient ? 'p-[2px] gradient-bg' : ''}`}
        style={style}
      >
        <img
          src={profilePicUrl}
          alt={username}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${gradient ? 'gradient-bg' : 'bg-gradient-to-br from-purple-600 to-pink-500'}`}
      style={style}
    >
      {initial}
    </div>
  );
}
