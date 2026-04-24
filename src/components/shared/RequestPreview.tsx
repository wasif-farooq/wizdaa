'use client';

interface LocationData {
  id: string;
  name: string;
  balanceDays: number;
}

interface RequestPreviewProps {
  location: LocationData | undefined;
  requestedDays: number;
}

export function RequestPreview({ location, requestedDays }: RequestPreviewProps) {
  if (!location || requestedDays <= 0) return null;

  const remaining = Math.max(0, location.balanceDays - requestedDays);

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <p className="text-sm text-gray-600">
        You are requesting <strong>{requestedDays}</strong> days from{' '}
        <strong>{location.name}</strong>. You will have{' '}
        <strong>{remaining}</strong> days remaining.
      </p>
    </div>
  );
}