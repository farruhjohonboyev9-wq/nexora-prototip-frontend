import React from 'react';

// Nexora API Client - Production Ready
// Handles all HTTP requests with authentication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Get stored authentication token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || localStorage.getItem('token');
}

// Build request headers with auth
function buildHeaders(options: RequestOptions): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if not skipped
  if (!options.skipAuth) {
    const token = getAuthToken();
    if (token) {
      const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['Authorization'] = tokenValue;
    }
  }

  return headers;
}

// Parse response with proper error handling
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  if (contentType?.includes('text')) {
    return (await response.text()) as T;
  }

  return response.json();
}

// Core fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  // Construct full URL
  let url = endpoint;
  if (!endpoint.startsWith('http')) {
    url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  console.log(`[API] ${fetchOptions.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: buildHeaders({ skipAuth, ...fetchOptions }),
    });

    // Parse response
    const data = await parseResponse<T>(response);

    // Handle error responses
    if (!response.ok) {
      const error: ApiError = {
        message: (data as any)?.message || `HTTP ${response.status}`,
        status: response.status,
        data: data,
      };
      
      console.error(`[API Error] ${response.status}:`, error.message);
      throw error;
    }

    console.log(`[API Success] ${response.status}`);
    return data;
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error as ApiError;
    }
    
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    };
    
    console.error('[API Network Error]:', apiError.message);
    throw apiError;
  }
}

// HTTP Methods
export async function GET<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, { ...options, method: 'GET' });
}

export async function POST<T = any>(
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

export async function PUT<T = any>(
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

export async function PATCH<T = any>(
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

export async function DELETE<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, { ...options, method: 'DELETE' });
}

// React Hook with loading and error states
export function useAPI() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);

  const execute = React.useCallback(async <T,>(
    fn: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get: React.useCallback((endpoint: string, options?: RequestOptions) =>
      execute(() => GET(endpoint, options)), [execute]),
    post: React.useCallback((endpoint: string, body?: any, options?: RequestOptions) =>
      execute(() => POST(endpoint, body, options)), [execute]),
    put: React.useCallback((endpoint: string, body?: any, options?: RequestOptions) =>
      execute(() => PUT(endpoint, body, options)), [execute]),
    patch: React.useCallback((endpoint: string, body?: any, options?: RequestOptions) =>
      execute(() => PATCH(endpoint, body, options)), [execute]),
    delete: React.useCallback((endpoint: string, options?: RequestOptions) =>
      execute(() => DELETE(endpoint, options)), [execute]),
  };
}

export default {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  useAPI,
};
