/*
  Settings — iOS Settings.app style
  • Grouped table view sections
  • systemGroupedBackground (#F2F2F7) page bg
  • White sections (.hig-section) with glass material
  • 44pt row height, inset separators
  • System color icons in rounded-rect containers
  • Switch controls right-aligned
  • Section headers: 11pt uppercase, gray
  • Chevron on tappable rows
*/
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import {
  Bell, Settings as Cog, Warehouse, User, Building,
  ShieldCheck, Mail, Phone, MapPin, BadgeCheck,
  ChevronRight, IndianRupee, Tag, Sprout, LogOut,
  Store, Hash, TrendingUp, Package
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { getSettings, updateSettings, getProducts, getDashboardStats, getBusinessDetails } from '@/lib/store'
import { toast } from '@/lib/toast'
import { ShopDetailsModal } from '@/components/ShopDetailsModal'
import { useNavigate } from 'react-router-dom'

/* ── Reusable section wrapper ── */
function SettingsSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {title && (
        <p style={{ fontSize: 13, fontWeight: 400, color: "hsl(var(--muted-foreground))", padding: "0 6px 6px", letterSpacing: "0.01em" }}>
          {title}
        </p>
      )}
      <div className="hig-section">{children}</div>
    </div>
  )
}

/* ── Row types ── */
function InfoRow({ icon: Icon, iconBg, iconColor, label, value, last = false }: any) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px", minHeight: 52,
        position: "relative",
      }}
    >
      {!last && (
        <span style={{ position: "absolute", bottom: 0, left: 56, right: 0, height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
      )}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 16, height: 16, color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 400, color: "hsl(var(--foreground))" }}>{label}</p>
      </div>
      <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", flexShrink: 0, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>
        {value}
      </p>
    </div>
  )
}

function ActionRow({ icon: Icon, iconBg, iconColor, label, value, onTap, last = false, destructive = false, chevron = false }: any) {
  return (
    <button
      onClick={onTap}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px", minHeight: 52, width: "100%",
        background: "none", border: "none", cursor: "pointer",
        position: "relative", textAlign: "left",
        transition: "background 0.1s ease",
      }}
      className="hover:bg-black/3 dark:hover:bg-white/4 active:bg-black/6"
    >
      {!last && (
        <span style={{ position: "absolute", bottom: 0, left: 56, right: 0, height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
      )}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 16, height: 16, color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 400, color: destructive ? "#FF3B30" : "hsl(var(--foreground))" }}>{label}</p>
        {value && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{value}</p>}
      </div>
      {chevron && <ChevronRight style={{ width: 15, height: 15, color: "hsl(var(--muted-foreground))", opacity: .45, flexShrink: 0 }} />}
    </button>
  )
}

function ToggleRow({ icon: Icon, iconBg, iconColor, label, description, checked, onChange, last = false }: any) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px", minHeight: 52,
        position: "relative",
      }}
    >
      {!last && (
        <span style={{ position: "absolute", bottom: 0, left: 56, right: 0, height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
      )}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 16, height: 16, color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 400, color: "hsl(var(--foreground))" }}>{label}</p>
        {description && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} style={{ flexShrink: 0 }} />
    </div>
  )
}

function InputRow({ icon: Icon, iconBg, iconColor, label, value, onChange, type = "text", last = false }: any) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px", minHeight: 52,
        position: "relative",
      }}
    >
      {!last && (
        <span style={{ position: "absolute", bottom: 0, left: 56, right: 0, height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
      )}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 16, height: 16, color: iconColor }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 400, color: "hsl(var(--foreground))", flexShrink: 0, minWidth: 100 }}>{label}</p>
      <input
        type={type}
        step={type === "number" ? "0.1" : undefined}
        value={value}
        onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value.toUpperCase())}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          fontSize: 15, color: "hsl(var(--muted-foreground))", textAlign: "right",
          fontFamily: "inherit", minWidth: 0,
        }}
      />
    </div>
  )
}

