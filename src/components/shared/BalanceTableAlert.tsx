'use client';

type AlertType = 'error' | 'warning' | 'info';

interface BalanceTableAlertProps {
  type: AlertType;
  message: string;
  currentCount: number;
  expectedCount: number;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
};

const alertIcons: Record<AlertType, string> = {
  error: 'Error loading balances:',
  warning: 'Some balances may be unavailable. Showing',
  info: 'Loading balances...',
};

export function BalanceTableAlert({ type, message, currentCount, expectedCount }: BalanceTableAlertProps) {
  const styles = alertStyles[type];
  const icon = alertIcons[type];

  if (type === 'info') {
    return (
      <div className="bg-blue-50 px-4 py-2 border-l-4 border-blue-400">
        <p className="text-sm text-blue-700">{icon}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.bg} px-4 py-2 border-l-4 ${styles.border}`}>
      <p className={`text-sm ${styles.text}`}>
        ⚠️ {icon} {message || `${currentCount} of ${expectedCount} locations`}
      </p>
    </div>
  );
}