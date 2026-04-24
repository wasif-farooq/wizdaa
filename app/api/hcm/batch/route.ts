import { NextRequest, NextResponse } from 'next/server';
import { getAllBalances } from '@/src/lib/hcmStore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  
  if (!employeeId) {
    return NextResponse.json(
      { success: false, error: 'MISSING_PARAMS', message: 'employeeId required' },
      { status: 400 }
    );
  }
  
  if (Math.random() < 0.05) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'HCM temporarily unavailable' },
      { status: 500 }
    );
  }
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const balances = getAllBalances(employeeId);
  
  if (Math.random() < 0.05) {
    const removeIndex = Math.floor(Math.random() * balances.length);
    balances.splice(removeIndex, 1);
  }
  
  return NextResponse.json({ balances });
}