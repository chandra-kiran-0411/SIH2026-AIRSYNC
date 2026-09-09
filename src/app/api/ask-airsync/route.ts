import { NextRequest, NextResponse } from 'next/server';
import { explainAirSyncQuery } from '@/lib/reasoningEngine';
import { logAiQuery, getRecentAiQueries } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const recent = getRecentAiQueries(5);
    return NextResponse.json({ recent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question = (body.question || '').trim();

    if (!question) {
      return NextResponse.json({ error: 'Question cannot be empty' }, { status: 400 });
    }

    const reasoning = explainAirSyncQuery(question);

    // Save to database
    logAiQuery(question, reasoning.answer, reasoning.keyFactors);

    return NextResponse.json({
      question,
      answer: reasoning.answer,
      keyFactors: reasoning.keyFactors,
      confidence: reasoning.confidence,
      meteorologicalBasis: reasoning.meteorologicalBasis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
