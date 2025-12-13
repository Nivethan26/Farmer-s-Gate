import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AlertCircle } from 'lucide-react';
import type { Negotiation } from '@/store/catalogSlice';

interface NegotiationsSectionProps {
  t: TFunction;
  negotiations: Negotiation[];
  getNegotiationStatusColor: (status: string) => string;
}

export const NegotiationsSection = ({ t, negotiations, getNegotiationStatusColor }: NegotiationsSectionProps) => {
  return (
    <div className="space-y-4">
      {negotiations.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('buyer.noNegotiations')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('buyer.browseWholesale')}
            </p>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
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
                      Seller: <span className="font-medium text-gray-700">{negotiation.sellerName}</span>
                    </p>
                  </div>
                  <Badge className={`${getNegotiationStatusColor(negotiation.status)} border font-medium px-4 py-1.5`}>
                    {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Current Price</p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {negotiation.currentPrice}/kg</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Offer</p>
                    <p className="text-2xl font-bold text-green-700">
                      Rs. {negotiation.requestedPrice}/kg
                    </p>
                  </div>
                </div>

                {negotiation.status === 'countered' && negotiation.counterPrice && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-900">Counter Offer Received</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      Rs. {negotiation.counterPrice}/kg
                    </p>
                    {negotiation.counterNotes && (
                      <p className="text-sm text-blue-700 mt-2">{negotiation.counterNotes}</p>
                    )}
                  </div>
                )}

                {negotiation.notes && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Notes</p>
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
