import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MessageSquare, DollarSign, Calendar, User } from 'lucide-react';
import { TableSkeleton } from '../ui/TableSkeleton';
import negotiationAPI from '@/services/negotiationService';
import { toast } from 'sonner';
import type { Negotiation } from '@/store/catalogSlice';

interface NegotiationsTabProps {
  onRefresh?: () => void;
}

export const NegotiationsTab = ({ onRefresh }: NegotiationsTabProps) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'escalated'>('escalated');

  useEffect(() => {
    fetchNegotiations();
  }, [filter]);

  const fetchNegotiations = async () => {
    setIsLoading(true);
    try {
      const response = await negotiationAPI.getNegotiations({});
      const allNegotiations = response.negotiations || [];
      
      // Filter to show only escalated negotiations by default
      const filteredNegotiations = filter === 'escalated' 
        ? allNegotiations.filter((neg: any) => neg.escalatedToAdmin === true)
        : allNegotiations;
      
      setNegotiations(filteredNegotiations);
    } catch (error: any) {
      console.error('Error fetching negotiations:', error);
      toast.error('Failed to load negotiations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'countered':
        return 'bg-yellow-100 text-yellow-800';
      case 'agreed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Negotiations Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage negotiations escalated by agents
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'escalated' ? 'default' : 'outline'}
            onClick={() => setFilter('escalated')}
            size="sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Escalated Only
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Negotiations
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{negotiations.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalated</p>
                <p className="text-2xl font-bold">
                  {negotiations.filter((n: any) => n.escalatedToAdmin).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">
                  {negotiations.filter(n => n.status === 'open').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agreed</p>
                <p className="text-2xl font-bold">
                  {negotiations.filter(n => n.status === 'agreed').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Negotiations Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Original Price</TableHead>
                      <TableHead>Requested Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Escalated</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {negotiations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {filter === 'escalated' 
                            ? 'No escalated negotiations found'
                            : 'No negotiations found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      negotiations.map((negotiation: any) => (
                        <TableRow key={negotiation._id || negotiation.id}>
                          <TableCell className="font-medium">
                            {negotiation.productName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {negotiation.buyerName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {negotiation.sellerName}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(negotiation.currentPrice)}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(negotiation.requestedPrice)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(negotiation.status)}>
                              {negotiation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {negotiation.escalatedToAdmin ? (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(negotiation.escalatedAt || negotiation.createdAt)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {negotiation.escalationReason || negotiation.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {negotiations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {filter === 'escalated' 
                      ? 'No escalated negotiations found'
                      : 'No negotiations found'}
                  </p>
                ) : (
                  negotiations.map((negotiation: any) => (
                    <Card key={negotiation._id || negotiation.id} className="border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{negotiation.productName}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(negotiation.escalatedAt || negotiation.createdAt)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(negotiation.status)}>
                            {negotiation.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Buyer</p>
                            <p className="font-medium">{negotiation.buyerName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Seller</p>
                            <p className="font-medium">{negotiation.sellerName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Original</p>
                            <p className="font-medium">{formatCurrency(negotiation.currentPrice)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Requested</p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(negotiation.requestedPrice)}
                            </p>
                          </div>
                        </div>
                        
                        {negotiation.escalatedToAdmin && (
                          <div className="pt-3 border-t">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-700">Escalated to Admin</p>
                                {negotiation.escalationReason && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {negotiation.escalationReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
