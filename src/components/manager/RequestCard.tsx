import type { TimeOffRequest } from '@/src/lib/types';
import { StatusBadge } from '@/src/components/shared/StatusBadge';
import { RequestInfoRow } from '@/src/components/shared/RequestInfoRow';
import { BalanceComparison } from '@/src/components/shared/BalanceComparison';
import { ActionButtons } from '@/src/components/shared/ActionButtons';
import { useCurrentBalance, usePreflightCheck } from '@/src/hooks/useManagerActions';

export interface RequestCardProps {
  request: TimeOffRequest;
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  isProcessing?: boolean;
}

export function RequestCard({
  request,
  onApprove,
  onDeny,
  isProcessing = false,
}: RequestCardProps) {
  const { data: freshBalance, isLoading: balanceLoading } = useCurrentBalance(
    request.employeeId,
    request.locationId
  );

  const { data: preflight, isLoading: preflightLoading } = usePreflightCheck(
    request.employeeId,
    request.locationId,
    request.requestedDays
  );

  const currentBalance = freshBalance?.success ? freshBalance.balanceDays ?? null : null;
  const balanceChanged = currentBalance !== null && currentBalance !== request.balanceAtSubmission;
  const isActionable = request.status !== 'approved' && request.status !== 'denied' && request.status !== 'hcmRejected';
  const canApprove = preflight?.sufficient ?? true;
  const preflightMessage = preflight?.message;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text font-medium text-gray-900">{request.employeeName}</h4>
          <p className="text-sm text-gray-500">ID: {request.employeeId}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="space-y-2 mb-4">
        <RequestInfoRow label="Location:" value={request.locationName} />
        <RequestInfoRow label="Days Requested:" value={request.requestedDays} />
        <RequestInfoRow label="Balance at Submission:" value={`${request.balanceAtSubmission} days`} />

        {balanceLoading ? (
          <RequestInfoRow label="Current Balance:" value="Loading..." />
        ) : (
          <BalanceComparison
            submissionBalance={request.balanceAtSubmission}
            currentBalance={currentBalance}
          />
        )}

        <RequestInfoRow
          label="Submitted:"
          value={new Date(request.submittedAt).toLocaleString()}
        />
      </div>

      {!canApprove && preflightLoading === false && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            {preflightMessage || 'Cannot approve - insufficient balance'}
          </p>
        </div>
      )}

      <ActionButtons
        onApprove={() => onApprove(request.id)}
        onDeny={() => onDeny(request.id)}
        isProcessing={isProcessing}
        isDisabled={!isActionable || !canApprove}
      />
    </div>
  );
}