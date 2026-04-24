import { useState, useEffect } from 'react';

export interface DaysInputProps {
  value: number;
  onChange: (days: number) => void;
  maxDays?: number;
  disabled?: boolean;
}

export function DaysInput({
  value,
  onChange,
  maxDays = 30,
  disabled = false,
}: DaysInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    
    if (newValue < 1) {
      setError('Must request at least 1 day');
    } else if (newValue > maxDays) {
      setError(`Cannot request more than ${maxDays} days`);
    } else {
      setError(null);
      onChange(newValue);
    }
  };
  
  return (
    <div>
      <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
        Days Requested
      </label>
      <input
        type="number"
        id="days"
        min="1"
        max={maxDays}
        value={localValue}
        onChange={(e) => handleChange(parseInt(e.target.value) || 1)}
        disabled={disabled}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Maximum: {maxDays} days
      </p>
    </div>
  );
}