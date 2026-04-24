'use client';

interface RequestInfoRowProps {
  label: string;
  value: string | number;
  highlighted?: boolean;
}

export function RequestInfoRow({ label, value, highlighted = false }: RequestInfoRowProps) {
  return (
    <div className={`flex justify-between text-sm ${highlighted ? 'bg-yellow-50 -mx-4 px-4 py-1' : ''}`}>
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${highlighted ? 'text-yellow-700' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}