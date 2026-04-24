import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { RoleToggle } from '@/src/components/ui';

export const metadata: Metadata = {
  title: 'ExampleHR Time-Off',
  description: 'Employee time-off request management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">ExampleHR Time-Off</h1>
                <RoleToggle />
              </div>
            </header>
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}