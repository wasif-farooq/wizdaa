export type Role = 'employee' | 'manager';

export interface Location {
  id: string;
  name: string;
}

export interface Balance {
  employeeId: string;
  locationId: string;
  locationName: string;
  balanceDays: number;
  version: number;
  lastUpdated: string;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  requestedDays: number;
  submittedAt: string;
  status: RequestStatus;
  balanceAtSubmission: number;
}

export type RequestStatus = 
  | 'idle' 
  | 'optimistic' 
  | 'pending' 
  | 'approved' 
  | 'denied' 
  | 'hcmRejected';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface HcmBalanceResponse {
  success: boolean;
  balanceDays?: number;
  version?: number;
  lastUpdated?: string;
  error?: string;
  message?: string;
}

export interface HcmBatchResponse {
  balances: Balance[];
}

export interface HcmAnniversaryResponse {
  success: boolean;
  employeeId: string;
  locationId: string;
  bonusDays: number;
}