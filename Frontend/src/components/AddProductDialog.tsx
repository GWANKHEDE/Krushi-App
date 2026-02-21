import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { addProduct, type Category } from '@/lib/store'
import { toast } from '@/lib/toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductAdded: () => void
  categories: Category[]
}

const UNITS = ['kg', 'g', 'lb', 'piece', 'packet', 'bottle', 'liter', 'ml', 'bag']

const INIT = { name: '', sku: '', description: '', categoryId: '', costPrice: '', sellingPrice: '', currentStock: '', lowStockAlert: '10', unit: 'kg' }

export default function AddProductDialog({ open, onOpenChange, onProductAdded, categories }: Props) {
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.sku || !form.categoryId) { toast.error('Fill all required fields'); return }
    setLoading(true)
    try {
      addProduct({
        name: form.name, sku: form.sku, description: form.description, categoryId: form.categoryId,
        costPrice: parseFloat(form.costPrice), sellingPrice: parseFloat(form.sellingPrice),
        currentStock: parseInt(form.currentStock), lowStockAlert: parseInt(form.lowStockAlert),
        unit: form.unit, isActive: true,
      })
      setForm(INIT)
      onProductAdded()
      toast.success('Product added successfully', {
        className: "bg-green-600 text-white border-none shadow-lg font-bold"
      })
    } catch { toast.error('Failed to add product') }
    finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-strong rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-primary uppercase tracking-tight">Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <div className="space-y-1.5"><Label className="text-inherit">Product Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Organic Fertilizer" required className="h-9" /></div>
            <div className="space-y-1.5"><Label className="text-inherit">SKU *</Label><Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU-001" required className="h-9" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Description</Label><Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Details..." rows={2} className="text-sm" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <div className="space-y-1.5"><Label className="text-inherit">Category *</Label>
              <Select value={form.categoryId} onValueChange={v => set('categoryId', v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="text-xs">{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-inherit">Unit</Label>
              <Select value={form.unit} onValueChange={v => set('unit', v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <div className="space-y-1.5"><Label className="text-inherit">Cost Price (₹) *</Label><Input type="number" step="0.01" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} required className="h-9" /></div>
            <div className="space-y-1.5"><Label className="text-inherit">Selling Price (₹) *</Label><Input type="number" step="0.01" value={form.sellingPrice} onChange={e => set('sellingPrice', e.target.value)} required className="h-9" /></div>
            <div className="space-y-1.5"><Label className="text-inherit">Current Stock *</Label><Input type="number" value={form.currentStock} onChange={e => set('currentStock', e.target.value)} required className="h-9" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Low Stock Alert</Label><Input type="number" value={form.lowStockAlert} onChange={e => set('lowStockAlert', e.target.value)} className="h-9" />
            <p className="text-xs text-muted-foreground mt-1">Alert when stock reaches this level</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="h-9 text-xs font-bold uppercase tracking-widest">Cancel</Button>
            <Button type="submit" className="h-9 rounded-lg px-6 font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
