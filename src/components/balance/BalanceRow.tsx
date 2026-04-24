export interface BalanceRowProps {
  locationId: string;
  locationName: string;
  balanceDays: number;
  lastUpdated: string;
  isOptimistic?: boolean;
  optimisticDays?: number;
  isStale?: boolean;
  isLoading?: boolean;
}

export function BalanceRow({
  locationId,
  locationName,
  balanceDays,
  lastUpdated,
  isOptimistic = false,
  optimisticDays = 0,
  isStale = false,
  isLoading = false,
}: BalanceRowProps) {
  const effectiveDays = isOptimistic ? Math.max(0, balanceDays - optimisticDays) : balanceDays;
  
  if (isLoading) {
    return (
      <tr className="animate-pulse">
        <td className="px-4 py-3 text-sm text-gray-500">{locationName}</td>
        <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-12"></div></td>
        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      </tr>
    );
  }
  
  return (
    <tr className={isOptimistic ? 'bg-yellow-50' : ''}>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{locationName}</td>
      <td className="px-4 py-3">
        <span className={`text-lg font-semibold ${isOptimistic ? 'text-yellow-600' : 'text-green-600'}`}>
          {effectiveDays}
        </span>
        {isOptimistic && (
          <span className="ml-2 text-xs text-gray-400 line-through">{balanceDays}</span>
        )}
      </td>
      <td className="px-4 py-3">
        {isStale && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
            Needs refresh
          </span>
        )}
        {!isStale && lastUpdated && (
          <span className="text-xs text-gray-500">
            {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </td>
    </tr>
  );
}