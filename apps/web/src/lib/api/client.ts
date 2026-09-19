//apps/web/src/lib/api/client.ts
import type { ApiResponse, PaginatedResponse } from '@kobi/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Next.js cache revalidation in seconds */
  revalidate?: number;
  /** Explicit cache directive */
  cache?: RequestCache;
  /** Next.js tags for revalidation */
  tags?: string[];
}

async function request<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, revalidate, tags, cache, ...rest } = options;

  const url = `${API_URL}${API_PREFIX}${path}`;

  const fetchOptions: RequestInit & { next?: any } = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
    credentials: 'include',
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (cache) {
    fetchOptions.cache = cache;
  } else if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
    if (tags) fetchOptions.next.tags = tags;
  }

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    throw new ApiError(
      'সার্ভারে সংযোগ করা যাচ্ছে না',
      0,
      err,
    );
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // ignore parse error
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      (typeof payload === 'string' ? payload : '') ||
      `HTTP ${res.status}`;
    throw new ApiError(
      Array.isArray(message) ? message.join(', ') : message,
      res.status,
      payload?.errors,
    );
  }

  // Our backend wraps as { success, statusCode, data, meta?, timestamp }
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if ('meta' in payload) {
      return payload as T; // paginated
    }
    return payload.data as T;
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export type ApiClient = typeof apiClient;
export type { ApiResponse, PaginatedResponse };