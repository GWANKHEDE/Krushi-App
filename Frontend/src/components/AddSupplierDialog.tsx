import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addSupplier } from '@/lib/store'
import { toast } from '@/lib/toast'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSupplierAdded: () => void
}

const INIT = { name: '', contactPerson: '', email: '', phone: '', address: '', gstin: '' }

export default function AddSupplierDialog({ open, onOpenChange, onSupplierAdded }: Props) {
    const [form, setForm] = useState(INIT)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name) { toast.error('Supplier name is required'); return }
        setLoading(true)
        try {
            addSupplier(form)
            toast.success('Supplier added successfully')
            setForm(INIT)
            onSupplierAdded()
            onOpenChange(false)
        } catch { toast.error('Failed to add supplier') }
        finally { setLoading(false) }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 border-none shadow-strong rounded-2xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-primary uppercase tracking-tight">Add New Supplier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                    <div className="space-y-1.5"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Supplier Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="h-9" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                        <div className="space-y-1.5"><Label className="text-inherit">Contact Person</Label><Input value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} className="h-9" /></div>
                        <div className="space-y-1.5"><Label className="text-inherit">Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-9" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                        <div className="space-y-1.5"><Label className="text-inherit">Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-9" /></div>
                        <div className="space-y-1.5"><Label className="text-inherit">GSTIN</Label><Input value={form.gstin} onChange={e => setForm(p => ({ ...p, gstin: e.target.value }))} className="h-9" /></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Address</Label><Textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={2} className="text-sm" /></div>
                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="h-9 text-xs font-bold uppercase tracking-widest">Cancel</Button>
                        <Button type="submit" disabled={loading} className="h-9 px-6 rounded-lg font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20">{loading ? 'Adding...' : 'Add Supplier'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
