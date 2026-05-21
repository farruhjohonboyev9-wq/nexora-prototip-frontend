// Chat/Messaging API
import { POST, GET, DELETE } from './client';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender?: {
    id: number;
    username: string;
    profile_pic_url?: string;
  };
}

export interface CreateMessageRequest {
  receiver_id: number;
  content: string;
}

// Send message
export async function sendMessage(
  receiverId: number,
  content: string
): Promise<Message> {
  return POST('/chat/messages', {
    receiver_id: receiverId,
    content,
  });
}

// Get messages with user
export async function getMessages(userId: number, skip: number = 0, limit: number = 50): Promise<Message[]> {
  return GET(`/chat/messages/${userId}?skip=${skip}&limit=${limit}`);
}

// Get all conversations
export async function getConversations(): Promise<any[]> {
  return GET('/chat/conversations');
}

// Delete message
export async function deleteMessage(messageId: number): Promise<{ message: string }> {
  return DELETE(`/chat/messages/${messageId}`);
}

// WebSocket connection for real-time chat
export function connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${import.meta.env.VITE_API_URL.split('://')[1]}/chat/ws/chat`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
    // Send auth token on connect
    const token = localStorage.getItem('authToken');
    if (token) {
      ws.send(JSON.stringify({ type: 'auth', token }));
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return ws;
}

// Send WebSocket message
export function sendWebSocketMessage(ws: WebSocket, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.warn('WebSocket not connected');
  }
}
