import { NextRequest, NextResponse } from 'next/server';
import { startAnniversaryTimer, stopAnniversaryTimer } from '@/src/lib/anniversaryBackground';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Anniversary background timer is running server-side',
    intervalMs: 45000,
  });
}