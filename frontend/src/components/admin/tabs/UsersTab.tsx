import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users as UsersIcon, User as UserIcon, Briefcase, Shield, RefreshCw, ChevronDown } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/TableSkeleton';
import { exportToCSV } from '@/utils/adminUtils';
import { userAPI } from '@/services/userService';
import type { Seller } from '@/types/admin';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchUsers } from '@/store/usersSlice';

interface UsersTabProps {
  sellers: Seller[];
  buyers: Seller[];
  agents: Seller[];
  isLoading: boolean;
  onRefresh?: () => Promise<void>;
}

type UserRole = 'all' | 'seller' | 'buyer' | 'agent';

export const UsersTab = ({ sellers, buyers, agents, isLoading, onRefresh }: UsersTabProps) => {
  const dispatch = useAppDispatch();
  const [userSearch, setUserSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState<UserRole>('all');
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  // Combine all users
  const allUsers = useMemo(() => {
    const combined = [
      ...sellers.map(s => ({ ...s, role: 'seller' as const })),
      ...buyers.map(b => ({ ...b, role: 'buyer' as const })),
      ...agents.map(a => ({ ...a, role: 'agent' as const }))
    ];
    return combined;
  }, [sellers, buyers, agents]);

  // Get unique districts from all users
  const districts = useMemo(() => 
    [...new Set(allUsers.map(u => u.district).filter(Boolean))].sort().map(district => ({
      value: district,
      label: district
    })), 
    [allUsers]
  );

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesDistrict = districtFilter === 'all' || user.district === districtFilter;
      const matchesSearch = userSearch === '' || 
        user._id.toLowerCase().includes(userSearch.toLowerCase()) ||
        (user.publicId && user.publicId.toLowerCase().includes(userSearch.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(userSearch.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(userSearch.toLowerCase()));
      return matchesRole && matchesDistrict && matchesSearch;
    });
  }, [allUsers, roleFilter, districtFilter, userSearch]);

  // Count users by role
  const counts = useMemo(() => ({
    all: allUsers.length,
    seller: sellers.length,
    buyer: buyers.length,
    agent: agents.length
  }), [allUsers.length, sellers.length, buyers.length, agents.length]);

  const handleExport = () => {
    exportToCSV(filteredUsers, `users-${roleFilter}`);
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('Users refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh users');
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleExpandUser = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleDeleteUser = async (userId: string, userRole: string) => {
    if (!confirm(`Are you sure you want to delete this ${userRole}? This action cannot be undone.`)) return;
    
    setDeletingUsers(prev => new Set(prev).add(userId));
    
    try {
      const response = await userAPI.deleteUser(userId);
      toast.success(response.message || 'User deleted successfully');
      
      // Refresh users list
      await dispatch(fetchUsers({}));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleToggleStatus = async (userId: string, userRole: string) => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const response = await userAPI.toggleSellerStatus(userId);
      toast.success(response.message || 'User status updated successfully');
      
      // Refresh users list from Redux
      await dispatch(fetchUsers({}));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdatingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    ...districts
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'seller':
        return <Briefcase className="h-3 w-3" />;
      case 'buyer':
        return <UserIcon className="h-3 w-3" />;
      case 'agent':
        return <Shield className="h-3 w-3" />;
      default:
        return <UsersIcon className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'seller':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'buyer':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'agent':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Unified Control Panel */}
      <Card className="dashboard-card">
        <CardHeader className="border-b px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">Users Management</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="h-8 px-2 sm:h-9 sm:px-3 text-xs sm:text-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Role Filter Tabs */}
          <Tabs value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-0.5 sm:p-1">
              <TabsTrigger value="all" className="flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm">
                <UsersIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {roleFilter === 'all' && <span className="hidden sm:block">All</span>}
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {roleFilter === 'seller' && <span className="hidden sm:block">Sellers</span>}
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">{counts.seller}</Badge>
              </TabsTrigger>
              <TabsTrigger value="buyer" className="flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm">
                <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {roleFilter === 'buyer' && <span className="hidden sm:block">Buyers</span>}
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">{counts.buyer}</Badge>
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center justify-center gap-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {roleFilter === 'agent' && <span className="hidden sm:block">Agents</span>}
                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">{counts.agent}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filter Bar */}
          <FilterBar
            searchValue={userSearch}
            onSearchChange={setUserSearch}
            searchPlaceholder="Search by ID, name, or email..."
            filterValue={districtFilter}
            onFilterChange={setDistrictFilter}
            filterOptions={districtOptions}
            filterPlaceholder="All Districts"
            onExport={handleExport}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="dashboard-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : (
            <>
              {/* Desktop/Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Email</TableHead>
                      <TableHead className="hidden xl:table-cell">District</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <UsersIcon className="h-12 w-12 opacity-20" />
                            <p>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id || user._id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-mono text-xs">{user.publicId || user._id}</TableCell>
                          <TableCell>
                            <div className="min-w-[120px]">
                              <p className="font-medium">{user.role === "buyer" ? user.firstName + " " + user.lastName : user.name || 'N/A'}</p>
                              {user.role === 'seller' && user.farmName && (
                                <p className="text-xs text-muted-foreground mt-0.5">{user.farmName}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}>
                              {getRoleIcon(user.role)}
                              <span className="hidden lg:inline">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                            {user.email || 'N/A'}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {user.district ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{user.district}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status || 'active'} />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={user.status === 'active'}
                              onCheckedChange={() => handleToggleStatus(user._id || user.id, user.role)}
                              disabled={updatingUsers.has(user._id || user.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id || user.id, user.role)}
                              disabled={deletingUsers.has(user._id || user.id)}
                              className="min-w-[80px]"
                            >
                              {deletingUsers.has(user._id || user.id) ? 'Deleting...' : 'Delete'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Compact List View */}
              <div className="md:hidden">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <UsersIcon className="h-16 w-16 opacity-20 mb-4" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredUsers.map(user => {
                      const userId = user._id || user.id;
                      const isExpanded = expandedUsers.has(userId);
                      
                      return (
                        <div key={userId} className="transition-colors">
                          {/* Single Row Display */}
                          <div className="flex items-center gap-2 p-2.5 hover:bg-muted/30">
                            {/* User Info - Left Side */}
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-0.5 text-[10px] px-1.5 py-0.5`}>
                                {getRoleIcon(user.role)}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-xs leading-tight truncate">
                                  {user.role === "buyer" ? user.firstName + " " + user.lastName : user.name || 'N/A'}
                                </h3>
                                {user.role === 'seller' && user.farmName && (
                                  <p className="text-[10px] text-muted-foreground truncate">{user.farmName}</p>
                                )}
                              </div>
                            </div>

                            {/* Status and Actions - Right Side */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <StatusBadge status={user.status || 'active'} />
                              <ChevronDown 
                                className={`h-4 w-4 text-muted-foreground transition-transform cursor-pointer ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                                onClick={() => toggleExpandUser(userId)}
                              />
                            </div>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="px-2.5 pb-2.5 space-y-2 bg-muted/20">
                              {/* User ID */}
                              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-background rounded px-2 py-1">
                                <span className="font-semibold">ID:</span>
                                <span className="truncate text-[10px]">{user.publicId || user._id}</span>
                              </div>

                              {/* Details */}
                              <div className="space-y-1.5">
                                {user.email && (
                                  <div className="flex items-start gap-1.5 text-[11px]">
                                    <span className="text-muted-foreground min-w-[45px]">Email:</span>
                                    <span className="font-medium break-all flex-1 text-[11px]">{user.email}</span>
                                  </div>
                                )}
                                {user.district && (
                                  <div className="flex items-center gap-1.5 text-[11px]">
                                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium">{user.district}</span>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-1.5 border-t">
                                <div className="flex items-center gap-1.5 flex-1">
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                      checked={user.status === 'active'}
                                      onCheckedChange={() => handleToggleStatus(userId, user.role)}
                                      disabled={updatingUsers.has(userId)}
                                      className="scale-90"
                                    />
                                  </div>
                                  <span className="text-[11px] font-medium">
                                    {user.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <Button 
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(userId, user.role);
                                  }}
                                  disabled={deletingUsers.has(userId)}
                                  className="h-7 text-[11px] px-2.5"
                                >
                                  {deletingUsers.has(userId) ? 'Deleting...' : 'Delete'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
