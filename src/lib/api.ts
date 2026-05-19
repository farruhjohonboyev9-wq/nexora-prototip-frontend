import type {
  User, Post, Comment, FollowStatus, LikeCount,
  Notification, SearchResult, SearchUser, TrendingHashtag, LoginResponse,
} from './types';

const BASE_URL = import.meta.env.VITE_API_URL; // 🔥 FIX: env orqali
const TOKEN_KEY = 'nexora_token';

let _token: string | null =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem(TOKEN_KEY)
    : null;

export function setToken(token: string | null) {
  _token = token;
  if (typeof localStorage !== 'undefined') {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  return _token;
}

async function req<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const method = options.method || 'GET'; // 🔥 FIX: method default

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    method,
    headers,
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;

    try {
      const err = await res.json();
      msg =
        err?.detail ||
        err?.message ||
        (Array.isArray(err?.detail) ? err.detail[0]?.msg : msg);
    } catch {}

    throw new Error(msg);
  }

  // 🔥 FIX: safer response handling
  const contentType = res.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/* ===================== API ===================== */

export const api = {

  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      req<{ message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      req<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  users: {
    me: () => req<User>('/users/me'),

    updateMe: (data: {
      username?: string;
      bio?: string;
      profile_pic_url?: string;
    }) =>
      req<User>('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    getById: (id: number) => req<User>(`/users/${id}`),
  },

  feed: {
    get: (skip = 0, limit = 20) =>
      req<Post[]>(`/posts?skip=${skip}&limit=${limit}`),

    getPersonalized: (skip = 0, limit = 20) =>
      req<Post[]>(`/feed/personalized?skip=${skip}&limit=${limit}`),

    getUserFeed: (userId: number, skip = 0, limit = 20) =>
      req<Post[]>(`/feed/users/${userId}?skip=${skip}&limit=${limit}`),

    getByEngagement: (skip = 0, limit = 24) =>
      req<Post[]>(`/feed/engagement?skip=${skip}&limit=${limit}`),
  },

  posts: {
    getById: (id: number) => req<Post>(`/posts/${id}`),

    create: (content: string, file?: File) => {
      const fd = new FormData();
      fd.append('content', content);
      if (file) fd.append('file', file);

      return req<Post>('/posts', {
        method: 'POST',
        body: fd,
      });
    },

    update: (id: number, data: { content?: string }) =>
      req<Post>(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      req<void>(`/posts/${id}`, { method: 'DELETE' }),
  },

  likes: {
    like: (postId: number) =>
      req<void>(`/likes/posts/${postId}`, { method: 'POST' }),

    unlike: (postId: number) =>
      req<void>(`/likes/posts/${postId}`, { method: 'DELETE' }),

    getCount: (postId: number) =>
      req<LikeCount>(`/likes/posts/${postId}/count`),
  },

  comments: {
    add: (postId: number, content: string) =>
      req<Comment>(`/comments/posts/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),

    get: (postId: number) =>
      req<Comment[]>(`/comments/posts/${postId}`),

    delete: (commentId: number) =>
      req<void>(`/comments/${commentId}`, { method: 'DELETE' }),
  },

  follows: {
    follow: (userId: number) =>
      req<void>(`/follows/users/${userId}`, { method: 'POST' }),

    unfollow: (userId: number) =>
      req<void>(`/follows/users/${userId}`, { method: 'DELETE' }),

    getStatus: (userId: number) =>
      req<FollowStatus>(`/follows/users/${userId}/status`),
  },

  notifications: {
    get: () => req<Notification[]>('/notifications'),

    getUnreadCount: () =>
      req<{ unread_count: number }>('/notifications/unread/count'),

    markAllRead: () =>
      req<void>('/notifications/read-all', { method: 'PUT' }),

    delete: (id: number) =>
      req<void>(`/notifications/${id}`, { method: 'DELETE' }),
  },

  search: {
    all: (q: string) =>
      req<SearchResult>(`/search?q=${encodeURIComponent(q)}`),

    users: (q: string) =>
      req<SearchUser[]>(`/search/users?q=${encodeURIComponent(q)}`),
  },

  hashtags: {
    trending: () =>
      req<TrendingHashtag[]>('/hashtags/trending'),

    getPosts: (name: string) =>
      req<Post[]>(`/hashtags/${encodeURIComponent(name)}/posts`),
  },
};
