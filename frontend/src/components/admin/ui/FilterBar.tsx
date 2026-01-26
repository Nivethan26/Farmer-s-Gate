import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download } from 'lucide-react';

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  filterPlaceholder?: string;
  onExport?: () => void;
  children?: ReactNode;
}

export const FilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Filter",
  onExport,
  children
}: FilterBarProps) => (
  <Card className="dashboard-card">
    <CardContent className="pt-6">
      <div className="flex flex-row gap-2">
        {onSearchChange && (
          <div className="flex-1">
            <Label htmlFor="filter-search" className="sr-only">{searchPlaceholder}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="filter-search"
                placeholder={searchPlaceholder}
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
        
        {filterOptions.length > 0 && onFilterChange && (
          <div>
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[50px] lg:w-[180px] px-3">
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span className="ml-2 hidden lg:inline truncate">
                  <SelectValue placeholder={filterPlaceholder} />
                </span>
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {children}
        
        {onExport && (
          <Button variant="outline" onClick={onExport} className="w-[50px] lg:w-auto px-3 lg:px-4">
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="ml-2 hidden lg:inline">Export</span>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);