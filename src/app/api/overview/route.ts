import { NextRequest, NextResponse } from 'next/server';
import { getSnapshotByTimeline } from '@/lib/db';
import { TimelineCode } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeline = (searchParams.get('timeline') || 'now') as TimelineCode;
    
    const snapshot = getSnapshotByTimeline(timeline);
    if (!snapshot) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
    }

    return NextResponse.json(snapshot);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
