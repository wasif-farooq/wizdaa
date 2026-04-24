'use client';

interface ActionButtonsProps {
  onApprove: () => void;
  onDeny: () => void;
  isProcessing?: boolean;
  isDisabled?: boolean;
}

export function ActionButtons({ onApprove, onDeny, isProcessing = false, isDisabled = false }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onApprove}
        disabled={isProcessing || isDisabled}
        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Approve'}
      </button>
      <button
        onClick={onDeny}
        disabled={isProcessing || isDisabled}
        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Deny'}
      </button>
    </div>
  );
}