/*
  Products page — two views:
  1. PUBLIC (/products)  → Consumer-facing, beautiful product catalog.
     Shows: name, category, description, price, availability (true/false only).
     NO stock counts, NO SKU, NO cost price, NO edit/delete.
     CTA: "Contact to Order" or WhatsApp-style inquiry.

  2. ADMIN (/admin/products) → Full inventory management with stock counts,
     edit/delete, cost price, low-stock badges.
*/
import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Package, AlertCircle, CheckCircle, Plus, Edit, Trash2, Leaf, Sprout, Phone, MessageCircle } from 'lucide-react'
import { getProducts, getCategories, type Product, type Category } from '@/lib/store'
import AddProductDialog from '../components/AddProductDialog'
import EditProductDialog from '../components/EditProductDialog'
import DeleteProductDialog from '../components/DeleteProductDialog'
import { useLocation, Link } from 'react-router-dom'
import { toast } from '@/lib/toast'
import { useTranslation } from 'react-i18next'

/* Product images — fallback by category */
const categoryImages: Record<string, string> = {
  'Fertilizers': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop',
  'Pesticides':  'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600&auto=format&fit=crop',
  'Seeds':       'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=600&auto=format&fit=crop',
  'Equipment':   'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=600&auto=format&fit=crop',
  'default':     'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop',
}
function productImage(p: Product): string {
  const cat = p.category?.name || ''
  for (const key of Object.keys(categoryImages)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return categoryImages[key]
  }
  return categoryImages['default']
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(getProducts())
  const [categories] = useState<Category[]>(getCategories())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStock, setSelectedStock] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const { t } = useTranslation()

  const reload = () => setProducts(getProducts())
  const handleAdded = () => { reload(); setAddOpen(false); toast.success('Product added') }
  const handleUpdated = () => { reload(); setEditing(null); toast.success('Product updated') }
  const handleDeleted = () => { reload(); setDeleting(null); toast.success('Product deleted') }

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdmin && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchCat = selectedCategory === 'All' || p.category?.name === selectedCategory
      const matchStock = selectedStock === 'All' ||
        (selectedStock === 'In Stock' && p.currentStock > 0) ||
        (selectedStock === 'Out of Stock' && p.currentStock === 0)
      return matchSearch && matchCat && matchStock && p.isActive
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [products, searchTerm, selectedCategory, selectedStock, isAdmin])

  const isAvailable = (p: Product) => p.currentStock > 0

  /* ── Admin inventory view ── */
  if (isAdmin) {
    const stockInfo = (p: Product) => {
      if (p.currentStock === 0) return { label: t('out'), color: '#FF3B30', bg: 'rgba(255,59,48,0.10)', icon: AlertCircle }
      if (p.currentStock <= p.lowStockAlert) return { label: t('low'), color: '#FF9500', bg: 'rgba(255,149,0,0.10)', icon: AlertCircle }
      return { label: t('in_stock'), color: '#34C759', bg: 'rgba(52,199,89,0.10)', icon: CheckCircle }
    }

    return (
      <div className="space-y-5 hig-page-enter">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="ios-title-1" style={{ color: "hsl(var(--foreground))" }}>{t('inventory')}</h1>
            <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Manage agricultural stock levels</p>
          </div>
          <button onClick={() => setAddOpen(true)} className="hig-btn hig-btn-filled hig-btn-sm flex items-center gap-2">
            <Plus style={{ width: 15, height: 15 }} /><span className="hidden sm:inline">{t('add_product')}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="glass" style={{ padding: "14px 16px", borderRadius: 16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2">
              <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "hsl(var(--muted-foreground))" }} />
              <input placeholder={t('search_sku') || 'Search name or SKU…'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, width: "100%", height: 36, background: "rgba(120,120,128,0.10)", borderRadius: 9, border: "none", outline: "none", fontSize: 14, color: "hsl(var(--foreground))" }} className="dark:[background:rgba(120,120,128,0.22)]" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm">
                <div className="flex items-center gap-2"><Filter style={{ width: 14, height: 14 }} /><SelectValue placeholder="Category" /></div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">{t('all_categories')}</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStock('All') }}
              style={{ height: 36, borderRadius: 9, background: "rgba(120,120,128,0.10)", border: "none", fontSize: 13, color: "hsl(var(--muted-foreground))", cursor: "pointer" }}
              className="hover:bg-black/8 dark:hover:bg-white/10">
              Reset
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap items-center gap-2">
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>{filtered.length} products</p>
          {[
            { label: `${products.filter(p => p.currentStock > p.lowStockAlert).length} healthy`, color: "#34C759", bg: "rgba(52,199,89,0.10)" },
            { label: `${products.filter(p => p.currentStock <= p.lowStockAlert && p.currentStock > 0).length} low`, color: "#FF9500", bg: "rgba(255,149,0,0.10)" },
            { label: `${products.filter(p => p.currentStock === 0).length} out`, color: "#FF3B30", bg: "rgba(255,59,48,0.10)" },
          ].map((s, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => {
            const si = stockInfo(product)
            return (
              <div key={product.id} className="glass-widget" style={{ padding: "18px 16px 16px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "22px 22px 0 0", background: si.color, opacity: 0.7, zIndex: 2 }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.008em", lineHeight: 1.3 }}>{product.name}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                      {product.category?.name && <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99, background: "rgba(0,122,255,0.10)", color: "#007AFF" }}>{product.category.name}</span>}
                      <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>SKU: {product.sku}</span>
                    </div>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 99, background: si.bg, flexShrink: 0 }}>
                    <si.icon style={{ width: 11, height: 11, color: si.color }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: si.color }}>{si.label}</span>
                  </span>
                </div>
                {product.description && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 10, lineHeight: 1.5 }} className="line-clamp-2">{product.description}</p>}
                <div style={{ background: "rgba(120,120,128,0.07)", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{t('selling_price')}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--primary))", letterSpacing: "-0.02em" }}>
                      ₹{product.sellingPrice.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: "hsl(var(--muted-foreground))", marginLeft: 3 }}>/{product.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{t('current_stock_label')}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: si.color }}>{product.currentStock} {product.unit}s</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditing(product)} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(0,122,255,0.10)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#007AFF" }} className="hover:bg-[rgba(0,122,255,0.18)]">
                      <Edit style={{ width: 15, height: 15 }} />
                    </button>
                    <button onClick={() => setDeleting(product)} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,59,48,0.09)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF3B30" }} className="hover:bg-[rgba(255,59,48,0.17)]">
                      <Trash2 style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginBottom: 1 }}>Cost</p>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>₹{product.costPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="glass" style={{ padding: "56px 24px", borderRadius: 20, textAlign: "center" }}>
            <Package style={{ width: 44, height: 44, margin: "0 auto 12px", opacity: 0.2 }} />
            <p style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))" }}>{t('no_products_found')}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All') }} style={{ padding: "8px 18px", borderRadius: 10, background: "rgba(120,120,128,0.12)", border: "none", fontSize: 14, cursor: "pointer" }}>Clear filters</button>
              <button onClick={() => setAddOpen(true)} className="hig-btn hig-btn-filled hig-btn-sm">{t('add_product')}</button>
            </div>
          </div>
        )}

        <AddProductDialog open={addOpen} onOpenChange={setAddOpen} onProductAdded={handleAdded} categories={categories} />
        <EditProductDialog product={editing} onOpenChange={open => !open && setEditing(null)} onProductUpdated={handleUpdated} categories={categories} />
        <DeleteProductDialog product={deleting} onOpenChange={open => !open && setDeleting(null)} onProductDeleted={handleDeleted} />
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════════
     PUBLIC CONSUMER VIEW — /products
     Beautiful catalog. No stock counts, no admin data.
     Shows price + availability badge only.
     ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="hig-page-enter">

      {/* ── Hero banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, hsl(141,58%,24%) 0%, hsl(141,48%,18%) 60%, hsl(200,55%,16%) 100%)",
          padding: "48px 20px 40px", position: "relative", overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 280, height: 280, borderRadius: "50%", background: "rgba(52,199,89,0.15)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <Sprout style={{ width: 22, height: 22 }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: .8 }}>Krushi Kendra</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 12 }}>
            Quality Agricultural<br />Products
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 24px" }}>
            Premium fertilizers, seeds, pesticides & farming equipment. Trusted by 5000+ farmers across Maharashtra.
          </p>
          {/* Search bar in hero */}
          <div style={{ maxWidth: 480, margin: "0 auto", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", borderRadius: 14, border: "0.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 48 }}>
            <Search style={{ width: 18, height: 18, color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
            <input
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: "white", fontFamily: "inherit" }}
              className="placeholder:text-white/50"
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 48px" }}>

        {/* ── Category filter chips ── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, overflowX: "auto" }}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
                background: selectedCategory === cat ? "hsl(var(--primary))" : "hsl(var(--card))",
                color: selectedCategory === cat ? "white" : "hsl(var(--foreground))",
                border: selectedCategory === cat ? "none" : "0.5px solid rgba(60,60,67,0.18)",
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: selectedCategory === cat ? "0 2px 8px hsl(var(--primary)/.25)" : "0 1px 3px rgba(0,0,0,0.06)",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Product grid — consumer-facing ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => {
              const available = isAvailable(product)
              return (
                <div
                  key={product.id}
                  className="glass-widget"
                  style={{ padding: 0, overflow: "hidden", cursor: "default" }}
                >
                  {/* Product image */}
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", borderRadius: "22px 22px 0 0" }}>
                    <img
                      src={productImage(product)}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      className="hover:scale-105"
                      loading="lazy"
                    />
                    {/* Availability badge */}
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: available ? "rgba(52,199,89,0.90)" : "rgba(255,59,48,0.90)",
                        color: "white", backdropFilter: "blur(8px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", display: "inline-block", opacity: .9 }} />
                        {available ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    {/* Gradient overlay */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(transparent, rgba(0,0,0,0.35))" }} />
                    {/* Category chip */}
                    {product.category?.name && (
                      <span style={{ position: "absolute", bottom: 10, left: 10, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.20)", color: "white", backdropFilter: "blur(8px)" }}>
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  {/* Card content */}
                  <div style={{ padding: "14px 16px 16px" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 4 }}>
                      {product.name}
                    </h3>

                    {product.description && (
                      <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.5, marginBottom: 10 }} className="line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Price</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--primary))", letterSpacing: "-0.022em", lineHeight: 1.1 }}>
                          ₹{product.sellingPrice.toLocaleString()}
                          <span style={{ fontSize: 12, fontWeight: 400, color: "hsl(var(--muted-foreground))", marginLeft: 3 }}>/{product.unit}</span>
                        </p>
                      </div>
                      {/* Availability indicator — clean boolean */}
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Availability</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: available ? "#34C759" : "#FF3B30", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }}>
                          {available
                            ? <><CheckCircle style={{ width: 14, height: 14 }} /> Available</>
                            : <><AlertCircle style={{ width: 14, height: 14 }} /> Unavailable</>
                          }
                        </p>
                      </div>
                    </div>

                    {/* Contact CTA */}
                    <a
                      href="tel:+919823332198"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        width: "100%", height: 40, borderRadius: 12,
                        background: available ? "hsl(var(--primary))" : "rgba(120,120,128,0.14)",
                        color: available ? "white" : "hsl(var(--muted-foreground))",
                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                        boxShadow: available ? "0 3px 10px hsl(var(--primary)/.25)" : "none",
                        transition: "all 0.15s ease",
                        pointerEvents: available ? "auto" : "none",
                      }}
                      className={available ? "hover:opacity-90 active:scale-[.98]" : ""}
                    >
                      <Phone style={{ width: 14, height: 14 }} />
                      {available ? "Enquire Now" : "Currently Unavailable"}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="glass" style={{ padding: "60px 24px", borderRadius: 20, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(120,120,128,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Leaf style={{ width: 32, height: 32, color: "hsl(var(--primary))", opacity: .5 }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))" }}>No products found</p>
            <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 6, lineHeight: 1.5 }}>
              Try a different search or category
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}
              className="hig-btn hig-btn-tinted hig-btn-sm"
              style={{ marginTop: 16 }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Trust badges ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 40, paddingTop: 32, borderTop: "0.5px solid rgba(60,60,67,0.12)" }}>
          {[
            { icon: "🌾", title: "100% Authentic",   desc: "Genuine products only" },
            { icon: "🚜", title: "5000+ Farmers",     desc: "Trusted community" },
            { icon: "📞", title: "Expert Support",    desc: "+91 98233 32198" },
            { icon: "✅", title: "Quality Assured",   desc: "Tested & certified" },
          ].map((b, i) => (
            <div key={i} className="glass-action" style={{ padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{b.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>{b.title}</p>
              <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
