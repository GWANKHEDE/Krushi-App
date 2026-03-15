import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Package, UserPlus, Info, Loader2, Calendar } from 'lucide-react'
import { getProducts, getSuppliers, createPurchase } from '@/lib/store'
import AddSupplierDialog from '@/components/AddSupplierDialog'
import { toast } from '@/lib/toast'

interface PurchaseForm { productId: string; quantity: string; costPrice: string; supplierId: string; purchaseDate: string; notes: string }

export default function Purchase() {
  const [form, setForm] = useState<PurchaseForm>({ productId: '', quantity: '', costPrice: '', supplierId: '', purchaseDate: new Date().toISOString().split('T')[0], notes: '' })
  const [products, setProducts] = useState(getProducts())
  const [suppliers, setSuppliers] = useState(getSuppliers())
  const [loading, setLoading] = useState(false)
  const [addSupplierOpen, setAddSupplierOpen] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const selectedProduct = products.find(p => p.id === form.productId)
  const totalCost = (parseFloat(form.quantity) || 0) * (parseFloat(form.costPrice) || 0)

  const handleProductChange = (id: string) => {
    set('productId', id)
    const p = products.find(x => x.id === id)
    if (p) set('costPrice', p.costPrice.toString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.productId || !form.quantity || !form.costPrice || !form.supplierId) { toast.error('Fill all required fields'); return }
    if (parseFloat(form.quantity) <= 0 || parseFloat(form.costPrice) <= 0) { toast.error('Values must be positive'); return }
    setLoading(true)
    try {
      createPurchase({ supplierId: form.supplierId, purchaseItems: [{ productId: form.productId, quantity: parseInt(form.quantity), costPrice: parseFloat(form.costPrice), totalCost }], totalAmount: totalCost, purchaseDate: form.purchaseDate, notes: form.notes })
      toast.success('Purchase recorded')
      setForm({ productId: '', quantity: '', costPrice: '', supplierId: '', purchaseDate: new Date().toISOString().split('T')[0], notes: '' })
      setProducts(getProducts())
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  const fieldLabel = (text: string) => (
    <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{text}</p>
  )

  return (
    <div className="space-y-5 hig-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ios-title-1" style={{ color: "hsl(var(--foreground))" }}>Purchase Entry</h1>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Record incoming agricultural stock</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: "rgba(0,122,255,0.08)" }}>
          <Calendar style={{ width: 13, height: 13, color: "#007AFF" }} />
          <span style={{ fontSize: 12, color: "#007AFF", fontWeight: 500 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2">
          <div className="glass" style={{ padding: "20px 18px", borderRadius: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "0.5px solid rgba(60,60,67,0.12)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,122,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package style={{ width: 18, height: 18, color: "#007AFF" }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))" }}>Stock Details</p>
                <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>Inventory entry form</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Supplier */}
              <div>
                {fieldLabel("Distributor / Supplier")}
                <div style={{ display: "flex", gap: 8 }}>
                  <Select value={form.supplierId} onValueChange={v => set('supplierId', v)}>
                    <SelectTrigger className="h-11 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm flex-1">
                      <SelectValue placeholder="Select supplier…" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <button type="button" onClick={() => setAddSupplierOpen(true)} style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(52,199,89,0.10)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#34C759", flexShrink: 0 }} className="hover:bg-[rgba(52,199,89,0.18)] transition-colors">
                    <UserPlus style={{ width: 17, height: 17 }} />
                  </button>
                </div>
              </div>

              {/* Product */}
              <div>
                {fieldLabel("Product")}
                <Select value={form.productId} onValueChange={handleProductChange}>
                  <SelectTrigger className="h-11 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm">
                    <SelectValue placeholder="Choose product…" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <span>{p.name}</span>
                        <span style={{ marginLeft: 8, fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Stock: {p.currentStock}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Qty + Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {fieldLabel("Quantity")}
                  <div className="hig-field-wrap">
                    <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="0" required />
                    {selectedProduct && <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", flexShrink: 0 }}>{selectedProduct.unit}s</span>}
                  </div>
                </div>
                <div>
                  {fieldLabel("Landing Cost (₹)")}
                  <div className="hig-field-wrap">
                    <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", flexShrink: 0 }}>₹</span>
                    <input type="number" step="0.01" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" required />
                  </div>
                </div>
              </div>

              {/* Date + Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel("Invoice Date")}
                  <div className="hig-field-wrap">
                    <input type="date" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} required style={{ fontSize: 14 }} />
                  </div>
                </div>
                <div>
                  {fieldLabel("Notes (optional)")}
                  <div className="hig-field-wrap" style={{ height: "auto", alignItems: "flex-start", paddingTop: 10, paddingBottom: 10 }}>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Remarks…" rows={2} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "hsl(var(--foreground))", resize: "none", fontFamily: "inherit" }} className="placeholder:text-muted-foreground/60" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="hig-btn hig-btn-filled w-full" style={{ borderRadius: 14, height: 48, marginTop: 4 }}>
                {loading ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin mr-2" />Processing…</> : <><Plus style={{ width: 16, height: 16, marginRight: 6 }} />Update Stock</>}
              </button>
            </form>
          </div>
        </div>

        {/* Side panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Cost summary */}
          <div className="glass-widget glass-blue" style={{ padding: "16px 14px" }}>
            <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Financial Summary</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#007AFF", letterSpacing: "-0.025em", marginBottom: 4 }}>
              ₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>Total landing cost</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {[["Unit Price", `₹${(parseFloat(form.costPrice) || 0).toLocaleString()}`], ["Volume", `${form.quantity || 0} ${selectedProduct?.unit || 'units'}`]].map(([k, v]) => (
                <div key={String(k)} style={{ background: "rgba(120,120,128,0.08)", borderRadius: 10, padding: "10px 10px" }}>
                  <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.04em" }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))", marginTop: 2 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stock impact */}
          <div className="glass" style={{ padding: "16px 14px", borderRadius: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Info style={{ width: 14, height: 14, color: "#007AFF" }} />
              <p style={{ fontSize: 12, fontWeight: 600, color: "#007AFF" }}>Stock Impact Preview</p>
            </div>
            {selectedProduct ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(120,120,128,0.07)", borderRadius: 10 }}>
                  <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Current stock</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedProduct.currentStock}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(52,199,89,0.10)", borderRadius: 10, border: "0.5px solid rgba(52,199,89,0.2)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#34C759" }}>After entry</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#34C759" }}>{selectedProduct.currentStock + (parseInt(form.quantity) || 0)}</span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center", padding: "20px 0" }}>Select a product to preview</p>
            )}
          </div>
        </div>
      </div>

      <AddSupplierDialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen} onSupplierAdded={() => setSuppliers(getSuppliers())} />
    </div>
  )
}
