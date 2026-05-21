// Home/Feed API
import { GET } from './client';

export interface FeedPost {
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

// Get home feed (all posts)
export async function getHomeFeed(
  skip: number = 0,
  limit: number = 20
): Promise<FeedPost[]> {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  return GET(`/posts?${params}`);
}

// Get user's personalized feed
export async function getUserFeed(
  skip: number = 0,
  limit: number = 20
): Promise<FeedPost[]> {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  return GET(`/feed?${params}`);
}
