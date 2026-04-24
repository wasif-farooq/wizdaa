import { NextRequest, NextResponse } from 'next/server';
import { denyRequest } from '@/src/lib/hcmStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, locationId, requestedDays, requestId } = body;

    if (!employeeId || !locationId || !requestedDays) {
      return NextResponse.json(
        { success: false, error: 'MISSING_PARAMS', message: 'employeeId, locationId, and requestedDays required' },
        { status: 400 }
      );
    }

    if (Math.random() < 0.05) {
      return NextResponse.json(
        { success: false, error: 'SERVER_ERROR', message: 'HCM temporarily unavailable' },
        { status: 500 }
      );
    }

    const result = denyRequest(employeeId, locationId, requestedDays);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: 'INVALID_REQUEST', message: 'Invalid request body' },
      { status: 400 }
    );
  }
}