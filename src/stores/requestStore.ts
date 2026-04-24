import { create } from 'zustand';
import type { TimeOffRequest, RequestStatus } from '../lib/types';

interface RequestState {
  requests: TimeOffRequest[];
  
  addRequest: (request: TimeOffRequest) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  removeRequest: (id: string) => void;
  setRequests: (requests: TimeOffRequest[]) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],

  addRequest: (request) => set((state) => ({
    requests: [...state.requests, request],
  })),

  updateRequestStatus: (id, status) => set((state) => ({
    requests: state.requests.map((r) => 
      r.id === id ? { ...r, status } : r
    ),
  })),

  removeRequest: (id) => set((state) => ({
    requests: state.requests.filter((r) => r.id !== id),
  })),

  setRequests: (requests) => set({ requests }),
}));