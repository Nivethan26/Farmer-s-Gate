import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};
