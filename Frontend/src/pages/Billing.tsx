import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useBilling } from "@/hooks/useBilling";
import Loader from "@/services/Loader";
import { Product, CreateSaleData } from "@/services/api";
import { BillingHistory } from "@/components/BillingHistory";
import { PDFGenerator } from "@/components/PDFGenerator";
import { History, Receipt } from "lucide-react";

interface SelectedProduct extends Product {
  quantity: number;
}

export default function Billing() {
  const { products, customers, loading, error, createSale } = useBilling();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("new-bill");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [billPreview, setBillPreview] = useState<any | null>(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "UPI">("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter active products with stock and search
  const availableProducts = products.filter(
    (product) =>
      product.isActive &&
      product.currentStock > 0 &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.currentStock) {
          toast({
            title: "Insufficient Stock",
            description: `Only ${product.currentStock} units available`,
            variant: "destructive",
          });
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleIncrement = (id: string) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const product = products.find((p) => p.id === id);
          if (product && item.quantity >= product.currentStock) {
            toast({
              title: "Insufficient Stock",
              description: `Only ${product.currentStock} units available`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const handleDecrement = (id: string) => {
    setSelectedProducts((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const product = products.find((p) => p.id === id);
          if (product && quantity > product.currentStock) {
            toast({
              title: "Insufficient Stock",
              description: `Only ${product.currentStock} units available`,
              variant: "destructive",
            });
            return { ...item, quantity: product.currentStock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce(
      (total, item) => total + item.quantity * item.sellingPrice,
      0
    );
  };

  const taxRate = 0.18;

  const handlePreviewBill = () => {
    const isNewCustomer = selectedCustomer === "new" || !selectedCustomer;

    if (isNewCustomer && !customerName.trim()) {
      toast({ title: "Customer Name Required", variant: "destructive" });
      return;
    }

    if (!isNewCustomer && !selectedCustomer) {
      toast({ title: "Select a Customer", variant: "destructive" });
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const bill = {
      customerName: !isNewCustomer
        ? customers.find((c) => c.id === selectedCustomer)?.name
        : customerName,
      customerPhone: !isNewCustomer
        ? customers.find((c) => c.id === selectedCustomer)?.phone
        : customerPhone,
      customerId: !isNewCustomer ? selectedCustomer : undefined,
      items: selectedProducts,
      subtotal,
      tax,
      totalDiscount: 0,
      overallDiscount: 0,
      grandTotal: total,
      paymentMethod,
      createdAt: new Date().toLocaleDateString(),
    };

    setBillPreview(bill);
    setLastInvoiceNumber(null); // Reset until confirmed
    setShowModal(true);
  };

  const handleConfirmAndCreate = async () => {
    if (!billPreview) return;
    setIsProcessing(true);

    try {
      const isNewCustomer = selectedCustomer === "new" || !selectedCustomer;
      const saleData: CreateSaleData = {
        customerId: !isNewCustomer && selectedCustomer ? selectedCustomer : undefined,
        customerName: isNewCustomer ? customerName : undefined,
        customerPhone: isNewCustomer ? customerPhone : undefined,
        saleItems: selectedProducts.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.sellingPrice,
          totalPrice: item.quantity * item.sellingPrice,
        })),
        subtotal: billPreview.subtotal,
        taxAmount: billPreview.tax,
        totalAmount: billPreview.grandTotal,
        paymentMethod: paymentMethod,
        paymentStatus: "PAID",
        notes: "Bill created via Admin Panel",
      };

      const result = await createSale(saleData);
      setLastInvoiceNumber(result.data.invoiceNumber || "INV-####");

      toast({
        title: "Bill Created",
        description: "Invoice generated successfully. You can now download PDF.",
      });

      // Clear input fields but keep modal open for PDF
      setSelectedProducts([]);
      setCustomerName("");
      setCustomerPhone("");
      setSelectedCustomer("");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) return <Loader message="Loading billing module..." />;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="new-bill">
              <Receipt className="mr-2 h-4 w-4" /> New Bill
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" /> Billing History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* NEW BILL TAB */}
        <TabsContent value="new-bill" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <Input
                placeholder="Search products by name or SKU..."
                className="h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Products Grid */}
              <Card className="max-h-[600px] overflow-y-auto">
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableProducts.map((product) => (
                    <div key={product.id} className="border p-3 rounded-lg hover:shadow-md transition-all bg-card text-card-foreground">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm line-clamp-2 min-h-[40px]">{product.name}</h4>
                        <Badge variant={product.currentStock <= 5 ? "destructive" : "secondary"}>
                          {product.currentStock}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-green-700 mb-2">₹{product.sellingPrice}</p>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddProduct(product)}
                        disabled={product.currentStock === 0}
                      >
                        {product.currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  ))}
                  {availableProducts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No products found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Cart & Checkout */}
            <div className="space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">Customer Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">+ New Customer</SelectItem>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(!selectedCustomer || selectedCustomer === "new") && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <Input
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card className="flex flex-col h-[500px]">
                <CardHeader className="py-3 bg-muted/30 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Cart ({getTotalItems()})</CardTitle>
                    <Badge variant="outline" className="text-base font-bold">₹{calculateSubtotal().toFixed(2)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                  {selectedProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 p-8">
                      <Receipt className="h-12 w-12 opacity-20" />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {selectedProducts.map((item) => (
                        <div key={item.id} className="p-3 flex justify-between items-center bg-card">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">₹{item.sellingPrice} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleDecrement(item.id)}>-</Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleIncrement(item.id)}>+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                {/* Footer Totals */}
                <div className="p-4 border-t bg-muted/10 space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (18%)</span>
                      <span>₹{(calculateSubtotal() * taxRate).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">₹{(calculateSubtotal() * (1 + taxRate)).toFixed(2)}</span>
                  </div>

                  <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full h-12 text-lg font-bold shadow-lg"
                    disabled={selectedProducts.length === 0}
                    onClick={handlePreviewBill}
                  >
                    Generate Bill
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <BillingHistory />
        </TabsContent>
      </Tabs>

      {/* INVOICE PREVIEW MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          {billPreview && (
            <div className="space-y-6">
              {!lastInvoiceNumber ? (
                /* Preview Mode */
                <div className="border p-8 rounded-lg text-center space-y-4 max-w-lg mx-auto bg-muted/10">
                  <h3 className="text-xl font-bold">Review Bill Details</h3>
                  <div className="text-left space-y-2 text-sm bg-white p-4 rounded shadow-sm border">
                    <p><strong>Customer:</strong> {billPreview.customerName}</p>
                    <p><strong>Items:</strong> {billPreview.items.length}</p>
                    <p><strong>Total Amount:</strong> ₹{billPreview.grandTotal.toFixed(2)}</p>
                    <p><strong>Payment:</strong> {billPreview.paymentMethod}</p>
                  </div>
                  <Button
                    onClick={handleConfirmAndCreate}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isProcessing ? "Creating Invoice..." : "Confirm & Create Invoice"}
                  </Button>
                </div>
              ) : (
                /* Success Mode - PDF Generator */
                <PDFGenerator
                  billData={billPreview}
                  invoiceNumber={lastInvoiceNumber}
                  customerPhone={billPreview.customerPhone || ""}
                  onSuccess={() => {
                    // Optional: close modal automatically or keep open for manual close
                  }}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
