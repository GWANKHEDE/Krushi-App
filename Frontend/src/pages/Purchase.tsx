import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Purchase() {
  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    costPrice: "",
    supplier: "",
    date: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Purchase Submitted:", form);
    // You can call an API or update state here
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>New Purchase Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="costPrice">Cost Price (₹)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Purchase Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional details"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Purchase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
