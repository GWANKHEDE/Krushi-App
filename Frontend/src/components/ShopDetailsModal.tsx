import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import { getBusinessDetails, updateBusinessDetails, type Business } from '@/lib/store'
import { toast } from '@/lib/toast'

interface ShopDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdated?: () => void
}

export function ShopDetailsModal({ open, onOpenChange, onUpdated }: ShopDetailsModalProps) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<Business>(getBusinessDetails())

    useEffect(() => {
        if (open) setForm(getBusinessDetails())
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800))

        updateBusinessDetails(form)
        toast.warning('Shop details updated successfully!')

        onUpdated?.()
        onOpenChange(false)
        setLoading(false)
    }

    const set = (key: keyof Business, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-strong bg-card/95 backdrop-blur-xl">
                <DialogHeader className="p-8 bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                            <Building className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-primary uppercase tracking-tight">Shop Identity</DialogTitle>
                            <DialogDescription className="text-xs font-medium italic">Update your business profile for billing and branding.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Shop Name</Label>
                            <Input
                                value={form.name} onChange={e => set('name', e.target.value)}
                                className="h-10 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">GSTIN Number</Label>
                            <Input
                                value={form.gstin || ''} onChange={e => set('gstin', e.target.value)}
                                className="h-10 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm"
                                placeholder="27AABCW1234F1Z5"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Logo URL</Label>
                        <div className="relative">
                            <Input
                                value={form.logo || ''} onChange={e => set('logo', e.target.value)}
                                className="h-10 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold pl-10 text-sm"
                                placeholder="https://..."
                            />
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</Label>
                            <Input
                                type="email" value={form.email || ''} onChange={e => set('email', e.target.value)}
                                className="h-10 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Contact Number</Label>
                            <Input
                                value={form.contactNumber || ''} onChange={e => set('contactNumber', e.target.value)}
                                className="h-10 rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Physical Address</Label>
                        <Textarea
                            value={form.address || ''} onChange={e => set('address', e.target.value)}
                            className="min-h-[80px] rounded-xl border-primary/10 bg-muted/30 focus-visible:ring-primary shadow-sm font-bold resize-none text-xs"
                            placeholder="Shop No, Street, City, State - Zip"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-8 rounded-xl font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center">Cancel</Button>
                        <Button type="submit" disabled={loading} className="h-8 px-8 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 text-xs text-primary-foreground flex items-center justify-center">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3.5 w-3.5 mr-2" />Save Changes</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
