import { NextRequest, NextResponse } from 'next/server';
import { getAuthApiHeaders } from '@/lib/api/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://allureportal.sawatech.ae/api';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/subscriptions/validate-coupon`, {
      method: 'POST',
      headers: getAuthApiHeaders(request, token),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
