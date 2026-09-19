// apps/admin/src/app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    const backendRes = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: refreshToken ? `refresh_token=${refreshToken}` : '',
      },
      credentials: 'include',
    });

    const payload = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      const response = NextResponse.json(
        payload || { success: false, message: 'Refresh failed' },
        { status: backendRes.status },
      );
      response.cookies.delete('refresh_token');
      return response;
    }

    const response = NextResponse.json(payload, { status: 200 });

    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Internal error' },
      { status: 500 },
    );
  }
}