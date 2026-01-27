import { toast } from "sonner";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', { 
    style: 'currency', 
    currency: 'LKR', 
    minimumFractionDigits: 0 
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const exportToCSV = <T extends object>(data: T[], filename: string): void => {
  if (data.length === 0) {
    toast.error('No data to export');
    return;
  }
  const headers = Object.keys(data[0] as object);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify((row as Record<string, unknown>)[header] ?? '')).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  toast.success(`Exported ${data.length} records to ${filename}.csv`);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
    suspended: 'bg-red-500/10 text-red-600 border-red-200',
    inactive: 'bg-slate-500/10 text-slate-600 border-slate-200',
    paid: 'bg-blue-500/10 text-blue-600 border-blue-200',
    shipped: 'bg-purple-500/10 text-purple-600 border-purple-200',
    delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
};