import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockProducts } from '@/data/mockData';

export default function Billing() {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billPreview, setBillPreview] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

const handleAddProduct = (product: any) => {
  setSelectedProducts((prev) => {
    const index = prev.findIndex((item) => item.id === product.id);
    if (index > -1) {
      const updated = [...prev];
      updated[index].quantity += 1;
      return updated;
    }
    return [...prev, { ...product, quantity: 1 }];
  });
};

const handleIncrement = (id: string) => {
  setSelectedProducts((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};

const handleDecrement = (id: string) => {
  setSelectedProducts((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  const handleQuantityChange = (index: number, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = quantity;
    setSelectedProducts(updated);
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const taxRate = 0.18;

  const handleGenerateBill = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const bill = {
      customerName,
      customerPhone,
      items: selectedProducts,
      subtotal,
      tax,
      total,
      createdAt: new Date().toLocaleString(),
    };
    setBillPreview(bill);
    setShowModal(true); // Open modal
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Krushi Billing System</h1>

      {/* Customer Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-md">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-muted-foreground">
                ₹{product.price}/{product.unit}
              </p>
              {selectedProducts.find((p) => p.id === product.id) ? (
  <div className="mt-3 flex items-center justify-between">
    <Button size="icon" onClick={() => handleDecrement(product.id)}>-</Button>
    <span>{selectedProducts.find((p) => p.id === product.id)?.quantity}</span>
    <Button size="icon" onClick={() => handleIncrement(product.id)}>+</Button>
  </div>
) : (
  <Button onClick={() => handleAddProduct(product)} className="mt-2 w-full">
    Add
  </Button>
)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProducts.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.price}/{item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    className="w-20"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                  />
                  <span>= ₹{item.quantity * item.price}</span>
                </div>
              </div>
            ))}
            <div className="text-right font-semibold text-lg">
              Total: ₹{calculateSubtotal()}
            </div>
            <Button onClick={handleGenerateBill} className="w-full">
              Generate Bill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Bill Preview */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          {/* Hidden trigger if needed */}
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">🧾 Bill Preview</DialogTitle>
          </DialogHeader>
          {billPreview && (
            <div>
              <div className="text-center space-y-1 mb-4">
                <h2 className="text-xl font-bold">Krushi Seva Kendra</h2>
                <p>Gandhi Chowk, Nanded, Maharashtra - 431601</p>
                <p>GSTIN: 27ABCDE1234F1Z5</p>
                <p className="text-sm text-muted-foreground">{billPreview.createdAt}</p>
              </div>
              <div className="mb-4">
                <p><strong>Customer:</strong> {billPreview.customerName}</p>
                <p><strong>Phone:</strong> {billPreview.customerPhone}</p>
              </div>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted text-left">
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Rate</th>
                    <th className="p-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billPreview.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 border">{idx + 1}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">₹{item.price}</td>
                      <td className="p-2 border">₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right mt-4 space-y-1">
                <p><strong>Subtotal:</strong> ₹{billPreview.subtotal.toFixed(2)}</p>
                <p><strong>GST (18%):</strong> ₹{billPreview.tax.toFixed(2)}</p>
                <p className="text-lg font-bold">
                  Grand Total: ₹{billPreview.total.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
