'use client';

import { useRoleStore } from '../src/stores';
import { useBatchBalances, useSubmitRequest, useApproveRequest, useDenyRequest, useCurrentBalance } from '../src/hooks';
import { BalanceTable } from '../src/components/balance';
import { RequestForm } from '../src/components/request';
import { PendingRequestsList } from '../src/components/manager';
import { useRequestStore, useBalanceStore } from '../src/stores';
import { EMPLOYEES } from '../src/lib/hcmStore';
import type { SubmitStatus, Balance } from '../src/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

function EmployeeView() {
  const queryClient = useQueryClient();
  const { currentEmployeeId } = useRoleStore();
  const { optimisticDeductions, staleLocations, error } = useBalanceStore();
  
  const { data: balanceData, isLoading } = useBatchBalances(currentEmployeeId, true);
  const submitMutation = useSubmitRequest();
  
  const currentEmployee = EMPLOYEES.find((e) => e.id === currentEmployeeId);
  const employeeName = currentEmployee?.name || 'Employee';
  
  const balances = useMemo(() => (balanceData || []) as Balance[], [balanceData]);
  
  const handleSubmit = async (data: { locationId: string; days: number }) => {
    const location = balances.find((b) => b.locationId === data.locationId);
    
    await submitMutation.mutateAsync({
      employeeId: currentEmployeeId,
      locationId: data.locationId,
      requestedDays: data.days,
      employeeName,
      locationName: location?.locationName || '',
      balanceAtSubmission: location?.balanceDays || 0,
    });
    
    queryClient.invalidateQueries({ queryKey: ['batchBalances', currentEmployeeId] });
  };
  
  const submitStatus: SubmitStatus = submitMutation.isPending
    ? 'submitting'
    : submitMutation.isSuccess
    ? 'success'
    : submitMutation.isError
    ? 'error'
    : 'idle';
  
  const locations = balances.map((b) => ({
    id: b.locationId,
    name: b.locationName,
    balanceDays: b.balanceDays,
  }));
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Time-Off Request</h1>
      <p className="text-gray-600 mb-8">Welcome, {employeeName}</p>
      
      <div className="grid gap-8">
        <BalanceTable
          balances={balances}
          optimisticDeductions={optimisticDeductions}
          staleLocations={staleLocations}
          isLoading={isLoading}
          error={error}
        />
        
        <RequestForm
          locations={locations}
          onSubmit={handleSubmit}
          isSubmitting={submitMutation.isPending}
          submitStatus={submitStatus}
          errorMessage={submitMutation.error?.message}
        />
      </div>
    </div>
  );
}

function ManagerView() {
  const queryClient = useQueryClient();
  const { currentEmployeeId } = useRoleStore();
  const { requests, updateRequestStatus } = useRequestStore();

  const { data: balanceData, isLoading } = useBatchBalances(currentEmployeeId, true);
  const approveMutation = useApproveRequest();
  const denyMutation = useDenyRequest();

  const pendingRequests = requests.filter(
    (r) => r.status === 'optimistic' || r.status === 'pending' || r.status === 'idle'
  );

  const handleApprove = async (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    try {
      const result = await approveMutation.mutateAsync({
        employeeId: request.employeeId,
        locationId: request.locationId,
        requestedDays: request.requestedDays,
      });

      if (result.canApprove) {
        updateRequestStatus(requestId, 'approved');
        queryClient.invalidateQueries({ queryKey: ['batchBalances', request.employeeId] });
      } else {
        updateRequestStatus(requestId, 'hcmRejected');
      }
    } catch {
      updateRequestStatus(requestId, 'hcmRejected');
    }
  };

  const handleDeny = async (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    await denyMutation.mutateAsync({
      requestId,
      employeeId: request.employeeId,
      locationId: request.locationId,
      requestedDays: request.requestedDays,
    });
  };

  const approvedToday = requests.filter(
    (r) => r.status === 'approved' && new Date(r.submittedAt).toDateString() === new Date().toDateString()
  ).length;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Review and approve time-off requests</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Approved Today</p>
          <p className="text-2xl font-bold text-green-600">{approvedToday}</p>
        </div>
      </div>
      
      <PendingRequestsList
        requests={requests}
        onApprove={handleApprove}
        onDeny={handleDeny}
        isProcessing={approveMutation.isPending || denyMutation.isPending}
      />
    </div>
  );
}

export default function HomePage() {
  const { currentRole } = useRoleStore();
  
  return currentRole === 'manager' ? <ManagerView /> : <EmployeeView />;
}