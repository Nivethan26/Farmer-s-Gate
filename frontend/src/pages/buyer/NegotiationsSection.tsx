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
    <div className="space-y-3 sm:space-y-4">
      {negotiations.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 sm:py-16 text-center px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-4 sm:mb-6">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('buyer.noNegotiations')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {t('buyer.browseWholesale')}
            </p>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
              <Link to="/catalog">{t('buyer.browseProducts')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 lg:gap-6">
          {negotiations.map((negotiation) => (
            <Card key={negotiation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base sm:text-lg text-gray-900 mb-1 break-words">{negotiation.productName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Seller: <span className="font-medium text-gray-700">{negotiation.sellerName}</span>
                    </p>
                  </div>
                  <Badge className={`${getNegotiationStatusColor(negotiation.status)} border font-medium px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm whitespace-nowrap`}>
                    {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 uppercase tracking-wide">Current Price</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">Rs. {negotiation.currentPrice}/kg</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Offer</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-700">
                      Rs. {negotiation.requestedPrice}/kg
                    </p>
                  </div>
                </div>

                {negotiation.status === 'countered' && negotiation.counterPrice && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-semibold text-blue-900">Counter Offer Received</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
                      Rs. {negotiation.counterPrice}/kg
                    </p>
                    {negotiation.counterNotes && (
                      <p className="text-xs sm:text-sm text-blue-700 mt-2 break-words">{negotiation.counterNotes}</p>
                    )}
                  </div>
                )}

                {negotiation.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Notes</p>
                    <p className="text-xs sm:text-sm text-gray-700 break-words">{negotiation.notes}</p>
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

