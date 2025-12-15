import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { createNegotiation } from '@/store/catalogSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Scale, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/store/catalogSlice';
import type { Category } from '@/store/catalogSlice';
import type { User } from '@/store/authSlice';

interface NegotiationDialogSectionProps {
  product: Product;
  category: Category | undefined;
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NegotiationDialogSection = ({
  product,
  category,
  user,
  open,
  onOpenChange,
}: NegotiationDialogSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [negotiationQty, setNegotiationQty] = useState(10);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Calculate delivery dates (tomorrow to next 7 days)
  const deliveryDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const handleNegotiate = () => {
    if (!user || user.role !== 'buyer') {
      toast.error('Please sign in as a buyer to negotiate');
      navigate('/login');
      return;
    }

    if (!negotiationPrice || Number(negotiationPrice) <= 0) {
      toast.error('Please enter a valid negotiation price');
      return;
    }

    if (negotiationQty < 10) {
      toast.error('Minimum purchase quantity for negotiation is 10kg');
      return;
    }

    if (!deliveryDate) {
      toast.error('Please select a preferred delivery date');
      return;
    }

    const negotiation = {
      id: `neg-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      currentPrice: product.pricePerKg,
      requestedPrice: Number(negotiationPrice),
      requestedQty: negotiationQty,
      deliveryDate: deliveryDate,
      notes: negotiationNotes,
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(createNegotiation(negotiation));
    toast.success('Negotiation request sent successfully!');
    onOpenChange(false);
    setNegotiationPrice('');
    setNegotiationNotes('');
    setDeliveryDate('');
  };

  if (!product.negotiationEnabled) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            Negotiate Price
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Minimum purchase quantity: <span className="font-semibold text-purple-600">10 kg</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Product Information */}
          <Card className="border border-gray-200 sm:border-2 sm:border-gray-100">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{category?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Quantity Section */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">Quantity (kg) *</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 sm:border-2 sm:border-gray-200 p-1 w-fit sm:w-auto">
                <button
                  onClick={() => setNegotiationQty(Math.max(10, negotiationQty - 1))}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                  disabled={negotiationQty <= 10}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <Input
                  type="number"
                  min="10"
                  max={product.stockQty}
                  value={negotiationQty}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNegotiationQty(Math.max(10, Math.min(product.stockQty, value)));
                  }}
                  className="w-20 sm:w-24 text-center bg-transparent border-0 focus:ring-0 font-semibold text-gray-900 text-sm sm:text-base px-2"
                />
                <button
                  onClick={() => setNegotiationQty(Math.min(product.stockQty, negotiationQty + 1))}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 hover:text-purple-700"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Minimum 10 kg required for negotiation
              </div>
            </div>
          </div>

          {/* Current Price (Readonly) */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">Current Price (per kg)</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={`Rs. ${product.pricePerKg}`}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 text-sm sm:text-base pr-24 font-bold"
                />
                <Badge
                  variant="outline"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap text-xs sm:text-sm bg-green-100 text-green-700 border-green-200"
                >
                  Original Price
                </Badge>
              </div>
            </div>
          </div>

          {/* Negotiation Price (Editable) */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">
              Your Offer Price (per kg) *
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                Rs.
              </div>
              <Input
                type="number"
                value={negotiationPrice}
                onChange={(e) => setNegotiationPrice(e.target.value)}
                className="pl-10 sm:pl-12 text-sm sm:text-base"
                placeholder="Enter your offer price"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Total for {negotiationQty} kg:
              <span className="font-semibold text-gray-900 ml-2">
                Rs. {(Number(negotiationPrice || 0) * negotiationQty).toFixed(2)}
              </span>
            </p>
          </div>

          {/* Delivery Date */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">Preferred Delivery Date *</Label>
            <Select value={deliveryDate} onValueChange={setDeliveryDate}>
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select delivery date" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base max-h-[200px]">
                {deliveryDates.map((date) => (
                  <SelectItem key={date.value} value={date.value} className="text-sm sm:text-base">
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          {/* Seller Information (Readonly) */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">Seller Id</Label>
            <Input
              type="text"
              value={product.sellerId}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-700 text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Your negotiation request will be sent to this seller.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border sm:border-2 text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleNegotiate}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base"
            disabled={!negotiationPrice || !deliveryDate}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Submit Negotiation Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

