'use client';

export type StatusType = 'success' | 'error' | 'info';

interface StatusMessageProps {
  type: StatusType;
  text: string;
}

const styles: Record<StatusType, string> = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
  info: 'bg-blue-50 text-blue-800',
};

export function StatusMessage({ type, text }: StatusMessageProps) {
  return (
    <div className={`p-3 rounded-md ${styles[type]}`}>
      {text}
    </div>
  );
}