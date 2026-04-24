'use client';

type RequestStatus = 'optimistic' | 'pending' | 'approved' | 'denied' | 'hcmRejected' | 'idle';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusStyles: Record<RequestStatus, string> = {
  optimistic: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  hcmRejected: 'bg-red-100 text-red-800',
  idle: 'bg-gray-100 text-gray-800',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}