import { NextResponse } from 'next/server';
import { getForecast72h } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const forecast = getForecast72h();
    return NextResponse.json(forecast);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
