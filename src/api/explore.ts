// Explore API Client
import { GET } from './client';

export interface ExplorePost {
  id: number;
  author_id: number;
  content: string;
  media_url?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    profile_pic_url?: string;
  };
  like_count: number;
  comment_count: number;
}

export interface ExploreUser {
  id: number;
  username: string;
  email: string;
  bio?: string;
  profile_pic_url?: string;
  follower_count: number;
  following_count: number;
}

// Get trending posts
export async function getTrendingPosts(skip: number = 0, limit: number = 20): Promise<ExplorePost[]> {
  return GET(`/feed/engagement?skip=${skip}&limit=${limit}`);
}

// Get suggested users
export async function getSuggestedUsers(skip: number = 0, limit: number = 10): Promise<ExploreUser[]> {
  return GET(`/users/suggested?skip=${skip}&limit=${limit}`);
}

// Search posts by hashtag
export async function searchByHashtag(hashtag: string, skip: number = 0, limit: number = 20): Promise<ExplorePost[]> {
  return GET(`/search/posts?query=${encodeURIComponent(hashtag)}&skip=${skip}&limit=${limit}`);
}

// Get posts by engagement (alternative to trending)
export async function getPostsByEngagement(skip: number = 0, limit: number = 20): Promise<ExplorePost[]> {
  return GET(`/feed/engagement?skip=${skip}&limit=${limit}`);
}
