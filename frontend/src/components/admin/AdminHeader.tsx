import { BarChart3 } from 'lucide-react';

export const AdminHeader = () => (
  <header className="mt-5 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">Admin Dashboard</span>
      </div>
    </div>
  </header>
);