import { NextRequest, NextResponse } from 'next/server';
import { getRegionsByTimeline } from '@/lib/db';
import { TimelineCode } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeline = (searchParams.get('timeline') || 'now') as TimelineCode;

    const regions = getRegionsByTimeline(timeline);
    return NextResponse.json({
      timeline,
      regions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
