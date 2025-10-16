import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Column } from '@/components/common/DataTable';
import { Users, MessageSquare, MapPin, Phone, AlertCircle } from 'lucide-react';

const AgentDashboard = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const allSellers = useAppSelector((state: RootState) => state.users.sellers);
  const negotiations = useAppSelector((state: RootState) => state.catalog.negotiations);
  
  const [selectedNegotiation, setSelectedNegotiation] = useState<any>(null);
  const [note, setNote] = useState('');

  // Filter sellers in agent's regions
  const farmersInRegion = allSellers.filter((seller) =>
    user?.regions?.includes(seller.district)
  );

  // Farmer table columns
  const farmerColumns: Column<any>[] = [
    { header: t('agent.farmer'), accessor: 'name', sortable: true },
    { header: t('profile.farmName'), accessor: 'farmName' },
    { header: t('profile.district'), accessor: 'district', sortable: true },
    { header: t('agent.contact'), accessor: 'phone' },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge className={row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
  ];

  const handleAddNote = (negotiationId: string) => {
    if (!note.trim()) return;
    // In a real app, this would dispatch an action to add the note
    console.log('Adding note to negotiation:', negotiationId, note);
    setNote('');
    setSelectedNegotiation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">{t('agent.dashboard')}</h1>
          <p className="text-muted-foreground">{t('buyer.welcomeBack')}, {user?.name}!</p>
          {user?.regions && (
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Your regions: {user.regions.join(', ')}
              </span>
            </div>
          )}
        </div>

        <Tabs defaultValue="farmers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="farmers">{t('agent.farmersInRegion')}</TabsTrigger>
            <TabsTrigger value="negotiations">
              {t('agent.negotiations')}
              {negotiations.filter((n) => n.status === 'open').length > 0 && (
                <Badge className="ml-2">{negotiations.filter((n) => n.status === 'open').length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Farmers</p>
                    <p className="text-2xl font-bold">{farmersInRegion.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Farmers</p>
                    <p className="text-2xl font-bold">
                      {farmersInRegion.filter((f) => f.status === 'active').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Negotiations</p>
                    <p className="text-2xl font-bold">
                      {negotiations.filter((n) => n.status === 'open').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Farmers in Your Region</CardTitle>
              </CardHeader>
              <CardContent>
                {farmersInRegion.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No farmers in your assigned regions</p>
                  </div>
                ) : (
                  <DataTable
                    data={farmersInRegion}
                    columns={farmerColumns}
                    searchPlaceholder="Search farmers..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-6">
            {negotiations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No negotiation requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {negotiations.map((negotiation) => (
                  <Card key={negotiation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{negotiation.productName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Buyer: {negotiation.buyerName}</span>
                            <span>•</span>
                            <span>Seller: {negotiation.sellerName}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            negotiation.status === 'agreed'
                              ? 'bg-green-100 text-green-800'
                              : negotiation.status === 'countered'
                              ? 'bg-blue-100 text-blue-800'
                              : negotiation.status === 'open'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Price</p>
                          <p className="font-semibold">Rs. {negotiation.currentPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Requested Price</p>
                          <p className="font-semibold text-primary">Rs. {negotiation.requestedPrice}/kg</p>
                        </div>
                        {negotiation.counterPrice && (
                          <div>
                            <p className="text-xs text-muted-foreground">Counter Offer</p>
                            <p className="font-semibold text-blue-600">Rs. {negotiation.counterPrice}/kg</p>
                          </div>
                        )}
                      </div>

                      {negotiation.notes && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Buyer Notes:</p>
                          <p className="text-sm">{negotiation.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedNegotiation(negotiation)}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Add Note
                        </Button>
                        <Button size="sm" variant="outline">
                          Mark as Connected
                        </Button>
                        <Button size="sm" variant="outline" className="text-orange-600">
                          <AlertCircle className="mr-1 h-4 w-4" />
                          Escalate to Admin
                        </Button>
                      </div>

                      {selectedNegotiation?.id === negotiation.id && (
                        <div className="mt-4 p-4 border rounded-lg bg-background">
                          <p className="text-sm font-medium mb-2">Add Quick Note</p>
                          <Textarea
                            placeholder="Enter your note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddNote(negotiation.id)}>
                              Save Note
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedNegotiation(null);
                                setNote('');
                              }}
                            >
                              Cancel
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

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">New Farmer Registration</p>
                      <p className="text-sm text-muted-foreground">
                        A new farmer has registered in your region (Kandy)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Negotiation Update</p>
                      <p className="text-sm text-muted-foreground">
                        A negotiation in your region has been marked as agreed
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Region Assignment</p>
                      <p className="text-sm text-muted-foreground">
                        You have been assigned to a new region: Matale
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Personal: {user?.phone}</span>
                </div>
                {user?.officeContact && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Office: {user.officeContact}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;
