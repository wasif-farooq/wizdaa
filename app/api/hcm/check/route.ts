import { NextRequest, NextResponse } from 'next/server';
import { checkBalance } from '@/src/lib/hcmStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, locationId, requestedDays } = body;

    if (!employeeId || !locationId || !requestedDays) {
      return NextResponse.json(
        { sufficient: false, availableBalance: 0, requestedDays: 0, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (Math.random() < 0.05) {
      return NextResponse.json(
        { sufficient: false, availableBalance: 0, requestedDays, message: 'HCM temporarily unavailable' },
        { status: 500 }
      );
    }

    const result = checkBalance(employeeId, locationId, requestedDays);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { sufficient: false, availableBalance: 0, requestedDays: 0, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}