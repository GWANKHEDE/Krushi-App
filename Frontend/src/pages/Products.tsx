import { useState, useMemo, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Package, AlertCircle, CheckCircle, Plus, Edit, Trash2, Leaf, Sprout, Phone, X } from 'lucide-react'
import { getProducts, getCategories, type Product, type Category } from '@/lib/store'
import AddProductDialog from '../components/AddProductDialog'
import EditProductDialog from '../components/EditProductDialog'
import DeleteProductDialog from '../components/DeleteProductDialog'
import { useLocation, Link } from 'react-router-dom'
import { toast } from '@/lib/toast'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@/lib/SearchContext'
import { ProductImage } from '@/components/ProductImage'

const defaultBiz = {
  name:  "Krushi Seva Kendra",
  phone: "+91 9823332198",
  address: "Penur, Tq Purna, Parbhani, MH 431511",
}

export default function Products() {
  const [products, setProducts]     = useState<Product[]>(getProducts())
  const [categories]                = useState<Category[]>(getCategories())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStock, setSelectedStock]       = useState('All')
  const [addOpen, setAddOpen]       = useState(false)
  const [editing, setEditing]       = useState<Product | null>(null)
  const [deleting, setDeleting]     = useState<Product | null>(null)
  const [biz, setBiz]               = useState(defaultBiz)
  const location  = useLocation()
  const isAdmin   = location.pathname.startsWith('/admin')
  const { t }     = useTranslation()
  const { query: searchTerm } = useSearch()   // ← synced with navbar search (admin)
  const [pubSearch, setPubSearch] = useState('') // ← public page hero search (separate)

  /* Load biz info for public page CTA phone number */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}")
      if (u?.business) setBiz(p => ({
        ...p,
        name:    u.business.name          || p.name,
        phone:   u.business.contactNumber || p.phone,
        address: u.business.address       || p.address,
      }))
    } catch {}
  }, [])

  const reload       = () => setProducts(getProducts())
  const handleAdded  = () => { reload(); setAddOpen(false);     toast.success('Product added') }
  const handleUpdated= () => { reload(); setEditing(null);      toast.success('Product updated') }
  const handleDeleted= () => { reload(); setDeleting(null);     toast.success('Product deleted') }

  // Admin uses navbar search; public uses the hero search bar
  const activeSearch = isAdmin ? searchTerm : pubSearch

  const filtered = useMemo(() => {
    const q = activeSearch.toLowerCase()
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(q) ||
        (isAdmin && p.sku.toLowerCase().includes(q))
      const matchCat   = selectedCategory === 'All' || p.category?.name === selectedCategory
      const matchStock = selectedStock === 'All' ||
        (selectedStock === 'In Stock' && p.currentStock > 0) ||
        (selectedStock === 'Out of Stock' && p.currentStock === 0)
      return matchSearch && matchCat && matchStock && p.isActive
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [products, activeSearch, selectedCategory, selectedStock, isAdmin])

  const isAvailable = (p: Product) => p.currentStock > 0

  /* ══════════════════════════════════════════════════════════════════
     ADMIN INVENTORY VIEW (/admin/products)
     Shows stock counts, edit/delete, cost price, SKU.
     ══════════════════════════════════════════════════════════════════ */
  if (isAdmin) {
    const stockInfo = (p: Product) => {
      if (p.currentStock === 0) return { label: t('out'), color: '#FF3B30', bg: 'rgba(255,59,48,0.10)', icon: AlertCircle }
      if (p.currentStock <= p.lowStockAlert) return { label: t('low'), color: '#FF9500', bg: 'rgba(255,149,0,0.10)', icon: AlertCircle }
      return { label: t('in_stock'), color: '#34C759', bg: 'rgba(52,199,89,0.10)', icon: CheckCircle }
    }
    return (
      <div className="space-y-5 hig-page-enter">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="ios-title-1" style={{ color:"hsl(var(--foreground))" }}>{t('inventory')}</h1>
            <p style={{ fontSize:13,color:"hsl(var(--muted-foreground))",marginTop:2 }}>Manage agricultural stock levels</p>
          </div>
          <button onClick={() => setAddOpen(true)} className="hig-btn hig-btn-filled hig-btn-sm flex items-center gap-2">
            <Plus style={{ width:15,height:15 }} /><span className="hidden sm:inline">{t('add_product')}</span>
          </button>
        </div>
        <div className="glass" style={{ padding:"14px 16px",borderRadius:16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm">
                <div className="flex items-center gap-2"><Filter style={{ width:14,height:14 }} /><SelectValue placeholder="Category" /></div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">{t('all_categories')}</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger className="h-9 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm">
                <SelectValue placeholder="Stock status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">All stock</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={() => { setSelectedCategory('All'); setSelectedStock('All') }}
              style={{ height:36,borderRadius:9,background:"rgba(120,120,128,.10)",border:"none",fontSize:13,color:"hsl(var(--muted-foreground))",cursor:"pointer" }}
              className="hover:bg-black/8 dark:hover:bg-white/10">Reset filters</button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p style={{ fontSize:13,color:"hsl(var(--muted-foreground))" }}>{filtered.length} products</p>
          {[
            { label:`${products.filter(p=>p.currentStock>p.lowStockAlert).length} healthy`, color:"#34C759", bg:"rgba(52,199,89,.10)" },
            { label:`${products.filter(p=>p.currentStock<=p.lowStockAlert&&p.currentStock>0).length} low`, color:"#FF9500", bg:"rgba(255,149,0,.10)" },
            { label:`${products.filter(p=>p.currentStock===0).length} out`, color:"#FF3B30", bg:"rgba(255,59,48,.10)" },
          ].map((s,i) => <span key={i} style={{ fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:99,background:s.bg,color:s.color }}>{s.label}</span>)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => {
            const si = stockInfo(product)
            return (
              <div key={product.id} className="glass-widget" style={{ padding:"18px 16px 16px" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"22px 22px 0 0",background:si.color,opacity:.7,zIndex:2 }} />
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontSize:15,fontWeight:600,color:"hsl(var(--foreground))",letterSpacing:"-0.008em",lineHeight:1.3 }}>{product.name}</p>
                    <div style={{ display:"flex",gap:6,marginTop:4,flexWrap:"wrap" }}>
                      {product.category?.name&&<span style={{ fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:99,background:"rgba(0,122,255,.10)",color:"#007AFF" }}>{product.category.name}</span>}
                      <span style={{ fontSize:10,color:"hsl(var(--muted-foreground))" }}>SKU: {product.sku}</span>
                    </div>
                  </div>
                  <span style={{ display:"flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:99,background:si.bg,flexShrink:0 }}>
                    <si.icon style={{ width:11,height:11,color:si.color }} />
                    <span style={{ fontSize:11,fontWeight:600,color:si.color }}>{si.label}</span>
                  </span>
                </div>
                {product.description&&<p style={{ fontSize:12,color:"hsl(var(--muted-foreground))",marginBottom:10,lineHeight:1.5 }} className="line-clamp-2">{product.description}</p>}
                <div style={{ background:"rgba(120,120,128,.07)",borderRadius:12,padding:"10px 12px",marginBottom:12 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                    <span style={{ fontSize:11,color:"hsl(var(--muted-foreground))" }}>{t('selling_price')}</span>
                    <span style={{ fontSize:20,fontWeight:700,color:"hsl(var(--primary))",letterSpacing:"-0.02em" }}>
                      ₹{product.sellingPrice.toLocaleString()}<span style={{ fontSize:11,fontWeight:400,color:"hsl(var(--muted-foreground))",marginLeft:3 }}>/{product.unit}</span>
                    </span>
                  </div>
                  <div style={{ height:"0.5px",background:"rgba(60,60,67,.12)" }} />
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6 }}>
                    <span style={{ fontSize:11,color:"hsl(var(--muted-foreground))" }}>{t('current_stock_label')}</span>
                    <span style={{ fontSize:16,fontWeight:700,color:si.color }}>{product.currentStock} {product.unit}s</span>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={() => setEditing(product)} style={{ width:34,height:34,borderRadius:9,background:"rgba(0,122,255,.10)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#007AFF" }} className="hover:bg-[rgba(0,122,255,.18)]"><Edit style={{ width:15,height:15 }} /></button>
                    <button onClick={() => setDeleting(product)} style={{ width:34,height:34,borderRadius:9,background:"rgba(255,59,48,.09)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#FF3B30" }} className="hover:bg-[rgba(255,59,48,.17)]"><Trash2 style={{ width:15,height:15 }} /></button>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:10,color:"hsl(var(--muted-foreground))",marginBottom:1 }}>Cost</p>
                    <p style={{ fontSize:13,fontWeight:600 }}>₹{product.costPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {filtered.length===0&&(
          <div className="glass" style={{ padding:"56px 24px",borderRadius:20,textAlign:"center" }}>
            <Package style={{ width:44,height:44,margin:"0 auto 12px",opacity:.2 }} />
            <p style={{ fontSize:17,fontWeight:600,color:"hsl(var(--foreground))" }}>{t('no_products_found')}</p>
            <div style={{ display:"flex",justifyContent:"center",gap:10,marginTop:16 }}>
              <button onClick={()=>{setSelectedCategory('All')}} style={{ padding:"8px 18px",borderRadius:10,background:"rgba(120,120,128,.12)",border:"none",fontSize:14,cursor:"pointer" }}>Clear filters</button>
              <button onClick={()=>setAddOpen(true)} className="hig-btn hig-btn-filled hig-btn-sm">{t('add_product')}</button>
            </div>
          </div>
        )}
        <AddProductDialog open={addOpen} onOpenChange={setAddOpen} onProductAdded={handleAdded} categories={categories} />
        <EditProductDialog product={editing} onOpenChange={open=>!open&&setEditing(null)} onProductUpdated={handleUpdated} categories={categories} />
        <DeleteProductDialog product={deleting} onOpenChange={open=>!open&&setDeleting(null)} onProductDeleted={handleDeleted} />
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════════
     PUBLIC CONSUMER VIEW — /products
     Full i18n (EN/MR). Shows only In Stock / Out of Stock.
     NO stock numbers, NO SKU, NO cost price, NO admin controls.
     Designed for Maharashtra village farmers.
     ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="hig-page-enter" style={{ background:"hsl(var(--background))" }}>

      {/* ── Hero banner ── */}
      <div style={{ background:"linear-gradient(160deg,#1a5c34 0%,#2a7a48 40%,#1e4d6b 100%)", padding:"52px 20px 44px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"0%",right:"-5%",width:320,height:320,borderRadius:"50%",background:"rgba(255,200,50,.10)",filter:"blur(80px)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"-20%",left:"-5%",width:280,height:280,borderRadius:"50%",background:"rgba(52,199,89,.12)",filter:"blur(70px)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",inset:0,opacity:.035,backgroundImage:"radial-gradient(circle at 1.5px 1.5px,white 1.5px,transparent 0)",backgroundSize:"22px 22px",pointerEvents:"none" }} />

        <div style={{ maxWidth:640,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center",color:"white" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:14 }}>
            <Sprout style={{ width:16,height:16,opacity:.8 }} />
            <span style={{ fontSize:12,fontWeight:600,letterSpacing:"0.10em",textTransform:"uppercase",opacity:.75 }}>
              Krushi Kendra
            </span>
          </div>
          <h1 style={{ fontSize:"clamp(24px,5vw,36px)",fontWeight:800,letterSpacing:"-0.022em",lineHeight:1.18,marginBottom:12 }}>
            {t("pub_hero_title")}
          </h1>
          <p style={{ fontSize:15,color:"rgba(255,255,255,.65)",lineHeight:1.65,maxWidth:460,margin:"0 auto 28px" }}>
            {t("pub_hero_subtitle")}
          </p>
          {/* Primary CTAs for farmers */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap",marginBottom:28 }}>
            <a href={`tel:${biz.phone}`}
              style={{ display:"flex",alignItems:"center",gap:7,padding:"11px 22px",borderRadius:99,background:"#34C759",color:"white",fontSize:15,fontWeight:700,textDecoration:"none",boxShadow:"0 4px 18px rgba(52,199,89,.45)",transition:"all .15s" }}
              className="hover:opacity-90 active:scale-[.97]">
              <Phone style={{ width:16,height:16 }} />{t("pub_call_cta")}
            </a>
            <Link to="/contact"
              style={{ display:"flex",alignItems:"center",gap:6,padding:"11px 22px",borderRadius:99,background:"rgba(255,255,255,.12)",color:"white",fontSize:14,fontWeight:600,textDecoration:"none",backdropFilter:"blur(8px)",border:"0.5px solid rgba(255,255,255,.25)" }}
              className="hover:bg-white/20 transition-colors">
              {t("pub_visit_us")}
            </Link>
          </div>
          {/* Search in hero */}
          <div style={{ maxWidth:460,margin:"0 auto",background:"rgba(255,255,255,.14)",backdropFilter:"blur(16px)",borderRadius:14,border:"0.5px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",gap:8,padding:"0 14px",height:50 }}>
            <Search style={{ width:18,height:18,color:"rgba(255,255,255,.65)",flexShrink:0 }} />
            <input placeholder={t("pub_search_placeholder")} value={pubSearch} onChange={e => setPubSearch(e.target.value)}
              style={{ flex:1,background:"transparent",border:"none",outline:"none",fontSize:15,color:"white",fontFamily:"inherit" }} className="placeholder:text-white/50" />
            {pubSearch && <button onClick={() => setPubSearch("")} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.6)",padding:0,display:"flex" }}><X style={{ width:16,height:16 }} /></button>}
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ background:"hsl(var(--card))",borderBottom:"0.5px solid rgba(60,60,67,.12)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(16px,4vw,48px)",flexWrap:"wrap" }}>
          {[
            { v:"5000+", l:"Farmers Served" },
            { v:"10+",   l:"Years Experience" },
            { v:"24/7",  l:"Support" },
            { v:"100%",  l:"Genuine Products" },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:"center",flexShrink:0 }}>
              <p style={{ fontSize:20,fontWeight:800,color:"hsl(var(--primary))",letterSpacing:"-0.02em",lineHeight:1 }}>{s.v}</p>
              <p style={{ fontSize:11,color:"hsl(var(--muted-foreground))",marginTop:2 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"24px 16px 64px" }}>

        {/* ── Category filter chips ── */}
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                padding:"7px 16px",borderRadius:99,fontSize:13,fontWeight:500,
                background:selectedCategory===cat?"hsl(var(--primary))":"hsl(var(--card))",
                color:selectedCategory===cat?"white":"hsl(var(--foreground))",
                border:selectedCategory===cat?"none":"0.5px solid rgba(60,60,67,.18)",
                cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,
                boxShadow:selectedCategory===cat?"0 2px 10px hsl(var(--primary)/.28)":"0 1px 3px rgba(0,0,0,.06)",
                transition:"all .15s ease",
              }}>
              {cat === 'All' ? t("pub_all_categories") : cat}
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => {
              const available = isAvailable(product)
              return (
                <div key={product.id} className="glass-widget" style={{ padding:0,overflow:"hidden" }}>
                  {/* Image — dynamic, based on product name via useProductImage hook */}
                  <div style={{ position:"relative",aspectRatio:"4/3",overflow:"hidden",borderRadius:"22px 22px 0 0",background:"#e8f0e8" }}>
                    <ProductImage
                      name={product.name}
                      category={product.category?.name || ''}
                      style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease" }}
                      className="hover:scale-105" />
                    {/* In Stock / Out of Stock badge — the ONLY stock info shown */}
                    <div style={{ position:"absolute",top:10,right:10 }}>
                      <span style={{
                        display:"flex",alignItems:"center",gap:4,
                        padding:"4px 10px",borderRadius:99,fontSize:11,fontWeight:700,
                        background:available?"rgba(52,199,89,.92)":"rgba(255,59,48,.88)",
                        color:"white",backdropFilter:"blur(8px)",
                        boxShadow:"0 2px 8px rgba(0,0,0,.22)",
                      }}>
                        <span style={{ width:5,height:5,borderRadius:"50%",background:"white",display:"inline-block",opacity:.9 }} />
                        {available ? t("pub_in_stock") : t("pub_out_of_stock")}
                      </span>
                    </div>
                    {product.category?.name && (
                      <span style={{ position:"absolute",bottom:10,left:10,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(0,0,0,.40)",color:"white",backdropFilter:"blur(8px)" }}>
                        {product.category.name}
                      </span>
                    )}
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"40%",background:"linear-gradient(transparent,rgba(0,0,0,.28))" }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding:"14px 15px 15px" }}>
                    <h3 style={{ fontSize:15,fontWeight:700,color:"hsl(var(--foreground))",letterSpacing:"-0.01em",lineHeight:1.3,marginBottom:4 }}>
                      {product.name}
                    </h3>
                    {product.description && (
                      <p style={{ fontSize:12,color:"hsl(var(--muted-foreground))",lineHeight:1.55,marginBottom:10 }} className="line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price + availability — NO stock count */}
                    <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:12,gap:8 }}>
                      <div>
                        <p style={{ fontSize:10,color:"hsl(var(--muted-foreground))",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2 }}>{t("pub_price")}</p>
                        <p style={{ fontSize:22,fontWeight:800,color:"hsl(var(--primary))",letterSpacing:"-0.022em",lineHeight:1 }}>
                          ₹{product.sellingPrice.toLocaleString()}
                          <span style={{ fontSize:11,fontWeight:400,color:"hsl(var(--muted-foreground))",marginLeft:3 }}>/{product.unit}</span>
                        </p>
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <p style={{ fontSize:13,fontWeight:700,color:available?"#34C759":"#FF3B30",display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end" }}>
                          {available
                            ? <><CheckCircle style={{ width:13,height:13 }} />{t("pub_available")}</>
                            : <><AlertCircle style={{ width:13,height:13 }} />{t("pub_unavailable")}</>
                          }
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href={available ? `tel:${biz.phone}` : undefined}
                      style={{
                        display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                        width:"100%",height:42,borderRadius:12,
                        background:available?"hsl(var(--primary))":"rgba(120,120,128,.12)",
                        color:available?"white":"hsl(var(--muted-foreground))",
                        fontSize:13,fontWeight:700,textDecoration:"none",
                        boxShadow:available?"0 3px 12px hsl(var(--primary)/.28)":"none",
                        transition:"all .15s ease",
                        cursor:available?"pointer":"default",
                        pointerEvents:available?"auto":"none",
                      }}
                      className={available?"hover:opacity-90 active:scale-[.98]":""}
                    >
                      <Phone style={{ width:14,height:14 }} />
                      {available ? t("pub_enquire") : t("pub_currently_unavailable")}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="glass" style={{ padding:"60px 24px",borderRadius:20,textAlign:"center",maxWidth:420,margin:"0 auto" }}>
            <div style={{ width:60,height:60,borderRadius:15,background:"rgba(120,120,128,.10)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
              <Leaf style={{ width:30,height:30,color:"hsl(var(--primary))",opacity:.5 }} />
            </div>
            <p style={{ fontSize:17,fontWeight:700,color:"hsl(var(--foreground))" }}>{t("pub_no_products")}</p>
            <p style={{ fontSize:14,color:"hsl(var(--muted-foreground))",marginTop:5,lineHeight:1.5 }}>{t("pub_no_products_sub")}</p>
            <button onClick={() => { setPubSearch(""); setSelectedCategory("All") }} className="hig-btn hig-btn-tinted hig-btn-sm" style={{ marginTop:16 }}>
              {t("pub_clear_filters")}
            </button>
          </div>
        )}

        {/* ── Why Us trust badges ── */}
        <div style={{ marginTop:48 }}>
          <p style={{ fontSize:20,fontWeight:700,color:"hsl(var(--foreground))",marginBottom:16,textAlign:"center",letterSpacing:"-0.015em" }}>
            {t("pub_why_us")}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji:"🌾", title:t("pub_trust_1_title"), desc:t("pub_trust_1_desc"), bg:"rgba(52,199,89,.08)",  border:"rgba(52,199,89,.18)" },
              { emoji:"👨‍🌾", title:t("pub_trust_2_title"), desc:t("pub_trust_2_desc"), bg:"rgba(0,122,255,.08)",  border:"rgba(0,122,255,.18)" },
              { emoji:"📞", title:t("pub_trust_3_title"), desc:t("pub_trust_3_desc"), bg:"rgba(255,149,0,.08)",  border:"rgba(255,149,0,.18)" },
              { emoji:"💰", title:t("pub_trust_4_title"), desc:t("pub_trust_4_desc"), bg:"rgba(175,82,222,.08)", border:"rgba(175,82,222,.18)" },
            ].map((b,i) => (
              <div key={i} className="glass-action" style={{ padding:"16px 14px",textAlign:"center",background:b.bg,border:`0.5px solid ${b.border}` }}>
                <div style={{ fontSize:28,marginBottom:8,lineHeight:1 }}>{b.emoji}</div>
                <p style={{ fontSize:13,fontWeight:700,color:"hsl(var(--foreground))",lineHeight:1.3 }}>{b.title}</p>
                <p style={{ fontSize:11,color:"hsl(var(--muted-foreground))",marginTop:4,lineHeight:1.4 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Call CTA banner ── */}
        <div style={{ marginTop:40,padding:"28px 24px",borderRadius:20,textAlign:"center",background:"linear-gradient(135deg,#1a5c34,#2a7a48)",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"-30%",right:"-5%",width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)",pointerEvents:"none" }} />
          <p style={{ fontSize:13,fontWeight:600,color:"rgba(255,255,255,.7)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>
            Krushi Kendra · Penur, Parbhani
          </p>
          <p style={{ fontSize:22,fontWeight:800,color:"white",letterSpacing:"-0.018em",marginBottom:6 }}>{biz.phone}</p>
          <p style={{ fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:18 }}>{t("pub_timings")}</p>
          <a href={`tel:${biz.phone}`}
            style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"12px 28px",borderRadius:99,background:"#34C759",color:"white",fontSize:15,fontWeight:700,textDecoration:"none",boxShadow:"0 4px 18px rgba(52,199,89,.45)" }}
            className="hover:opacity-90 active:scale-[.97]">
            <Phone style={{ width:17,height:17 }} />
            {t("pub_call_cta")}
          </a>
        </div>
      </div>
    </div>
  )
}
