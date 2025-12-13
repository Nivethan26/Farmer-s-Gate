import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle, Phone, MapPin, User, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/store/catalogSlice';

interface AgentDialogSectionProps {
  product: Product;
  sellerAgent: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWhatsAppClick: () => void;
}

export const AgentDialogSection = ({
  product,
  sellerAgent,
  open,
  onOpenChange,
  onWhatsAppClick,
}: AgentDialogSectionProps) => {
  if (!sellerAgent) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            Connect with Regional Agent
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Get personalized assistance for your wholesale purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50">
            <CardContent className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl text-gray-900">{sellerAgent.name}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">Regional Agent</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {product.locationDistrict}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Wholesale Specialist
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <p className="font-bold text-lg text-gray-900">{sellerAgent.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coverage Area</p>
                    <p className="font-medium text-gray-900">{sellerAgent.regions.join(', ')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1da851] hover:to-[#0d6e5f] text-white text-lg font-bold shadow-lg shadow-green-500/30"
              onClick={onWhatsAppClick}
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Chat on WhatsApp Now
              <Zap className="ml-2 h-5 w-5 animate-pulse" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 border-green-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => {
                // Copy phone number to clipboard
                if (sellerAgent.phone) {
                  navigator.clipboard.writeText(sellerAgent.phone);
                  toast.success('Phone number copied to clipboard!');
                }
              }}
            >
              <Phone className="mr-2 h-5 w-5" />
              Copy Phone Number
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-2"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

