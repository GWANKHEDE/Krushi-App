import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

      const response = await purchasesAPI.createPurchase(purchaseData);
      
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
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p>Loading products and suppliers...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedProduct = products.find(p => p.id === form.productId);
  const selectedSupplier = suppliers.find(s => s.id === form.supplierId);

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>New Purchase Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Supplier Selection */}
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={form.supplierId} onValueChange={(value) => handleChange('supplierId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                      {supplier.contactPerson && ` - ${supplier.contactPerson}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSupplier && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedSupplier.phone && `📞 ${selectedSupplier.phone}`}
                  {selectedSupplier.email && ` • ✉️ ${selectedSupplier.email}`}
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <Label htmlFor="product">Product *</Label>
              <Select value={form.productId} onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} 
                      <span className="text-muted-foreground">
                        {" "}(Stock: {product.currentStock} {product.unit})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Current stock: {selectedProduct.currentStock} {selectedProduct.unit} • 
                  Selling price: ₹{selectedProduct.sellingPrice}
                </div>
              )}
            </div>

            {/* Quantity and Cost Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="e.g. 50"
                  required
                />
                {selectedProduct && (
                  <p className="text-xs text-muted-foreground mt-1">
                    New stock: {selectedProduct.currentStock + (parseInt(form.quantity) || 0)} {selectedProduct.unit}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.costPrice}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                  placeholder="e.g. 500.00"
                  required
                />
              </div>
            </div>

            {/* Total Cost Display */}
            {(form.quantity && form.costPrice) && (
              <div className="p-3 bg-blue-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Purchase Cost:</span>
                  <span className="text-lg font-bold text-blue-700">
                    ₹{calculateTotalCost().toFixed(2)}
                  </span>
                </div>
                {selectedProduct && (
                  <div className="text-sm text-blue-600 mt-1">
                    New average cost: ₹{(
                      (selectedProduct.costPrice * selectedProduct.currentStock + calculateTotalCost()) / 
                      (selectedProduct.currentStock + (parseInt(form.quantity) || 0))
                    ).toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Purchase Date */}
            <div>
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional details about this purchase..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Recording Purchase..." : "Save Purchase Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
