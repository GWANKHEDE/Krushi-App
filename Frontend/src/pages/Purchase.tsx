import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { purchasesAPI, suppliersAPI, productsAPI } from "@/services/api";
import { Product, Supplier } from "@/services/api";
import Loader from "@/services/Loader";
import { Plus, Calendar, DollarSign, Package, UserPlus, Info } from "lucide-react";
import AddSupplierDialog from "@/components/AddSupplierDialog";
import { Badge } from "@/components/ui/badge";

interface PurchaseFormData {
  productId: string;
  quantity: string;
  costPrice: string;
  supplierId: string;
  purchaseDate: string;
  notes: string;
}

export default function Purchase() {
  const [form, setForm] = useState<PurchaseFormData>({
    productId: "",
    quantity: "",
    costPrice: "",
    supplierId: "",
    purchaseDate: new Date().toISOString().split('T')[0], // Today's date
    notes: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const { toast } = useToast();

  // Load products and suppliers
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      const [productsResponse, suppliersResponse] = await Promise.all([
        productsAPI.getAllProducts({ limit: 1000 }),
        suppliersAPI.getAllSuppliers({ limit: 1000 })
      ]);

      setProducts(productsResponse.data.data.products || []);
      setSuppliers(suppliersResponse.data.data.suppliers || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleSupplierAdded = () => {
    loadInitialData(); // Reload to get the new supplier
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // When product is selected, auto-fill the current cost price
  const handleProductChange = (productId: string) => {
    handleChange('productId', productId);

    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      handleChange('costPrice', selectedProduct.costPrice.toString());
    }
  };

  const calculateTotalCost = () => {
    const quantity = parseFloat(form.quantity) || 0;
    const costPrice = parseFloat(form.costPrice) || 0;
    return quantity * costPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.productId || !form.quantity || !form.costPrice || !form.supplierId || !form.purchaseDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(form.quantity) <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(form.costPrice) <= 0) {
      toast({
        title: "Error",
        description: "Cost price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const purchaseData = {
        supplierId: form.supplierId,
        purchaseItems: [
          {
            productId: form.productId,
            quantity: parseInt(form.quantity),
            costPrice: parseFloat(form.costPrice),
            totalCost: calculateTotalCost()
          }
        ],
        totalAmount: calculateTotalCost(),
        purchaseDate: form.purchaseDate,
        notes: form.notes
      };

      await purchasesAPI.createPurchase(purchaseData);

      toast({
        title: "Success",
        description: "Purchase recorded successfully",
      });

      // Reset form
      setForm({
        productId: "",
        quantity: "",
        costPrice: "",
        supplierId: "",
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: "",
      });

      // Load data again to update stock levels in UI immediately
      loadInitialData();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record purchase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <Loader message="Please wait..." />;
  }

  const selectedProduct = products.find(p => p.id === form.productId);
  const selectedSupplier = suppliers.find(s => s.id === form.supplierId);

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Entry</h1>
          <p className="text-muted-foreground mt-1">Record new inventory purchases from suppliers</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                New Purchase Details
              </CardTitle>
              <CardDescription>Fill in the details of the incoming stock</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Supplier Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Supplier Information</Label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Select value={form.supplierId} onValueChange={(value) => handleChange('supplierId', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select supplier..." />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 px-4 border-dashed border-2 hover:border-primary hover:text-primary"
                      onClick={() => setIsAddSupplierOpen(true)}
                      title="Add New Supplier"
                    >
                      <UserPlus className="h-5 w-5" />
                    </Button>
                  </div>
                  {selectedSupplier && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground flex gap-4">
                      {selectedSupplier.contactPerson && <span>👤  {selectedSupplier.contactPerson}</span>}
                      {selectedSupplier.phone && <span>📞 {selectedSupplier.phone}</span>}
                    </div>
                  )}
                </div>

                <div className="h-px bg-border" />

                {/* Product Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Product Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="product">Select Product *</Label>
                      <Select value={form.productId} onValueChange={handleProductChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Search or select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex justify-between w-full gap-8">
                                <span>{product.name}</span>
                                <span className="text-muted-foreground text-xs">Stock: {product.currentStock}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <div className="relative">
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          className="h-11 pr-12"
                          value={form.quantity}
                          onChange={(e) => handleChange('quantity', e.target.value)}
                          placeholder="0"
                          required
                        />
                        {selectedProduct && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {selectedProduct.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Unit Cost (₹) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          min="0.01"
                          className="h-11 pl-9"
                          value={form.costPrice}
                          onChange={(e) => handleChange('costPrice', e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      className="h-11"
                      value={form.purchaseDate}
                      onChange={(e) => handleChange('purchaseDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      className="min-h-[44px] h-11 py-2 resize-none"
                      value={form.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="Inv. Invoice #12345"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/25"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Save Purchase Entry
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Side Panel */}
        <div className="space-y-6">
          {/* Cost Summary Card */}
          <Card className="bg-slate-50 border-none shadow-inner">
            <CardHeader>
              <CardTitle className="text-lg">Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-muted-foreground text-sm">Unit Price</span>
                <span className="font-semibold">₹{parseFloat(form.costPrice || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-muted-foreground text-sm">Quantity</span>
                <span className="font-semibold">{form.quantity || 0} {selectedProduct?.unit || 'Units'}</span>
              </div>

              <div className="h-px bg-slate-200 my-2" />

              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">Total Cost</span>
                <span className="text-2xl font-bold text-green-700">₹{calculateTotalCost().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Help/Info Card */}
          <Card className="border-blue-100 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                <Info className="h-4 w-4" /> Stock Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <div className="space-y-2 text-sm text-blue-900">
                  <div className="flex justify-between">
                    <span>Current Stock:</span>
                    <Badge variant="secondary" className="bg-white">{selectedProduct.currentStock}</Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>After Purchase:</span>
                    <Badge variant="default" className="bg-blue-600">{selectedProduct.currentStock + (parseInt(form.quantity) || 0)}</Badge>
                  </div>
                  <p className="text-xs text-blue-700 mt-2 opacity-80">
                    Average Cost will be updated based on weighted average method.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-blue-700/80">Select a product to view stock impact details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSupplierDialog
        open={isAddSupplierOpen}
        onOpenChange={setIsAddSupplierOpen}
        onSupplierAdded={handleSupplierAdded}
      />
    </div>
  );
}
