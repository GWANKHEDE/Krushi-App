import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import { getBusinessDetails, updateBusinessDetails, type Business } from '@/lib/store'
import { toast } from '@/lib/toast'
import { useAuth } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

interface ShopDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdated?: () => void
}

export function ShopDetailsModal({ open, onOpenChange, onUpdated }: ShopDetailsModalProps) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<Business>(getBusinessDetails())
    const { refreshUser } = useAuth()
    const { t } = useTranslation()

    useEffect(() => {
        if (open) setForm(getBusinessDetails())
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800))

        updateBusinessDetails(form)

        // Update the business inside the user object in localStorage for immediate effect
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}')
            if (u.id) {
                u.business = form
                localStorage.setItem('user', JSON.stringify(u))
                refreshUser()
            }
        } catch { }

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
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] rounded-[2rem] p-0 overflow-hidden border-none shadow-strong bg-card/95 backdrop-blur-xl flex flex-col">
                <DialogHeader className="p-5 bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                            <Building className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-primary uppercase tracking-tight leading-none mb-1">{t('shop_identity')}</DialogTitle>
                            <DialogDescription className="text-[10px] font-medium italic opacity-70">{t('shop_details_subtitle')}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-4 space-y-5 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">{t('shop_name')}</Label>
                            <Input
                                value={form.name} onChange={e => set('name', e.target.value)}
                                className="h-9 rounded-xl border-primary/10 bg-muted/40 focus-visible:ring-primary shadow-sm font-bold text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">{t('gstin_number')}</Label>
                            <Input
                                value={form.gstin || ''} onChange={e => set('gstin', e.target.value)}
                                className="h-9 rounded-xl border-primary/10 bg-muted/40 focus-visible:ring-primary shadow-sm font-bold text-sm"
                                placeholder="27AABCW1234F1Z5"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">{t('business_branding')}</Label>
                        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors relative group">
                            <div className="h-12 w-12 rounded-lg bg-card/50 flex items-center justify-center border border-primary/10 overflow-hidden shrink-0">
                                {form.logo ? (
                                    <div className="relative h-full w-full">
                                        <img src={form.logo} alt="Logo" className="h-full w-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => set('logo', '')}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Save className="h-3 w-3 text-white rotate-45" />
                                        </button>
                                    </div>
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-primary/30" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-primary uppercase mb-0.5">{t('click_to_upload')}</p>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => set('logo', reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="h-6 py-0.5 px-1.5 text-[9px] border-none bg-primary/10 hover:bg-primary/20 cursor-pointer shadow-none focus-visible:ring-0 file:hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                            <Input
                                type="email" value={form.email || ''} onChange={e => set('email', e.target.value)}
                                className="h-9 rounded-xl border-primary/10 bg-muted/40 focus-visible:ring-primary shadow-sm font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Contact</Label>
                            <Input
                                value={form.contactNumber || ''} onChange={e => set('contactNumber', e.target.value)}
                                className="h-9 rounded-xl border-primary/10 bg-muted/40 focus-visible:ring-primary shadow-sm font-bold text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground ml-1">{t('store_address')}</Label>
                        <Textarea
                            value={form.address || ''} onChange={e => set('address', e.target.value)}
                            className="min-h-[60px] rounded-xl border-primary/10 bg-muted/40 focus-visible:ring-primary shadow-sm font-bold resize-none text-[11px] leading-tight"
                            placeholder="Complete physical address..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 shrink-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-8 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] text-muted-foreground">{t('cancel')}</Button>
                        <Button type="submit" disabled={loading} className="h-8 px-6 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 text-[9px] text-primary-foreground flex items-center justify-center">
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3 w-3 mr-2" />{t('sync_changes')}</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
