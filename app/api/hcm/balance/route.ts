import { NextRequest, NextResponse } from 'next/server';
import { getBalanceRecord, updateBalance } from '@/src/lib/hcmStore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const locationId = searchParams.get('locationId');
  
  if (!employeeId || !locationId) {
    return NextResponse.json(
      { success: false, error: 'MISSING_PARAMS', message: 'employeeId and locationId required' },
      { status: 400 }
    );
  }
  
  if (Math.random() < 0.05) {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'HCM temporarily unavailable' },
      { status: 500 }
    );
  }
  
  const balance = getBalanceRecord(employeeId, locationId);
  
  if (!balance) {
    return NextResponse.json(
      { success: false, error: 'NOT_FOUND', message: 'Balance not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    balanceDays: balance.balanceDays,
    version: balance.version,
    lastUpdated: balance.lastUpdated,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, locationId, requestedDays } = body;
    
    if (!employeeId || !locationId || !requestedDays) {
      return NextResponse.json(
        { success: false, error: 'MISSING_PARAMS', message: 'employeeId, locationId, and requestedDays required' },
        { status: 400 }
      );
    }
    
    const result = updateBalance(employeeId, locationId, requestedDays);
    
    if (!result.success) {
      const status = result.error === 'INSUFFICIENT_BALANCE' ? 400 : 500;
      return NextResponse.json(result, { status });
    }
    
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_REQUEST', message: 'Invalid request body' },
      { status: 400 }
    );
  }
}