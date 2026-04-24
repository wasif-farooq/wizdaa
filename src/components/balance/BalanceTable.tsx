import { BalanceTableHeader } from '@/src/components/shared/BalanceTableHeader';
import { BalanceTableAlert } from '@/src/components/shared/BalanceTableAlert';

export interface BalanceTableProps {
  balances: Array<{
    locationId: string;
    locationName: string;
    balanceDays: number;
    lastUpdated: string;
  }>;
  optimisticDeductions: Map<string, number>;
  staleLocations: Set<string>;
  isLoading?: boolean;
  expectedLocations?: number;
  error?: string | null;
}

const EXPECTED_LOCATIONS = 4;

export function BalanceTable({
  balances,
  optimisticDeductions,
  staleLocations,
  isLoading = false,
  expectedLocations = EXPECTED_LOCATIONS,
  error = null,
}: BalanceTableProps) {
  const totalDays = balances.reduce((sum, b) => sum + b.balanceDays, 0);
  const hasPartialData = balances.length < expectedLocations;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <BalanceTableHeader title="Time-Off Balances" totalDays={totalDays} />

      {error && (
        <BalanceTableAlert
          type="error"
          message={error}
          currentCount={balances.length}
          expectedCount={expectedLocations}
        />
      )}

      {!error && hasPartialData && (
        <BalanceTableAlert
          type="warning"
          message=""
          currentCount={balances.length}
          expectedCount={expectedLocations}
        />
      )}

      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days Available
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {balances.map((balance) => {
              const deduction = optimisticDeductions.get(balance.locationId) || 0;
              const isOptimistic = deduction > 0;
              const isStale = staleLocations.has(balance.locationId);

              return (
                <tr key={balance.locationId} className={isOptimistic ? 'bg-yellow-50' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {balance.locationName}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-lg font-semibold ${isOptimistic ? 'text-yellow-600' : 'text-green-600'}`}>
                      {isOptimistic ? Math.max(0, balance.balanceDays - deduction) : balance.balanceDays}
                    </span>
                    {isOptimistic && (
                      <span className="ml-2 text-xs text-gray-400 line-through">{balance.balanceDays}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isStale && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                        Needs refresh
                      </span>
                    )}
                    {isOptimistic && !isStale && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Pending
                      </span>
                    )}
                    {!isStale && !isOptimistic && (
                      <span className="text-xs text-gray-500">
                        {new Date(balance.lastUpdated).toLocaleTimeString()}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}