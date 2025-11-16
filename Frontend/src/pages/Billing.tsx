import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useBilling } from "@/hooks/useBilling";
import Loader from "@/services/Loader";
import { Product, Customer, CreateSaleData } from "@/services/api";

interface SelectedProduct extends Product {
  quantity: number;
}

export default function Billing() {
  const { products, customers, loading, error, createSale, createCustomer } =
    useBilling();
  const { toast } = useToast();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [billPreview, setBillPreview] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "UPI">(
    "CASH"
  );
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

  const handleGenerateBill = () => {
    // Validate customer info
    if (!selectedCustomer && !customerName) {
      toast({
        title: "Customer Information Required",
        description: "Please select a customer or enter customer name",
        variant: "destructive",
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const bill = {
      customerName: selectedCustomer
        ? customers.find((c) => c.id === selectedCustomer)?.name
        : customerName,
      customerPhone: selectedCustomer
        ? customers.find((c) => c.id === selectedCustomer)?.phone
        : customerPhone,
      customerId:
        selectedCustomer && selectedCustomer !== "new"
          ? selectedCustomer
          : undefined,
      items: selectedProducts,
      subtotal,
      tax,
      total,
      paymentMethod,
      createdAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setBillPreview(bill);
    setShowModal(true);
  };

  const handleProcessPayment = async () => {
    if (!billPreview) return;

    setIsProcessing(true);
    try {
      const saleData: CreateSaleData = {
        customerId: billPreview.customerId,
        customerName: billPreview.customerName,
        customerPhone: billPreview.customerPhone,
        saleItems: selectedProducts.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.sellingPrice,
          totalPrice: item.quantity * item.sellingPrice,
        })),
        subtotal: billPreview.subtotal,
        taxAmount: billPreview.tax,
        totalAmount: billPreview.total,
        paymentMethod: paymentMethod,
        paymentStatus: "PAID",
        notes: `Bill generated on ${new Date().toLocaleString()}`,
      };

      const result = await createSale(saleData);

      toast({
        title: "Bill Generated Successfully",
        description: `Invoice #${result.data.invoiceNumber} created`,
      });

      // Reset form
      setSelectedProducts([]);
      setCustomerName("");
      setCustomerPhone("");
      setSelectedCustomer("");
      setSearchTerm("");
      setShowModal(false);
      setBillPreview(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

  if (loading) {
      return <Loader message="Please wait..." />;
    }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Krushi Billing System</h1>
        <Badge variant="secondary" className="text-lg">
          Items: {getTotalItems()} | Total: ₹{calculateSubtotal().toFixed(2)}
        </Badge>
      </div>

      {/* Customer Info */}
      <Card className="mb-6">
        <CardHeader className="border-b border-border pb-2 mb-1">
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select Existing Customer
            </label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ New Customer</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}{" "}
                    {customer.phone ? `(${customer.phone})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedCustomer === "new" || !selectedCustomer) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name *</label>
                <Input
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Search */}
      <Card className="mb-6">
        <CardHeader className="border-b border-border pb-2 mb-1">
          <CardTitle>Product Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card className="mb-6">
        <CardHeader className="border-b border-border pb-2 mb-1">
          <CardTitle className="flex justify-between items-center">
            <span>Available Products ({availableProducts.length})</span>
            <Badge variant="outline">{availableProducts.length} products</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className="border p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2 border-b border-border pb-2 border-green-200 ">
                    <h4 className="font-medium text-sm leading-tight text-center">
                      {product.name}
                    </h4>
                    <Badge
                      variant={
                        product.currentStock <= product.lowStockAlert
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      Stock: {product.currentStock}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    SKU: {product.sku}
                  </p>
                  <p className="text-sm font-semibold text-green-600 mb-3">
                    ₹{product.sellingPrice}/{product.unit}
                  </p>
                  {selectedProducts.find((p) => p.id === product.id) ? (
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecrement(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="font-medium text-sm">
                        {
                          selectedProducts.find((p) => p.id === product.id)
                            ?.quantity
                        }
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIncrement(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddProduct(product)}
                      className="w-full text-sm "
                      disabled={product.currentStock === 0}
                      size="sm"
                    >
                      {product.currentStock === 0
                        ? "Out of Stock"
                        : "Add to Bill"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Selected Items ({selectedProducts.length})</span>
              <Badge variant="default">
                Total: ₹{calculateSubtotal().toFixed(2)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProducts.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border p-4 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.sellingPrice}/{item.unit} | Stock:{" "}
                    {item.currentStock}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecrement(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={item.currentStock}
                      className="w-16 text-center h-8"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIncrement(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                  <span className="font-medium w-20 text-right">
                    ₹{(item.quantity * item.sellingPrice).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">
                  ₹{calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span className="font-medium">
                  ₹{(calculateSubtotal() * taxRate).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Grand Total:</span>
                <span className="text-green-600">
                  ₹{(calculateSubtotal() * (1 + taxRate)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <div className="flex gap-2">
                {(["CASH", "CARD", "UPI"] as const).map((method) => (
                  <Button
                    key={method}
                    type="button"
                    variant={paymentMethod === method ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method)}
                    className="flex-1"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateBill}
              className="w-full"
              size="lg"
              disabled={!customerName && !selectedCustomer}
            >
              {!customerName && !selectedCustomer
                ? "Enter Customer Details"
                : `Generate Bill - ₹${(
                    calculateSubtotal() *
                    (1 + taxRate)
                  ).toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Bill Preview */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🧾 Bill Preview
            </DialogTitle>
          </DialogHeader>
          {billPreview && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2 border-b pb-4">
                <h2 className="text-2xl font-bold">Krushi Seva Kendra</h2>
                <p className="text-muted-foreground">
                  Gandhi Chowk, Nanded, Maharashtra - 431601
                </p>
                <p className="text-sm">GSTIN: 27ABCDE1234F1Z5</p>
                <p className="text-sm text-muted-foreground">
                  {billPreview.createdAt}
                </p>
              </div>

              {/* Customer & Payment Info */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {billPreview.customerName || "Walk-in Customer"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {billPreview.customerPhone || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <p>
                    <strong>Method:</strong> {billPreview.paymentMethod}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600 font-semibold">
                      To be Paid
                    </span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-left font-semibold">#</th>
                      <th className="p-3 text-left font-semibold">Product</th>
                      <th className="p-3 text-left font-semibold">Qty</th>
                      <th className="p-3 text-left font-semibold">Rate</th>
                      <th className="p-3 text-left font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billPreview.items.map(
                      (item: SelectedProduct, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="p-3">{idx + 1}</td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.sku}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="p-3">
                            ₹{item.sellingPrice.toFixed(2)}
                          </td>
                          <td className="p-3 font-medium">
                            ₹{(item.quantity * item.sellingPrice).toFixed(2)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{billPreview.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{billPreview.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Grand Total:</span>
                  <span className="text-green-600">
                    ₹{billPreview.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Edit Bill
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm & Print Bill"
                  )}
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                <p>Thank you for your business!</p>
                <p>For queries, contact: +91-9876543210</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