/* ── Main component ── */
export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState(getSettings())
  const [shopOpen, setShopOpen] = useState(false)
  const [business, setBusiness] = useState(getBusinessDetails())

  const stats = getDashboardStats()
  const products = getProducts()
  const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0)

  const handleChange = (key: string, value: boolean | number | string) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    updateSettings(updated)
    toast.success('Settings saved')
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Signed out')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'

  return (
    <div
      className="hig-page-enter"
      style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}
    >

      {/* ── Profile header — large iOS account card ── */}
      <div className="hig-section" style={{ overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 16px 16px" }}>
          {/* Avatar */}
          <div style={{
            width: 62, height: 62, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(142,55%,28%))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 24, fontWeight: 700,
            boxShadow: "0 4px 14px hsl(var(--primary)/.30)",
          }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.015em" }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{user?.email}</p>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "rgba(52,199,89,0.10)", color: "#34C759", display: "inline-block", marginTop: 5 }}>
              {user?.role || 'Admin'} Account
            </span>
          </div>
          <ChevronRight style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", opacity: .35, flexShrink: 0 }} />
        </div>
      </div>

      {/* ── Business stats — mini widget row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          { icon: Package,     iconBg: "rgba(0,122,255,0.10)",   iconColor: "#007AFF", label: "Products",     value: String(stats.totalProducts),            accentTop: "#007AFF" },
          { icon: Warehouse,   iconBg: "rgba(255,149,0,0.10)",   iconColor: "#FF9500", label: "Low Stock",    value: String(stats.lowStockItems),            accentTop: "#FF9500" },
          { icon: TrendingUp,  iconBg: "rgba(52,199,89,0.10)",   iconColor: "#34C759", label: "Asset Value",  value: `₹${Math.round(inventoryValue/1000)}k`, accentTop: "#34C759" },
        ].map((w, i) => (
          <div key={i} className="glass-widget" style={{ padding: "14px 12px 12px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "22px 22px 0 0", background: `linear-gradient(90deg,${w.accentTop}cc,${w.accentTop}33)`, zIndex: 2 }} />
            <div style={{ width: 30, height: 30, borderRadius: 8, background: w.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <w.icon style={{ width: 16, height: 16, color: w.iconColor }} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.02em", lineHeight: 1 }}>{w.value}</p>
            <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{w.label}</p>
          </div>
        ))}
      </div>

      {/* ── Business details ── */}
      <SettingsSection title="BUSINESS">
        <ActionRow
          icon={Store} iconBg="rgba(0,122,255,0.10)" iconColor="#007AFF"
          label={business.name}
          value="Tap to edit"
          onTap={() => setShopOpen(true)}
          chevron last={false}
        />
        <InfoRow
          icon={MapPin} iconBg="rgba(255,149,0,0.10)" iconColor="#FF9500"
          label="Address" value={business.address} last
        />
      </SettingsSection>

      {/* ── Billing configuration ── */}
      <SettingsSection title="BILLING CONFIGURATION">
        <InputRow
          icon={IndianRupee} iconBg="rgba(52,199,89,0.10)" iconColor="#34C759"
          label="GST Rate (%)" value={settings.gstRate}
          onChange={(v: number) => handleChange('gstRate', v)} type="number"
        />
        <InputRow
          icon={Hash} iconBg="rgba(175,82,222,0.10)" iconColor="#AF52DE"
          label="Invoice Prefix" value={settings.invoicePrefix}
          onChange={(v: string) => handleChange('invoicePrefix', v)} last
        />
      </SettingsSection>

      {/* ── Preferences ── */}
      <SettingsSection title="PREFERENCES">
        <ToggleRow
          icon={Bell} iconBg="rgba(255,149,0,0.10)" iconColor="#FF9500"
          label="Low Stock Alerts"
          description="Notify when stock drops below threshold"
          checked={(settings as any).lowStockAlert || false}
          onChange={(v: boolean) => handleChange('lowStockAlert', v)}
        />
        <ToggleRow
          icon={IndianRupee} iconBg="rgba(52,199,89,0.10)" iconColor="#34C759"
          label="GST Enforcement"
          description="Always apply GST in billing"
          checked={(settings as any).gstReminder || false}
          onChange={(v: boolean) => handleChange('gstReminder', v)}
          last
        />
      </SettingsSection>

      {/* ── Account ── */}
      <SettingsSection title="ACCOUNT">
        <InfoRow
          icon={Mail} iconBg="rgba(0,122,255,0.10)" iconColor="#007AFF"
          label="Email" value={user?.email || 'N/A'}
        />
        <InfoRow
          icon={Phone} iconBg="rgba(52,199,89,0.10)" iconColor="#34C759"
          label="Phone" value={user?.phone || 'Not linked'}
        />
        <InfoRow
          icon={ShieldCheck} iconBg="rgba(52,199,89,0.10)" iconColor="#34C759"
          label="Security" value="Active & encrypted" last
        />
      </SettingsSection>

      {/* ── Sign out ── */}
      <SettingsSection>
        <ActionRow
          icon={LogOut} iconBg="rgba(255,59,48,0.10)" iconColor="#FF3B30"
          label="Sign Out"
          onTap={handleLogout}
          destructive last
        />
      </SettingsSection>

      {/* App version */}
      <p style={{ textAlign: "center", fontSize: 13, color: "hsl(var(--muted-foreground))", paddingBottom: 8 }}>
        Krushi Kendra v1.0.0 · Built with ♥ for Indian farmers
      </p>

      <ShopDetailsModal open={shopOpen} onOpenChange={setShopOpen} onUpdated={() => setBusiness(getBusinessDetails())} />
    </div>
  )
}
