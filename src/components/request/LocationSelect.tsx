export interface LocationSelectProps {
  locations: Array<{
    id: string;
    name: string;
    balanceDays: number;
  }>;
  value: string;
  onChange: (locationId: string) => void;
  disabled?: boolean;
}

export function LocationSelect({
  locations,
  value,
  onChange,
  disabled = false,
}: LocationSelectProps) {
  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
        Location
      </label>
      <select
        id="location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100"
      >
        <option value="">Select a location</option>
        {locations
          .filter((loc) => loc.balanceDays > 0)
          .map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.balanceDays} days available)
            </option>
          ))}
      </select>
    </div>
  );
}