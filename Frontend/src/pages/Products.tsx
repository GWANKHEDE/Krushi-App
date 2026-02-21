import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Package, AlertCircle, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct as removeProduct, type Product, type Category } from '@/lib/store'
import AddProductDialog from '../components/AddProductDialog'
import EditProductDialog from '../components/EditProductDialog'
import DeleteProductDialog from '../components/DeleteProductDialog'
import { useLocation } from 'react-router-dom'
import { toast } from '@/lib/toast'

export default function Products() {
  const [products, setProducts] = useState<Product[]>(getProducts())
  const [categories] = useState<Category[]>(getCategories())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStock, setSelectedStock] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const reload = () => setProducts(getProducts())

  const filtered = useMemo(() => {
    let items = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = selectedCategory === 'All' || p.category?.name === selectedCategory
      const matchStock = selectedStock === 'All' ||
        (selectedStock === 'In Stock' && p.currentStock > p.lowStockAlert) ||
        (selectedStock === 'Low Stock' && p.currentStock <= p.lowStockAlert && p.currentStock > 0) ||
        (selectedStock === 'Out of Stock' && p.currentStock === 0)
      return matchSearch && matchCat && matchStock && p.isActive
    })
    items.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.sellingPrice - b.sellingPrice
        case 'price-high': return b.sellingPrice - a.sellingPrice
        case 'stock': return b.currentStock - a.currentStock
        default: return a.name.localeCompare(b.name)
      }
    })
    return items
  }, [products, searchTerm, selectedCategory, selectedStock, sortBy])

  const stockInfo = (p: Product) => {
    if (p.currentStock === 0) return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-destructive', icon: AlertCircle }
    if (p.currentStock <= p.lowStockAlert) return { label: 'Low Stock', variant: 'destructive' as const, color: 'text-warning', icon: AlertCircle }
    return { label: 'In Stock', variant: 'default' as const, color: 'text-success', icon: CheckCircle }
  }

  const handleAdded = () => { reload(); setAddOpen(false); toast.success('Product added successfully') }
  const handleUpdated = () => { reload(); setEditing(null); toast.warning('Product updated successfully') }
  const handleDeleted = () => { reload(); setDeleting(null); toast.error('Product deleted successfully') }

  return (
    <div className="container px-4 py-6 md:py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Inventory</h1>
          <p className="text-xs text-muted-foreground font-medium italic">Monitor your agricultural stock levels.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setAddOpen(true)} className="rounded-xl h-8 px-5 font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center">
            <Plus className="h-4 w-4 mr-2" />Add Product
          </Button>
        )}
      </div>

      {/* Filters Section */}
      <Card className="border-none shadow-soft bg-secondary/10 p-4 rounded-2xl overflow-hidden ring-1 ring-primary/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 h-4 w-4" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-8 bg-background border-primary/10 rounded-xl focus-visible:ring-primary shadow-sm font-medium text-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8 rounded-xl border-primary/10 bg-background shadow-sm font-bold text-sm">
              <div className="flex items-center gap-2"><Filter className="h-4 w-4 opacity-40" /><SelectValue placeholder="Category" /></div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger className="h-8 rounded-xl border-primary/10 bg-background shadow-sm font-bold text-sm">
              <div className="flex items-center gap-2"><Package className="h-4 w-4 opacity-40" /><SelectValue placeholder="Stock" /></div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="All">All Stock Levels</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            className="h-8 rounded-xl text-primary font-bold uppercase tracking-widest hover:bg-primary/5 text-xs flex items-center justify-center"
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStock('All'); setSortBy('name') }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Stock summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p className="text-sm font-bold text-primary/80 uppercase tracking-widest">
          Showing <span className="text-primary">{filtered.length} items</span> matching results
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-7 px-3 rounded-lg border-success/30 bg-success/10 text-success font-black uppercase text-[9px]">Healthy: {products.filter(p => p.currentStock > p.lowStockAlert).length}</Badge>
          <Badge variant="outline" className="h-7 px-3 rounded-lg border-warning/30 bg-warning/10 text-warning font-black uppercase text-[9px]">Low: {products.filter(p => p.currentStock <= p.lowStockAlert && p.currentStock > 0).length}</Badge>
          <Badge variant="outline" className="h-7 px-3 rounded-lg border-destructive/30 bg-destructive/10 text-destructive font-black uppercase text-[9px]">Out: {products.filter(p => p.currentStock === 0).length}</Badge>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filtered.map(product => {
          const si = stockInfo(product)
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all group border-none shadow-soft ring-1 ring-primary/5 hover:ring-primary/20 rounded-[2rem] bg-card/60 backdrop-blur-sm">
              <div className={`h-2 w-full bg-gradient-to-r ${si.label === 'In Stock' ? 'from-green-500 to-emerald-600' : si.label === 'Low Stock' ? 'from-orange-400 to-orange-600' : 'from-red-500 to-red-700'}`} />
              <CardHeader className="pb-4 pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-foreground/90 group-hover:text-primary transition-colors leading-tight">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest py-0.5">{product.category?.name}</Badge>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">SKU: {product.sku}</span>
                    </div>
                  </div>
                  <Badge variant={si.variant} className={`shrink-0 h-8 rounded-xl font-bold uppercase px-3 text-[10px] border-none ${si.label === 'In Stock' ? 'bg-success text-success-foreground' : ''}`}>
                    <si.icon className="h-3.5 w-3.5 mr-1" />{si.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                {product.description && <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">"{product.description}"</p>}

                <div className="bg-primary/5 rounded-2xl p-4 space-y-4 border border-primary/5">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Selling Price</span>
                    <span className="font-bold text-primary text-2xl tabular-nums tracking-tighter">
                      ₹{product.sellingPrice.toLocaleString()}
                      <span className="text-xs font-bold text-muted-foreground ml-1 uppercase">/{product.unit}</span>
                    </span>
                  </div>

                  <div className="h-px bg-primary/10" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package className={`h-4 w-4 ${si.color} opacity-40`} />
                      <span className="text-xs font-bold text-muted-foreground uppercase">Current Stock</span>
                    </div>
                    <span className={`font-black tracking-tight text-lg tabular-nums ${si.color}`}>
                      {product.currentStock} {product.unit}s
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => setEditing(product)} className="h-8 w-8 rounded-xl border-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setDeleting(product)} className="h-8 w-8 rounded-xl border-destructive/10 text-destructive hover:bg-destructive hover:text-white shadow-sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black uppercase text-muted-foreground block leading-none mb-1">Company Cost</span>
                      <span className="text-xs font-bold font-mono">₹{product.costPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-muted/50 rounded-[3rem] border-2 border-dashed border-primary/20 py-24 flex flex-col items-center justify-center text-center px-4">
          <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-primary/20" />
          </div>
          <h3 className="text-xl font-bold text-foreground/80 mb-2 uppercase tracking-tight">No products found</h3>
          <p className="text-muted-foreground max-w-sm mb-8 font-medium italic">We couldn't find any products matching your current filters. Try clearing them to see more.</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStock('All') }} className="h-8 rounded-2xl px-8 font-bold uppercase tracking-widest border-primary/20 flex items-center justify-center">Clear All Filters</Button>
            {isAdmin && <Button onClick={() => setAddOpen(true)} className="h-8 rounded-2xl px-8 font-bold uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center">Add New Product</Button>}
          </div>
        </div>
      )}

      <AddProductDialog open={addOpen} onOpenChange={setAddOpen} onProductAdded={handleAdded} categories={categories} />
      <EditProductDialog product={editing} onOpenChange={open => !open && setEditing(null)} onProductUpdated={handleUpdated} categories={categories} />
      <DeleteProductDialog product={deleting} onOpenChange={open => !open && setDeleting(null)} onProductDeleted={handleDeleted} />
    </div>
  )
}
