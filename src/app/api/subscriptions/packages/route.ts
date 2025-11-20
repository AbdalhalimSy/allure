import { NextRequest, NextResponse } from 'next/server';
import { getApiHeaders } from '@/lib/api/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://allureportal.sawatech.ae/api';

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/packages`, {
      method: 'GET',
      headers: getApiHeaders(request),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
