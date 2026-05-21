// Nexora Cloudflare-Railway Integration
// Complete API client with authentication support

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

// Get stored authentication token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// Core request function
async function fetchAPI<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;
  
  const url = new URL(endpoint, API_BASE_URL).href;
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add Authorization header if token exists
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text() as Promise<T>;
}

// HTTP Methods
export async function GET<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, { ...options, method: 'GET' });
}

export async function POST<T>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function PUT<T>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function PATCH<T>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function DELETE<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, { ...options, method: 'DELETE' });
}

// React Hook
export function useAPI() {
  return {
    get: GET,
    post: POST,
    put: PUT,
    patch: PATCH,
    delete: DELETE,
  };
}
