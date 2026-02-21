import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Lock, Settings, Warehouse, User, Building, Save, Eye, EyeOff, ShieldCheck, Mail, Phone, MapPin, BadgeCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { getSettings, updateSettings, getProducts, getDashboardStats, getBusinessDetails } from '@/lib/store'
import { toast } from '@/lib/toast'
import { ShopDetailsModal } from '@/components/ShopDetailsModal'

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(getSettings())
  const [shopOpen, setShopOpen] = useState(false)
  const [business, setBusiness] = useState(getBusinessDetails())

  const stats = getDashboardStats()
  const products = getProducts()
  const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0)

  const handleSettingsChange = (key: string, value: boolean | number | string) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    updateSettings(updated)
    toast.warning('Settings synchronized successfully!')
  }

  const InfoCard = ({ icon: Icon, label, value, color = "text-primary" }: { icon: any; label: string; value: string; color?: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-primary/5">
      <div className={`h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-bold text-sm tracking-tight">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="container px-4 py-8 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Configuration</h1>
          <p className="text-xs text-muted-foreground font-medium italic">Tailor your Krushi Kendra experience.</p>
        </div>
        <Button onClick={() => setShopOpen(true)} className="h-8 px-6 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform flex items-center justify-center">
          <Building className="h-4 w-4 mr-2" /> Update Shop
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account & Shop Summary */}
        <div className="space-y-8">
          <Card className="border-none shadow-medium bg-card/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-primary uppercase">{user?.name}</CardTitle>
                  <CardDescription className="font-bold text-[10px] uppercase text-primary/40 tracking-widest">{user?.role} Account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <InfoCard icon={Mail} label="Contact Email" value={user?.email || 'N/A'} />
              <InfoCard icon={Phone} label="Mobile Link" value={user?.phone || 'Not Linked'} />
              <InfoCard icon={ShieldCheck} label="Security Status" value="Active & Encrypted" color="text-emerald-500" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-medium bg-gradient-to-br from-primary to-primary-foreground p-px rounded-[2.5rem] overflow-hidden">
            <div className="bg-card/95 backdrop-blur-sm rounded-[2.45rem] p-8 h-full space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Store Snapshot</h3>
                <BadgeCheck className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Registered Entity</p>
                  <p className="font-bold text-lg text-primary uppercase tracking-tight leading-tight">{business.name}</p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary/40 mt-0.5" />
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">{business.address}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* System Logic */}
          <Card className="border-none shadow-medium bg-card/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="p-6 border-b border-primary/5 bg-secondary/10">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold text-primary uppercase tracking-tight">Core System Controls</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">GST Compliance Rate (%)</Label>
                  <Input type="number" step="0.1" value={settings.gstRate}
                    onChange={e => handleSettingsChange('gstRate', parseFloat(e.target.value))}
                    className="h-12 rounded-xl border-primary/10 bg-muted/30 font-bold text-base focus-visible:ring-primary"
                  />
                  <p className="text-[10px] font-medium italic text-muted-foreground">Standard GST rate applied to all generated invoices.</p>
                </div>
                <div className="space-y-4">
                  <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Invoice Sequence Prefix</Label>
                  <Input value={settings.invoicePrefix}
                    onChange={e => handleSettingsChange('invoicePrefix', e.target.value)}
                    className="h-12 rounded-xl border-primary/10 bg-muted/30 font-bold text-base focus-visible:ring-primary uppercase"
                  />
                  <p className="text-[10px] font-medium italic text-muted-foreground">Custom prefix for professional invoice numbering.</p>
                </div>
              </div>

              <div className="h-px bg-primary/5" />

              <div className="space-y-6">
                {[
                  { id: 'lowStockAlert', label: 'Inventory Reminders', desc: 'Auto-detect when stock drops below threshold.' },
                  { id: 'gstReminder', label: 'Tax Enforcement', desc: 'Always prompt for GST calculation in cart.' },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-6 bg-muted/20 border border-primary/5 rounded-[1.5rem] group hover:bg-primary/5 transition-colors duration-300">
                    <div className="space-y-1">
                      <Label className="text-sm font-bold text-primary uppercase tracking-tight cursor-pointer">{item.label}</Label>
                      <p className="text-[10px] font-medium text-muted-foreground italic group-hover:text-primary/60">{item.desc}</p>
                    </div>
                    <Switch checked={(settings as any)[item.id] || false} onCheckedChange={v => handleSettingsChange(item.id, v)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Health */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-none shadow-soft bg-orange-50/50 dark:bg-orange-950/20 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Warehouse className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-orange-600/60 tracking-widest">Inventory Health</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 tabular-nums lowercase">{stats.lowStockItems} <span className="text-xs">refills needed</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-soft bg-primary/5 dark:bg-primary/10 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-primary/60 tracking-widest">Net Asset Value</p>
                  <p className="text-2xl font-bold text-primary tabular-nums tracking-tighter italic">₹{inventoryValue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ShopDetailsModal open={shopOpen} onOpenChange={setShopOpen} onUpdated={() => setBusiness(getBusinessDetails())} />
    </div>
  )
}
