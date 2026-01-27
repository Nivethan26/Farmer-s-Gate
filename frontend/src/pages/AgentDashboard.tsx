import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DataTable, Column } from '@/components/common/DataTable';
import { Users, MessageSquare, MapPin, Phone, CheckCircle, Flag, Search, User, Mail, Save } from 'lucide-react';
import { toast } from 'sonner';
import agentService from '@/services/agentService';
import { userAPI } from '@/services/userService';
import { updateUserProfile } from '@/store/authSlice';
import { ChangePasswordForm } from '@/components/common/ChangePasswordForm';

const AgentDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  
  const [selectedNegotiation, setSelectedNegotiation] = useState<any>(null);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    officeContact: user?.officeContact || '',
  });
  
  // Data from API
  const [farmersInRegion, setFarmersInRegion] = useState<any[]>([]);
  const [buyersInRegion, setBuyersInRegion] = useState<any[]>([]);
  const [regionalNegotiations, setRegionalNegotiations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch regional data on component mount
  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        setIsLoading(true);
        
        console.log('Agent district:', user?.district);
        console.log('Fetching regional data for agent...');
        
        // Fetch users (sellers/buyers) in agent's region
        const usersData = await agentService.getRegionalUsers();
        console.log('Users data received:', usersData);
        console.log('Sellers count:', usersData?.sellers?.length || 0);
        console.log('Buyers count:', usersData?.buyers?.length || 0);
        
        setFarmersInRegion(usersData.sellers || []);
        setBuyersInRegion(usersData.buyers || []);
        
        // Fetch negotiations in agent's region
        const negotiationsData = await agentService.getRegionalNegotiations();
        console.log('Negotiations data received:', negotiationsData);
        console.log('Negotiations count:', negotiationsData?.length || 0);
        
        setRegionalNegotiations(negotiationsData || []);
        
      } catch (error: any) {
        console.error('Failed to fetch regional data:', error);
        console.error('Error details:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to load regional data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'agent') {
      fetchRegionalData();
    }
  }, [user?.role, user?.district]);

  // Filtered farmers based on search and filters
  const filteredFarmers = useMemo(() => {
    return farmersInRegion.filter((farmer) => {
      const matchesSearch = searchTerm === '' || 
        farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.phone?.includes(searchTerm) ||
        farmer.district?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
      const matchesDistrict = districtFilter === 'all' || farmer.district === districtFilter;
      
      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [farmersInRegion, searchTerm, statusFilter, districtFilter]);

  // Get unique districts from farmers in region
  const availableDistricts = useMemo(() => 
    [...new Set(farmersInRegion.map(f => f.district))].sort(),
    [farmersInRegion]
  );

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        officeContact: user.officeContact || '',
      });
    }
  }, [user]);

  // Farmer table columns
  const farmerColumns: Column<any>[] = [
    { header: 'Farmer Name', accessor: 'name', sortable: true },
    { header: 'Contact Number', accessor: 'phone' },
    { header: 'District', accessor: 'district', sortable: true },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge className={row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleAddNote = async (negotiationId: string) => {
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }
    
    try {
      await agentService.addNegotiationNote(negotiationId, note);
      toast.success('Note added successfully');
      setNote('');
      setSelectedNegotiation(null);
      
      // Refresh negotiations
      const negotiationsData = await agentService.getRegionalNegotiations();
      setRegionalNegotiations(negotiationsData || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add note');
    }
  };

  const handleMarkAsConnected = async (negotiationId: string) => {
    try {
      await agentService.markNegotiationAsConnected(negotiationId);
      toast.success('Negotiation marked as connected');
      
      // Refresh negotiations
      const negotiationsData = await agentService.getRegionalNegotiations();
      setRegionalNegotiations(negotiationsData || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark as connected');
    }
  };

  const handleEscalateToAdmin = async (negotiationId: string) => {
    const reason = prompt('Please provide a reason for escalation:');
    if (!reason) return;
    
    try {
      await agentService.escalateNegotiation(negotiationId, reason);
      toast.success('Negotiation escalated to admin');
      
      // Refresh negotiations
      const negotiationsData = await agentService.getRegionalNegotiations();
      setRegionalNegotiations(negotiationsData || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to escalate negotiation');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.phone) {
      toast.error('Name and phone are required');
      return;
    }

    setIsSavingProfile(true);
    try {
      // Update profile using Redux thunk which handles the API call
      await dispatch(updateUserProfile(profileData)).unwrap();
      
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || '',
      phone: user?.phone || '',
      officeContact: user?.officeContact || '',
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins mb-2">{t('agent.dashboard')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('buyer.welcomeBack')}, {user?.name}!</p>
          {user?.district && (
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground break-words">
                {t('agent.yourAssignedDistrict')}: <strong>{user.district}</strong>
              </span>
            </div>
          )}
          {user?.regions && user.regions.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground break-words">
                {t('agent.regions')}: {user.regions.join(', ')}
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                <p className="text-sm sm:text-base text-muted-foreground">{t('agent.loadingRegionalData')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="farmers" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="farmers" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <span className="truncate">{t('agent.farmers')}</span>
                <Badge className="ml-1 sm:ml-2 text-xs" variant="secondary">{farmersInRegion.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="negotiations" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <span className="truncate">{t('agent.negotiations')}</span>
                {regionalNegotiations.filter((n) => n.status === 'open').length > 0 && (
                  <Badge className="ml-1 sm:ml-2 text-xs">{regionalNegotiations.filter((n) => n.status === 'open').length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="truncate hidden sm:inline">{t('agent.profile')}</span>
              </TabsTrigger>
            </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6">
              <Card>
                <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('agent.totalFarmers')}</p>
                    <p className="text-xl sm:text-2xl font-bold">{farmersInRegion.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className="rounded-full bg-green-100 p-2 sm:p-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('agent.activeFarmers')}</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {farmersInRegion.filter((f) => f.status === 'active').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('agent.openNegotiations')}</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {regionalNegotiations.filter((n) => n.status === 'open').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t('agent.farmersInYourDistrict')}</CardTitle>
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('agent.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 sm:pl-10 text-sm"
                    />
                  </div>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] text-sm">
                      <SelectValue placeholder={t('common.district')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('agent.allDistricts')}</SelectItem>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] text-sm">
                      <SelectValue placeholder={t('common.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('agent.allStatus')}</SelectItem>
                      <SelectItem value="active">{t('agent.active')}</SelectItem>
                      <SelectItem value="inactive">{t('agent.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {filteredFarmers.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm sm:text-base text-muted-foreground px-4">
                      {searchTerm || statusFilter !== 'all' || districtFilter !== 'all' 
                        ? t('agent.noFarmersMatch')
                        : t('agent.noFarmersInDistrict')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      {t('agent.showingFarmers', { count: filteredFarmers.length, total: farmersInRegion.length })}
                    </p>
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <DataTable
                        data={filteredFarmers}
                        columns={farmerColumns}
                        searchPlaceholder={t('agent.searchFarmers')}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t('agent.priceNegotiations')}</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {t('agent.monitorNegotiations')}
                </p>
              </CardHeader>
            </Card>

            {regionalNegotiations.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center">
                  <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                  <p className="text-sm sm:text-base text-muted-foreground">{t('agent.noNegotiations')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {regionalNegotiations.map((negotiation) => (
                  <Card key={negotiation.id || negotiation._id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-base sm:text-lg break-words">{negotiation.productName}</p>
                          <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                            {/* Buyer Information */}
                            <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-200">
                              <p className="text-xs font-semibold text-blue-900 mb-1.5">👤 {t('agent.buyerInformation')}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <div className="break-words">
                                  <span className="text-blue-600 font-medium">{t('agent.name')}:</span>
                                  <span className="ml-1 sm:ml-2 text-blue-900">{negotiation.buyerDetails?.name || negotiation.buyerName}</span>
                                </div>
                                {negotiation.buyerDetails?.phone && (
                                  <div className="flex items-center gap-1 break-all">
                                    <Phone className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                    <span className="text-blue-900">{negotiation.buyerDetails.phone}</span>
                                  </div>
                                )}
                                {negotiation.buyerDetails?.district && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-blue-600" />
                                    <span className="text-blue-900">{negotiation.buyerDetails.district}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Seller Information */}
                            <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                              <p className="text-xs font-semibold text-green-900 mb-1.5">🌾 {t('agent.farmerSellerInformation')}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <div className="break-words">
                                  <span className="text-green-600 font-medium">{t('agent.name')}:</span>
                                  <span className="ml-1 sm:ml-2 text-green-900">{negotiation.sellerDetails?.name || negotiation.sellerName}</span>
                                </div>
                                {negotiation.sellerDetails?.phone && (
                                  <div className="flex items-center gap-1 break-all">
                                    <Phone className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <span className="text-green-900">{negotiation.sellerDetails.phone}</span>
                                  </div>
                                )}
                                {negotiation.sellerDetails?.district && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-green-600" />
                                    <span className="text-green-900">{negotiation.sellerDetails.district}</span>
                                  </div>
                                )}
                                {negotiation.sellerDetails?.farmName && (
                                  <div className="col-span-3">
                                    <span className="text-green-600 font-medium">{t('agent.farm')}:</span>
                                    <span className="ml-1 sm:ml-2 text-green-900">{negotiation.sellerDetails.farmName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`text-xs sm:text-sm shrink-0 ${
                            negotiation.status === 'agreed'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : negotiation.status === 'countered'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : negotiation.status === 'open'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-muted/50 rounded-lg border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t('agent.currentPrice')}</p>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">Rs. {negotiation.currentPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t('agent.requestedPrice')}</p>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg text-primary">Rs. {negotiation.requestedPrice}/kg</p>
                        </div>
                        {negotiation.counterPrice && (
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs text-muted-foreground mb-0.5 sm:mb-1">{t('agent.counterOffer')}</p>
                            <p className="font-semibold text-sm sm:text-base lg:text-lg text-blue-600">Rs. {negotiation.counterPrice}/kg</p>
                          </div>
                        )}
                      </div>

                      {negotiation.notes && (
                        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-xs font-medium text-blue-900 mb-1">{t('agent.buyerNotes')}:</p>
                          <p className="text-xs sm:text-sm text-blue-800 break-words">{negotiation.notes}</p>
                        </div>
                      )}

                      {negotiation.agentNotes && (
                        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-purple-50 border border-purple-100 rounded-lg">
                          <p className="text-xs font-medium text-purple-900 mb-1">{t('agent.yourNotes')}:</p>
                          <p className="text-xs sm:text-sm text-purple-800 break-words">{negotiation.agentNotes}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedNegotiation(negotiation)}
                          className="border-blue-200 hover:bg-blue-50 text-xs sm:text-sm w-full sm:w-auto"
                        >
                          <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{t('agent.addInternalNote')}</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsConnected(negotiation.id || negotiation._id)}
                          className="border-green-200 hover:bg-green-50 text-green-700 text-xs sm:text-sm w-full sm:w-auto"
                          disabled={negotiation.agentConnected}
                        >
                          <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{negotiation.agentConnected ? t('agent.alreadyConnected') : t('agent.markAsConnected')}</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEscalateToAdmin(negotiation.id || negotiation._id)}
                          className="border-orange-200 hover:bg-orange-50 text-orange-700 text-xs sm:text-sm w-full sm:w-auto"
                          disabled={negotiation.escalatedToAdmin}
                        >
                          <Flag className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{negotiation.escalatedToAdmin ? t('agent.alreadyEscalated') : t('agent.escalateToAdmin')}</span>
                        </Button>
                      </div>

                      {(selectedNegotiation?.id === negotiation.id || selectedNegotiation?._id === negotiation._id) && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
                          <p className="text-xs sm:text-sm font-medium mb-2 text-purple-900">{t('agent.addInternalNote')}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {t('agent.internalNoteVisible')}
                          </p>
                          <Textarea
                            placeholder={t('agent.enterInternalNote')}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="mb-2 bg-white text-sm"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button size="sm" onClick={() => handleAddNote(negotiation.id || negotiation._id)} className="text-xs sm:text-sm w-full sm:w-auto">
                              {t('agent.saveNote')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedNegotiation(null);
                                setNote('');
                              }}
                              className="text-xs sm:text-sm w-full sm:w-auto"
                            >
                              {t('agent.cancel')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{t('agent.agentProfile')}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                      {t('agent.managePersonalInfo')}
                    </p>
                  </div>
                  {!isEditingProfile ? (
                    <Button onClick={() => setIsEditingProfile(true)} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                      {t('agent.editProfile')}
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isSavingProfile} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                        {t('agent.cancel')}
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSavingProfile} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        {isSavingProfile ? t('agent.saving') : t('agent.saveChanges')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Personal Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">{t('agent.personalInformation')}</h3>
                  
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    {/* Name - Editable */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm">{t('agent.fullName')} *</Label>
                      {isEditingProfile ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder={t('agent.enterFullName')}
                          className="text-sm"
                        />
                      ) : (
                        <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs sm:text-sm font-medium break-words">{user?.name || t('agent.notProvided')}</p>
                        </div>
                      )}
                    </div>

                    {/* Email - Read Only */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">{t('agent.emailReadOnly')}</Label>
                      <div className="p-2 sm:p-3 bg-muted/30 rounded-lg border border-muted">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <p className="text-xs sm:text-sm font-medium break-all">{user?.email || t('agent.notProvided')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Phone - Editable */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="phone" className="text-xs sm:text-sm">{t('agent.phoneNumber')} *</Label>
                      {isEditingProfile ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder={t('agent.enterPhone')}
                          className="text-sm"
                        />
                      ) : (
                        <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs sm:text-sm font-medium break-all">{user?.phone || t('agent.notProvided')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Office Contact - Editable */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="officeContact" className="text-xs sm:text-sm">{t('agent.officeContact')}</Label>
                      {isEditingProfile ? (
                        <Input
                          id="officeContact"
                          value={profileData.officeContact}
                          onChange={(e) => setProfileData({ ...profileData, officeContact: e.target.value })}
                          placeholder={t('agent.enterPhone')}
                          className="text-sm"
                        />
                      ) : (
                        <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs sm:text-sm font-medium break-all">{user?.officeContact || t('agent.notProvided')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignment Information - Read Only */}
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t">
                  <h3 className="text-base sm:text-lg font-semibold">{t('agent.assignmentInformation')}</h3>
                  
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    {/* District - Read Only */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">{t('agent.assignedDistrict')}</Label>
                      <div className="p-2 sm:p-3 bg-muted/30 rounded-lg border border-muted">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <p className="text-xs sm:text-sm font-medium break-words">{user?.district || t('agent.notAssigned')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Regions - Read Only */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm">{t('agent.regions')}</Label>
                      <div className="p-2 sm:p-3 bg-muted/30 rounded-lg border border-muted">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <p className="text-xs sm:text-sm font-medium break-words">
                            {user?.regions && user.regions.length > 0 ? user.regions.join(', ') : t('agent.notAssigned')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm text-blue-900">
                      <strong>{t('common.note')}:</strong> {t('agent.assignmentNote')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Section */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t('agent.changePassword')}</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                  {t('agent.updatePasswordDescription')}
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
