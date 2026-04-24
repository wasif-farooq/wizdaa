'use client';

interface BalanceTableHeaderProps {
  title: string;
  totalDays: number;
}

export function BalanceTableHeader({ title, totalDays }: BalanceTableHeaderProps) {
  return (
    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <span className="text-sm text-gray-500">Total: {totalDays} days</span>
    </div>
  );
}