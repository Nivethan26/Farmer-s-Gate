import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AlertCircle, Scale, Loader2, RefreshCw } from 'lucide-react';
import { negotiationAPI } from '@/services/negotiationService';
import { toast } from 'sonner';
import type { Negotiation } from '@/store/catalogSlice';

interface NegotiationsSectionProps {
  t: TFunction;
  getNegotiationStatusColor: (status: string) => string;
}

export const NegotiationsSection = ({ t, getNegotiationStatusColor }: NegotiationsSectionProps) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch buyer negotiations
  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await negotiationAPI.getBuyerNegotiations();
      setNegotiations(data);
    } catch (err) {
      console.error('Failed to fetch negotiations:', err);
      setError('Failed to load negotiations');
      toast.error('Failed to load your negotiations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiations();
    
    // Set up polling to refresh negotiations every 30 seconds
    const interval = setInterval(() => {
      fetchNegotiations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading negotiations...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Negotiations</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Negotiations</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchNegotiations}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {negotiations.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('buyer.noNegotiations')}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {t('buyer.startNegotiating')}
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 mt-6">
              <Link to="/catalog">{t('buyer.browseProducts')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {negotiations.map((negotiation) => (
            <Card key={negotiation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b">
                  <div>
                    <p className="font-semibold text-lg text-gray-900 mb-1">{negotiation.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('buyer.seller')}: <span className="font-medium text-gray-700">{negotiation.sellerName}</span>
                    </p>
                  </div>
                  <Badge className={`${getNegotiationStatusColor(negotiation.status)} border font-medium px-4 py-1.5 h-auto whitespace-normal text-center`}>
                    {t(`buyer.status.${negotiation.status}`)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                    <span className="text-muted-foreground">{t('buyer.currentPrice')}:</span>
                    <span className="font-bold text-gray-900">Rs. {negotiation.currentPrice.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="text-muted-foreground">{t('buyer.yourOffer')}:</span>
                    <span className="font-bold text-green-700">Rs. {negotiation.requestedPrice.toFixed(2)}/kg</span>
                  </div>
                </div>

                {negotiation.status === 'countered' && negotiation.counterPrice && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-900">{t('buyer.counterOfferReceived')}</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      Rs. {negotiation.counterPrice.toFixed(2)}/kg
                    </p>
                    {negotiation.counterNotes && (
                      <p className="text-sm text-blue-700 mt-2">{negotiation.counterNotes}</p>
                    )}
                  </div>
                )}

                {negotiation.notes && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{t('buyer.yourNotes')}</p>
                    <p className="text-sm text-gray-700">{negotiation.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
