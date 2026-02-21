import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, DollarSign, Package, UserPlus, Info, Loader2 } from 'lucide-react'
import { getProducts, getSuppliers, createPurchase, type Product, type Supplier } from '@/lib/store'
import AddSupplierDialog from '@/components/AddSupplierDialog'
import { toast } from '@/lib/toast'

interface PurchaseForm { productId: string; quantity: string; costPrice: string; supplierId: string; purchaseDate: string; notes: string }

export default function Purchase() {
  const [form, setForm] = useState<PurchaseForm>({
    productId: '', quantity: '', costPrice: '', supplierId: '',
    purchaseDate: new Date().toISOString().split('T')[0], notes: '',
  })
  const [products, setProducts] = useState(getProducts())
  const [suppliers, setSuppliers] = useState(getSuppliers())
  const [loading, setLoading] = useState(false)
  const [addSupplierOpen, setAddSupplierOpen] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const selectedProduct = products.find(p => p.id === form.productId)
  const selectedSupplier = suppliers.find(s => s.id === form.supplierId)
  const totalCost = (parseFloat(form.quantity) || 0) * (parseFloat(form.costPrice) || 0)

  const handleProductChange = (id: string) => {
    set('productId', id)
    const p = products.find(x => x.id === id)
    if (p) set('costPrice', p.costPrice.toString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.productId || !form.quantity || !form.costPrice || !form.supplierId) {
      toast.error('Fill all required fields'); return
    }
    if (parseFloat(form.quantity) <= 0 || parseFloat(form.costPrice) <= 0) {
      toast.error('Values must be positive'); return
    }
    setLoading(true)
    try {
      createPurchase({
        supplierId: form.supplierId,
        purchaseItems: [{ productId: form.productId, quantity: parseInt(form.quantity), costPrice: parseFloat(form.costPrice), totalCost }],
        totalAmount: totalCost, purchaseDate: form.purchaseDate, notes: form.notes,
      })
      toast.success('Purchase recorded successfully')
      setForm({ productId: '', quantity: '', costPrice: '', supplierId: '', purchaseDate: new Date().toISOString().split('T')[0], notes: '' })
      setProducts(getProducts()) // refresh stock
    } catch { toast.error('Failed to record purchase') }
    finally { setLoading(false) }
  }

  return (
    <div className="container px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Purchase Entry</h1>
          <p className="text-xs text-muted-foreground font-medium italic">Record incoming agricultural stock.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-medium bg-card/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="bg-secondary/20 border-b border-primary/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-primary uppercase tracking-tight">Stock Details</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Inventory Entry Form</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Supplier Selection */}
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Distributor / Supplier</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Select value={form.supplierId} onValueChange={v => set('supplierId', v)}>
                        <SelectTrigger className="h-8 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm">
                          <SelectValue placeholder="Select supplier..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {suppliers.map(s => <SelectItem key={s.id} value={s.id} className="font-medium">{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="outline" className="h-8 w-8 p-0 rounded-xl border-dashed border-primary/30 hover:bg-primary/5 text-primary flex items-center justify-center" onClick={() => setAddSupplierOpen(true)}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedSupplier && (
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-sm flex gap-6 animate-in slide-in-from-top-2">
                      {selectedSupplier.contactPerson && <div className="flex items-center gap-2"><span className="opacity-40">👤</span> <span className="font-bold">{selectedSupplier.contactPerson}</span></div>}
                      {selectedSupplier.phone && <div className="flex items-center gap-2"><span className="opacity-40">📞</span> <span className="font-bold">{selectedSupplier.phone}</span></div>}
                    </div>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                {/* Product Selection */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Target Product</Label>
                    <Select value={form.productId} onValueChange={handleProductChange}>
                      <SelectTrigger className="h-8 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm">
                        <SelectValue placeholder="Choose product..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex justify-between items-center w-full min-w-[300px]">
                              <span className="font-bold">{p.name}</span>
                              <Badge variant="secondary" className="text-[10px] ml-4 font-black">Stock: {p.currentStock}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="qty" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Entry Quantity</Label>
                      <div className="relative">
                        <Input id="qty" type="number" min="1" className="h-8 px-4 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm pr-16" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="0" required />
                        {selectedProduct && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase text-primary/40 leading-none">{selectedProduct.unit}s</span>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cost" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Landing Cost (₹)</Label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30 font-bold text-sm flex items-center justify-center leading-none">₹</div>
                        <Input id="cost" type="number" step="0.01" className="h-8 pl-8 px-4 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Invoice Date</Label>
                    <Input id="date" type="date" className="h-8 px-4 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Additional Notes</Label>
                    <Textarea id="notes" className="min-h-[32px] h-8 py-2 px-4 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-medium text-sm resize-none" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Remarks..." />
                  </div>
                </div>

                <Button type="submit" className="w-full h-8 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : <><Plus className="mr-2 h-4 w-4" />Update Stock</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Status Panels */}
        <div className="space-y-6">
          <Card className="border-none shadow-medium bg-gradient-to-br from-primary to-primary-foreground p-px rounded-[2rem] overflow-hidden">
            <div className="bg-card/95 backdrop-blur-sm rounded-[calc(2rem-1px)] h-full overflow-hidden">
              <CardHeader className="pb-2 border-b border-primary/5"><CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Financial Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4 pt-6 pb-8">
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Valuation</span>
                  </div>
                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col">
                    <span className="text-2xl font-bold text-primary tabular-nums tracking-tighter italic">₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Computed Landing Cost</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-secondary/30 space-y-1">
                    <span className="text-[8px] font-black text-muted-foreground uppercase leading-none">Unit Price</span>
                    <p className="font-black text-sm">₹{(parseFloat(form.costPrice) || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/30 space-y-1">
                    <span className="text-[8px] font-black text-muted-foreground uppercase leading-none">Net Volume</span>
                    <p className="font-black text-sm">{form.quantity || 0} <span className="text-[10px] font-bold opacity-60 uppercase">{selectedProduct?.unit || 'units'}</span></p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="border-none shadow-soft bg-blue-50 dark:bg-blue-950/20 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-2 px-1">
                <Info className="h-3 w-3" /> Predictive Stock Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              {selectedProduct ? (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-black/20">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Current Level</span>
                    <Badge variant="secondary" className="h-6 font-black rounded-lg">{selectedProduct.currentStock}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Projected New Total</span>
                    <Badge className="h-8 px-3 font-black bg-white text-blue-600 rounded-lg text-sm tabular-nums">
                      {selectedProduct.currentStock + (parseInt(form.quantity) || 0)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center px-4">
                  <p className="text-xs font-bold text-muted-foreground italic">Select a product to preview the inventory projection path.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSupplierDialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen} onSupplierAdded={() => setSuppliers(getSuppliers())} />
    </div>
  )
}
