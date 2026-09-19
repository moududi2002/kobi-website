//apps/admin/src/lib/api/client.ts
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

// In-memory access token (never localStorage)
let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setOnUnauthorized(cb: (() => void) | null) {
  onUnauthorized = cb;
}

/**
 * Attempt to refresh access token using HTTP-only cookie.
 * Returns new access token or null on failure.
 * Deduplicates concurrent refresh calls.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        accessToken = null;
        return null;
      }

      const payload = await res.json();
      const newToken = payload?.data?.accessToken;
      if (!newToken) {
        accessToken = null;
        return null;
      }
      accessToken = newToken;
      return newToken;
    } catch {
      accessToken = null;
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Skip auto-refresh & auth handling */
  skipAuth?: boolean;
  /** Skip JSON.stringify for body */
  rawBody?: BodyInit;
}

async function request<T>(
  path: string,
  options: FetchOptions = {},
  isRetry = false,
): Promise<T> {
  const { body, skipAuth, rawBody, headers, ...rest } = options;
  const url = `${API_URL}${API_PREFIX}${path}`;

  const finalHeaders: Record<string, string> = {
    ...(body !== undefined && !rawBody ? { 'Content-Type': 'application/json' } : {}),
    ...((headers as Record<string, string>) || {}),
  };

  if (!skipAuth && accessToken) {
    finalHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      credentials: 'include',
      headers: finalHeaders,
      body: rawBody ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch (err) {
    throw new ApiError('সার্ভারে সংযোগ করা যাচ্ছে না', 0, err);
  }

  // Handle 401 — try refresh once
  if (res.status === 401 && !skipAuth && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, true);
    }
    // Refresh failed — clear & notify
    onUnauthorized?.();
    throw new ApiError('সেশন শেষ — আবার লগইন করুন', 401);
  }

  if (res.status === 204) return undefined as T;

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // ignore
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
    if ('meta' in payload) return payload as T;
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

export async function tryRefresh(): Promise<boolean> {
  const token = await refreshAccessToken();
  return !!token;
}