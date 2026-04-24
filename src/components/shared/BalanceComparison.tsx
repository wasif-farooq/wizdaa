'use client';

interface BalanceComparisonProps {
  submissionBalance: number;
  currentBalance: number | null;
}

export function BalanceComparison({ submissionBalance, currentBalance }: BalanceComparisonProps) {
  if (currentBalance === null || currentBalance === undefined) return null;

  const balanceChanged = currentBalance !== submissionBalance;

  return (
    <div className={balanceChanged ? 'bg-yellow-50 -mx-4 px-4 py-1' : ''}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Current Balance:</span>
        <span className={`font-medium ${balanceChanged ? 'text-yellow-700' : 'text-gray-900'}`}>
          {currentBalance} days
          {balanceChanged && <span className="text-xs ml-1 text-yellow-600">(changed)</span>}
        </span>
      </div>
    </div>
  );
}