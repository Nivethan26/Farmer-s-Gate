import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MapPin, Star } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/TableSkeleton';
import { exportToCSV } from '@/utils/adminUtils';
import { userAPI } from '@/services/userService';
import type { Seller } from '@/types/admin';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchUsers } from '@/store/usersSlice';

interface SellersTabProps {
  sellers: Seller[];
  isLoading: boolean;
}

export const SellersTab = ({ sellers, isLoading }: SellersTabProps) => {
  const dispatch = useAppDispatch();
  const [sellerSearch, setSellerSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [updatingSellers, setUpdatingSellers] = useState<Set<string>>(new Set());
  const [deletingSellers, setDeletingSellers] = useState<Set<string>>(new Set());

  // Get unique districts
  const districts = useMemo(() => 
    [...new Set(sellers.map(s => s.district))].sort().map(district => ({
      value: district,
      label: district
    })), 
    [sellers]
  );

  // Filtered sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesDistrict = districtFilter === 'all' || seller.district === districtFilter;
      const matchesSearch = sellerSearch === '' || 
        seller._id.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        (seller.name && seller.name.toLowerCase().includes(sellerSearch.toLowerCase()));
      return matchesDistrict && matchesSearch;
    });
  }, [sellers, districtFilter, sellerSearch]);

  const handleExport = () => {
    exportToCSV(filteredSellers, 'sellers');
  };

  const handleDeleteSeller = async (sellerId: string) => {
    if (!confirm("Are you sure you want to delete this seller? This action cannot be undone.")) return;
    
    setDeletingSellers(prev => new Set(prev).add(sellerId));
    
    try {
      const response = await userAPI.deleteUser(sellerId);
      toast.success(response.message || 'Seller deleted successfully');
      
      // Refresh sellers list
      await dispatch(fetchUsers({}));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete seller');
    } finally {
      setDeletingSellers(prev => {
        const next = new Set(prev);
        next.delete(sellerId);
        return next;
      });
    }
  };

  const handleToggleStatus = async (sellerId: string, currentStatus: string) => {
    setUpdatingSellers(prev => new Set(prev).add(sellerId));
    
    try {
      const response = await userAPI.toggleSellerStatus(sellerId);
      toast.success(response.message || 'Seller status updated successfully');
      
      // Refresh sellers list from Redux
      await dispatch(fetchUsers({}));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update seller status');
    } finally {
      setUpdatingSellers(prev => {
        const next = new Set(prev);
        next.delete(sellerId);
        return next;
      });
    }
  };

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    ...districts
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={sellerSearch}
        onSearchChange={setSellerSearch}
        searchPlaceholder="Search by ID (FG###) or name..."
        filterValue={districtFilter}
        onFilterChange={setDistrictFilter}
        filterOptions={districtOptions}
        filterPlaceholder="All Districts"
        onExport={handleExport}
      />

      <Card className="dashboard-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Farm</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSellers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No sellers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSellers.map(seller => (
                        <TableRow key={seller.id || seller._id}>
                          <TableCell className="font-mono text-sm">{seller._id}</TableCell>
                          <TableCell className="font-medium">{seller.name || 'N/A'}</TableCell>
                          <TableCell>{seller.farmName || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {seller.district || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">N/A</span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={seller.status || 'active'} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={seller.status === 'active'}
                                onCheckedChange={() => handleToggleStatus(seller._id || seller.id, seller.status || 'active')}
                                disabled={updatingSellers.has(seller._id || seller.id)}
                              />
                              <span className="text-sm text-muted-foreground">
                                {seller.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSeller(seller._id || seller.id)}
                              disabled={deletingSellers.has(seller._id || seller.id)}
                            >
                              {deletingSellers.has(seller._id || seller.id) ? 'Deleting...' : 'Delete'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4 p-4">
                {filteredSellers.length === 0 ? (
                  <p className="text-center text-muted-foreground">No sellers found</p>
                ) : (
                  filteredSellers.map(seller => (
                    <div 
                      key={seller._id || seller.id} 
                      className="border rounded-lg p-4 space-y-2 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-mono text-sm font-bold">#{seller._id}</span>
                        <StatusBadge status={seller.status || 'active'} />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{seller.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{seller.farmName || 'N/A'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {seller.district || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">No Rating</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-sm font-medium">Status:</span>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={seller.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(seller._id || seller.id, seller.status || 'active')}
                            disabled={updatingSellers.has(seller._id || seller.id)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {seller.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-2"
                        variant="destructive"
                        onClick={() => handleDeleteSeller(seller._id || seller.id)}
                        disabled={deletingSellers.has(seller._id || seller.id)}
                      >
                        {deletingSellers.has(seller._id || seller.id) ? 'Deleting...' : 'Delete Seller'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};