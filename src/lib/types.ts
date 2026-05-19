export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  profile_pic_url?: string | null;
  created_at: string;
}

export interface UserBasic {
  id: number;
  username: string;
  profile_pic_url?: string | null;
}

export interface Post {
  id: number;
  author_id: number;
  content: string;
  media_url?: string | null;
  created_at: string;
  updated_at: string;
  author: UserBasic;
  like_count: number;
  comment_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: UserBasic;
}

export interface FollowStatus {
  is_following: boolean;
  followers_count: number;
  following_count: number;
}

export interface LikeCount {
  post_id: number;
  like_count: number;
  is_liked: boolean;
}

export interface Notification {
  id: number;
  notification_type: string;
  actor_id: number;
  post_id?: number | null;
  comment_id?: number | null;
  is_read: boolean;
  created_at: string;
  actor: UserBasic;
}

export interface SearchUser {
  id: number;
  username: string;
  profile_pic_url?: string | null;
  bio?: string | null;
}

export interface SearchResult {
  users: SearchUser[];
  posts: Post[];
  hashtags: string[];
}

export interface TrendingHashtag {
  name: string;
  post_count: number;
  rank: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
