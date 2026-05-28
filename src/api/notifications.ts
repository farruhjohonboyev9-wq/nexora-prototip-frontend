// Notifications API Client
import { GET, PUT, DELETE } from './client';

export interface Notification {
  id: number;
  user_id: number;
  actor_id: number;
  type: string;
  target_id?: number;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: number;
    username: string;
    profile_pic_url?: string;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Get notifications
export async function getNotifications(skip: number = 0, limit: number = 20): Promise<Notification[]> {
  return GET(`/notifications?skip=${skip}&limit=${limit}`);
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number): Promise<{ id: number; is_read: boolean }> {
  return PUT(`/notifications/${notificationId}/read`);
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  return PUT('/notifications/read-all');
}

// Get unread count
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  return GET('/notifications/unread/count');
}

// Delete notification
export async function deleteNotification(notificationId: number): Promise<{ message: string }> {
  return DELETE(`/notifications/${notificationId}`);
}
