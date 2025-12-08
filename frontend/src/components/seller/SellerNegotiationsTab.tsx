import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { updateNegotiationStatus } from "@/store/catalogSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  User,
  ArrowRightLeft,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SellerNegotiationsTab = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const allNegotiations = useAppSelector((state: RootState) =>
    state.catalog.negotiations.filter((n) => n.sellerId === user?.id)
  );

  const [selected, setSelected] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterNotes, setCounterNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter negotiations based on status
  const negotiations = allNegotiations.filter((n) => {
    if (statusFilter === "all") return true;
    return n.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case "countered":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Countered
          </Badge>
        );
      case "agreed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Agreed
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const openCounter = (n: any) => {
    setSelected(n);
    setCounterPrice(n.requestedPrice.toString());
    setCounterNotes("");
    setOpenDialog(true);
  };

  const sendCounterOffer = () => {
    if (!counterPrice || Number(counterPrice) <= 0) {
      alert("Please enter a valid counter price");
      return;
    }

    if (!selected) return;

    dispatch(
      updateNegotiationStatus({
        id: selected.id,
        status: "countered",
        counterPrice: Number(counterPrice),
        counterNotes,
      })
    );
    setOpenDialog(false);
    setSelected(null);
    setCounterPrice("");
    setCounterNotes("");
  };

  const acceptDeal = (n: any) => {
    dispatch(
      updateNegotiationStatus({
        id: n.id,
        status: "agreed",
        agreedPrice: n.requestedPrice,
      })
    );
  };

  const rejectDeal = (n: any) => {
    dispatch(
      updateNegotiationStatus({
        id: n.id,
        status: "rejected",
      })
    );
  };

  const acceptCounter = (n: any) => {
    if (n.counterPrice) {
      dispatch(
        updateNegotiationStatus({
          id: n.id,
          status: "agreed",
          agreedPrice: n.counterPrice,
        })
      );
    }
  };

  // Calculate statistics
  const stats = {
    total: allNegotiations.length,
    open: allNegotiations.filter(n => n.status === "open").length,
    countered: allNegotiations.filter(n => n.status === "countered").length,
    agreed: allNegotiations.filter(n => n.status === "agreed").length,
    rejected: allNegotiations.filter(n => n.status === "rejected").length,
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Countered</p>
                <p className="text-2xl font-bold text-purple-600">{stats.countered}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <ArrowRightLeft className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Agreed</p>
                <p className="text-2xl font-bold text-green-600">{stats.agreed}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Negotiations
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage price negotiations with buyers
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="countered">Countered</SelectItem>
                  <SelectItem value="agreed">Agreed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {negotiations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {statusFilter === "all" 
                  ? "No negotiations yet" 
                  : `No ${statusFilter} negotiations`}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {statusFilter === "all" 
                  ? "When buyers negotiate on your products, they'll appear here." 
                  : `No negotiations with "${statusFilter}" status found. Try changing the filter.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {negotiations.map((n) => (
                <Card key={n.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Section - Product & Buyer Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-600" />
                              {n.productName}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="h-3 w-3 mr-1" />
                                {n.buyerName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(n.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(n.status)}
                          </div>
                        </div>

                        {/* Price Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Original Price</p>
                            <p className="text-lg font-bold text-gray-800">
                              Rs. {n.currentPrice}/kg
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Buyer's Offer</p>
                            <p className="text-lg font-bold text-blue-700">
                              Rs. {n.requestedPrice}/kg
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {((n.currentPrice - n.requestedPrice) / n.currentPrice * 100).toFixed(1)}% discount requested
                            </p>
                          </div>
                          
                          {n.counterPrice && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">Your Counter</p>
                              <p className="text-lg font-bold text-purple-700">
                                Rs. {n.counterPrice}/kg
                              </p>
                            </div>
                          )}
                          
                          {n.agreedPrice && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">Agreed Price</p>
                              <p className="text-lg font-bold text-green-700">
                                Rs. {n.agreedPrice}/kg
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {n.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Buyer's Message:
                            </p>
                            <p className="text-sm text-gray-600 mt-1 pl-4">{n.notes}</p>
                          </div>
                        )}

                        {n.counterNotes && (
                          <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-700 flex items-center gap-1">
                              <ArrowRightLeft className="h-3 w-3" />
                              Your Counter Message:
                            </p>
                            <p className="text-sm text-purple-600 mt-1 pl-4">{n.counterNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="lg:w-48 flex-shrink-0">
                        <div className="flex flex-col gap-2">
                          {n.status === "open" && (
                            <>
                              <Button 
                                onClick={() => openCounter(n)}
                                className="w-full justify-start"
                                variant="outline"
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Counter Offer
                              </Button>
                              <Button 
                                onClick={() => acceptDeal(n)}
                                className="w-full justify-start bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Offer
                              </Button>
                              <Button 
                                onClick={() => rejectDeal(n)}
                                className="w-full justify-start"
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Offer
                              </Button>
                            </>
                          )}

                          {n.status === "countered" && (
                            <>
                              <Button 
                                onClick={() => acceptCounter(n)}
                                className="w-full justify-start bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Counter
                              </Button>
                              <Button 
                                onClick={() => openCounter(n)}
                                className="w-full justify-start"
                                variant="outline"
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Modify Counter
                              </Button>
                            </>
                          )}

                          {n.status === "agreed" && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm font-medium text-green-700">Deal Agreed! 🎉</p>
                              <p className="text-xs text-green-600 mt-1">
                                Final price: Rs. {n.agreedPrice}/kg
                              </p>
                            </div>
                          )}

                          {n.status === "rejected" && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm font-medium text-red-700">Negotiation Rejected</p>
                              <p className="text-xs text-red-600 mt-1">
                                This offer was declined
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter Offer Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Send Counter Offer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Product: {selected?.productName}</p>
              <p className="text-sm text-gray-600">Buyer: {selected?.buyerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Original Price</label>
                <Input
                  value={`Rs. ${selected?.currentPrice}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buyer's Offer</label>
                <Input
                  value={`Rs. ${selected?.requestedPrice}`}
                  disabled
                  className="bg-blue-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Counter Price (Rs./kg)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Enter your counter price"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="pl-9"
                  min="1"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Suggested: Rs. {selected && Math.round((selected.currentPrice + selected.requestedPrice) / 2)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Message to Buyer (Optional)
                <span className="text-muted-foreground text-xs ml-1">
                  Explain your counter offer
                </span>
              </label>
              <Textarea
                placeholder="e.g., I can offer this price for bulk orders..."
                value={counterNotes}
                onChange={(e) => setCounterNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={sendCounterOffer}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Send Counter Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerNegotiationsTab;