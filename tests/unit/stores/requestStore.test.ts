import { useRequestStore } from '../../../src/stores/requestStore';
import type { TimeOffRequest } from '../../../src/lib/types';

describe('requestStore', () => {
  beforeEach(() => {
    useRequestStore.setState({ requests: [] });
  });

  const createRequest = (overrides: Partial<TimeOffRequest> = {}): TimeOffRequest => ({
    id: 'req-001',
    employeeId: 'emp-001',
    employeeName: 'Alice Johnson',
    locationId: 'loc-ny',
    locationName: 'New York Office',
    requestedDays: 5,
    submittedAt: new Date().toISOString(),
    status: 'idle',
    balanceAtSubmission: 15,
    ...overrides,
  });

  describe('addRequest', () => {
    it('adds a new request', () => {
      useRequestStore.getState().addRequest(createRequest());
      expect(useRequestStore.getState().requests).toHaveLength(1);
    });

    it('adds multiple requests', () => {
      useRequestStore.getState().addRequest(createRequest({ id: 'req-001' }));
      useRequestStore.getState().addRequest(createRequest({ id: 'req-002' }));
      expect(useRequestStore.getState().requests).toHaveLength(2);
    });
  });

  describe('updateRequestStatus', () => {
    it('updates request status', () => {
      useRequestStore.getState().addRequest(createRequest({ id: 'req-001' }));
      useRequestStore.getState().updateRequestStatus('req-001', 'approved');
      expect(useRequestStore.getState().requests[0].status).toBe('approved');
    });

    it('does nothing for non-existent request', () => {
      useRequestStore.getState().addRequest(createRequest({ id: 'req-001' }));
      useRequestStore.getState().updateRequestStatus('req-invalid', 'approved');
      expect(useRequestStore.getState().requests[0].status).toBe('idle');
    });
  });

  describe('removeRequest', () => {
    it('removes a request by id', () => {
      useRequestStore.getState().addRequest(createRequest({ id: 'req-001' }));
      useRequestStore.getState().addRequest(createRequest({ id: 'req-002' }));
      useRequestStore.getState().removeRequest('req-001');
      expect(useRequestStore.getState().requests).toHaveLength(1);
    });
  });

  describe('setRequests', () => {
    it('replaces all requests', () => {
      useRequestStore.getState().addRequest(createRequest({ id: 'req-001' }));
      useRequestStore.getState().setRequests([createRequest({ id: 'req-003' })]);
      expect(useRequestStore.getState().requests).toHaveLength(1);
    });
  });
});