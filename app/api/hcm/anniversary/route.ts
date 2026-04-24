import { NextRequest, NextResponse } from 'next/server';
import { triggerAnniversaryBonus } from '@/src/lib/hcmStore';
import '@/src/lib/anniversaryBackground';

export async function POST(request: NextRequest) {
  const result = triggerAnniversaryBonus();
  
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: 'TRIGGER_FAILED', message: 'Failed to trigger anniversary bonus' },
      { status: 500 }
    );
  }
  
  return NextResponse.json(result);
}