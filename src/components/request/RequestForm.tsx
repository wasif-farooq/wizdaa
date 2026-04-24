'use client';

import { useState, useMemo } from 'react';
import { LocationSelect } from './LocationSelect';
import { DaysInput } from './DaysInput';
import { RequestPreview } from '@/src/components/shared/RequestPreview';
import { StatusMessage } from '@/src/components/shared/StatusMessage';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface RequestFormProps {
  locations: Array<{
    id: string;
    name: string;
    balanceDays: number;
  }>;
  onSubmit: (data: { locationId: string; days: number }) => Promise<any>;
  isSubmitting?: boolean;
  submitStatus?: SubmitStatus;
  errorMessage?: string;
}

export function RequestForm({
  locations,
  onSubmit,
  isSubmitting = false,
  submitStatus = 'idle',
  errorMessage,
}: RequestFormProps) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [requestedDays, setRequestedDays] = useState(1);

  const selectedLocationData = useMemo(
    () => locations.find((l) => l.id === selectedLocation),
    [locations, selectedLocation]
  );

  const maxDays = selectedLocationData?.balanceDays || 30;
  const canSubmit = selectedLocation && requestedDays > 0 && requestedDays <= maxDays && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await onSubmit({
      locationId: selectedLocation,
      days: requestedDays,
    });
  };

  const getStatusMessage = () => {
    switch (submitStatus) {
      case 'submitting':
        return { type: 'info' as const, text: 'Submitting request...' };
      case 'success':
        return { type: 'success' as const, text: 'Request submitted successfully!' };
      case 'error':
        return { type: 'error' as const, text: errorMessage || 'Failed to submit request' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Request Time Off</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationSelect
            locations={locations}
            value={selectedLocation}
            onChange={setSelectedLocation}
            disabled={isSubmitting}
          />

          <DaysInput
            value={requestedDays}
            onChange={setRequestedDays}
            maxDays={maxDays}
            disabled={isSubmitting || !selectedLocation}
          />

          <RequestPreview
            location={selectedLocationData}
            requestedDays={requestedDays}
          />

          {statusMessage && (
            <StatusMessage type={statusMessage.type} text={statusMessage.text} />
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}