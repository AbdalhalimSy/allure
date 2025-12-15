import { NextRequest, NextResponse } from 'next/server';
import { getAuthApiHeaders } from '@/lib/api/headers';
import { env } from '@/lib/config/env';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await request.json();

    const res = await fetch(`${env.apiBaseUrl}/subscriptions/validate-coupon`, {
      method: 'POST',
      headers: getAuthApiHeaders(request, token),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    logger.error('Error validating coupon', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
