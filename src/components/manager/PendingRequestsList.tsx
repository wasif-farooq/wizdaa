import type { TimeOffRequest } from '@/src/lib/types';
import { RequestCard } from './RequestCard';
import { EmptyState } from '@/src/components/shared/EmptyState';

export interface PendingRequestsListProps {
  requests: TimeOffRequest[];
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  isProcessing?: boolean;
}

export function PendingRequestsList({
  requests,
  onApprove,
  onDeny,
  isProcessing = false,
}: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="Pending Requests"
        message="No pending requests at this time."
      />
    );
  }

  const pendingRequests = requests.filter(
    (r) => r.status === 'optimistic' || r.status === 'pending' || r.status === 'idle'
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
        <span className="text-sm text-gray-500">{pendingRequests.length} pending</span>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onApprove={onApprove}
            onDeny={onDeny}
            isProcessing={isProcessing}
          />
        ))}
      </div>
    </div>
  );
}