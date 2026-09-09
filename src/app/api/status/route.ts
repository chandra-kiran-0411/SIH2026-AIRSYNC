import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    region: 'Delhi NCR',
    telemetrySources: [
      { name: 'CPCB CAAQMS Grid', status: 'SYNCHRONIZED', latency: '42ms', stationsOnline: 40 },
      { name: 'NASA FIRMS VIIRS/MODIS', status: 'ACTIVE', latency: '128ms', fireAnomaliesNw: 248 },
      { name: 'ECMWF / CAMS Atmospheric Forecast', status: 'UPDATED', interval: '3-hourly' },
      { name: 'IMD Synoptic Surface Observations', status: 'STREAMING', windVector: 'NW at 6 km/h' },
      { name: 'AirSync Physics & Causal Inference', status: 'OPERATIONAL', modelConfidence: '94.2%' }
    ],
    lastSync: new Date().toISOString()
  });
}
