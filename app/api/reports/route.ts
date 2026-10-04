import { NextResponse } from 'next/server';
import { listReports } from '@/lib/reports';

// Selalu scan ulang folder agar file baru dari AI langsung terdeteksi
export const dynamic = 'force-dynamic';

export async function GET() {
  const reports = await listReports();
  return NextResponse.json(reports);
}
