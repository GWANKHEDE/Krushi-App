import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { History, Receipt, Minus, Plus, X, Package } from 'lucide-react'
import { getProducts, getCustomers, createSale, type Product, type PaymentMethod } from '@/lib/store'
import { BillingHistory } from '@/components/BillingHistory'
import { PDFGenerator } from '@/components/PDFGenerator'
import { toast } from '@/lib/toast'
import { mockApi } from '@/services/mockApi'

interface CartItem extends Product { quantity: number }

export default function Billing() {
  const [products] = useState(getProducts())
  const [customers] = useState(getCustomers())
  const [tab, setTab] = useState('new-bill')
  const { t } = useTranslation()
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [billPreview, setBillPreview] = useState<any>(null)
  const [lastInvoice, setLastInvoice] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [payment, setPayment] = useState<PaymentMethod>('CASH')
  const [amountPaid, setAmountPaid] = useState<string>('')
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full')
  const [dueDate, setDueDate] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [search, setSearch] = useState('')

  const available = useMemo(() =>
    products.filter(p => p.isActive && p.currentStock > 0 &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    ), [products, search])

  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id)
      if (existing) {
        if (existing.quantity >= p.currentStock) { toast.error(`Only ${p.currentStock} available`); return prev }
        return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i
      const newQty = i.quantity + delta
      const max = products.find(p => p.id === id)?.currentStock || 0
      if (newQty > max) { toast.error(`Only ${max} available`); return i }
      return newQty < 1 ? i : { ...i, quantity: newQty }
    }))
  }

  const subtotal = cart.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.sellingPrice) || 0), 0)
  const taxRate = 0.18
  const tax = subtotal * taxRate
  const total = subtotal + tax
  const totalItems = cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0)

  const handlePreview = () => {
    const isNew = selectedCustomer === 'new' || !selectedCustomer
    if (isNew && !customerName.trim()) { toast.error('Customer name required'); return }
    if (cart.length === 0) { toast.error('Add items to cart'); return }

    const cust = !isNew ? customers.find(c => c.id === selectedCustomer) : null

    // Ensure amount Paid doesn't exceed total
    const paidValue = paymentType === 'full' ? total : (amountPaid ? Number(amountPaid) : 0);
    if (paidValue < 0 || paidValue > total) {
      toast.error('Invalid payment amount');
      return;
    }

    setBillPreview({
      customerName: cust?.name || customerName, customerPhone: cust?.phone || customerPhone,
      customerId: cust?.id, items: cart, subtotal, tax, totalDiscount: 0, overallDiscount: 0,
      grandTotal: total, amountPaid: paidValue, balanceDue: total - paidValue, paymentMethod: payment,
      createdAt: new Date().toLocaleDateString(),
      dueDate: paymentType === 'partial' ? dueDate : undefined
    })
    setLastInvoice(null)
    setShowModal(true)
  }

  const handleConfirm = async () => {
    if (!billPreview) return
    setProcessing(true)
    try {
      const sale = createSale({
        customerId: billPreview.customerId, customerName: billPreview.customerName,
        customerPhone: billPreview.customerPhone,
        saleItems: cart.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.sellingPrice, totalPrice: i.quantity * i.sellingPrice })),
        subtotal, taxAmount: tax, totalAmount: total, paymentMethod: payment,
        paymentStatus: billPreview.balanceDue > 0 ? 'PARTIALLY_PAID' : 'PAID', notes: 'Via Admin Panel',
        dueDate: billPreview.dueDate
      })

      // Sync partial or full payment to mock Khatabook if customer is selected or newly created
      if (sale.customerId && billPreview.amountPaid > 0) {
        await mockApi.recordPayment({
          entityId: sale.customerId,
          amount: billPreview.amountPaid,
          method: payment,
          type: 'customer'
        });
      }

      setLastInvoice(sale.invoiceNumber)
      toast.success('Invoice created successfully!')
      setCart([]); setCustomerName(''); setCustomerPhone(''); setSelectedCustomer(''); setAmountPaid('');
    } catch { toast.error('Failed to create invoice') }
    finally { setProcessing(false) }
  }

  return (
    <div className="container px-4 py-6">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Billing</h1>
            <p className="text-xs text-muted-foreground font-medium italic">Manage customer transactions.</p>
          </div>
          <TabsList className="grid w-full sm:w-[340px] grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger value="new-bill" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Receipt className="mr-2 h-4 w-4" />{t('new_bill')}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="mr-2 h-4 w-4" />{t('history')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new-bill" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t('search')}
                  className="h-10 text-base border-primary/20 focus-visible:ring-primary shadow-sm rounded-xl"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Card className="border-none shadow-medium bg-secondary/20">
                <CardContent className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {available.map(p => {
                    const cartItem = cart.find(i => i.id === p.id);
                    return (
                      <div key={p.id} className="group relative border border-primary/10 p-4 rounded-xl hover:shadow-lg transition-all bg-card hover:bg-card/80">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm line-clamp-2 min-h-[40px] text-foreground/90 group-hover:text-primary transition-colors">{p.name}</h4>
                          <Badge variant={p.currentStock <= 5 ? 'destructive' : 'secondary'} className="text-[10px] sm:text-xs">
                            {p.currentStock} {p.unit}
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-xl font-bold text-primary">₹{p.sellingPrice}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">/{p.unit}</span>
                        </div>

                        {cartItem ? (
                          <div className="flex items-center justify-between bg-primary/5 rounded-lg p-1 border border-primary/20">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20" onClick={() => updateQty(p.id, -1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-bold text-sm mx-2">{cartItem.quantity}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20" onClick={() => updateQty(p.id, 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full h-9 rounded-lg font-bold text-xs uppercase tracking-wide gap-2 shadow-sm"
                            onClick={() => addToCart(p)}
                          >
                            <Plus className="h-3.5 w-3.5" /> {t('add_to_cart')}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                  {available.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-2xl border-2 border-dashed border-muted">
                      <Package className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No products match your search</p>
                      <Button variant="link" onClick={() => setSearch('')}>Clear all filters</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Cart */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3 border-b"><CardTitle className="text-base">{t('customers')}</CardTitle></CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger><SelectValue placeholder={t('select_customer')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">+ {t('new_customer')}</SelectItem>
                      {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {(!selectedCustomer || selectedCustomer === 'new') && (
                    <div className="space-y-2 animate-in fade-in">
                      <Input placeholder={t('customer_name')} value={customerName} onChange={e => setCustomerName(e.target.value)} />
                      <Input placeholder={t('phone_number')} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="flex flex-col h-[550px] shadow-lg border-primary/10 overflow-hidden">
                <CardHeader className="py-2.5 bg-muted/30 border-b px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" /> {t('cart')} ({totalItems})
                    </CardTitle>
                    <Badge variant="secondary" className="font-bold text-primary">₹{subtotal.toFixed(2)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-40">
                      <Receipt className="h-12 w-12 mb-2" /><p className="text-xs font-bold uppercase">{t('cart')} Is Empty</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-primary/5">
                      {cart.map(item => (
                        <div key={item.id} className="p-3 flex justify-between items-center hover:bg-muted/30 transition-colors group">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="font-bold text-xs truncate text-foreground/80">{item.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground italic">₹{item.sellingPrice} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center bg-secondary/50 rounded-lg border border-primary/5 p-0.5">
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                              <span className="w-5 text-center text-[10px] font-bold">{item.quantity}</span>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                            </div>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => setCart(c => c.filter(i => i.id !== item.id))}><X className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <div className="p-4 border-t bg-card space-y-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                  {/* Totals Section */}
                  <div className="space-y-1 text-[11px] font-bold uppercase tracking-tight">
                    <div className="flex justify-between text-muted-foreground/70">
                      <span>{t('subtotal')}</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground/70">
                      <span>{t('gst')} (18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black pt-1.5 border-t border-dashed text-foreground mt-1">
                      <span className="text-primary italic">{t('total')}</span>
                      <span className="text-green-600 dark:text-green-400 font-mono">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Configuration */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    <div className="col-span-2">
                      <Select value={payment} onValueChange={v => setPayment(v as PaymentMethod)}>
                        <SelectTrigger className="h-9 text-[10px] font-bold uppercase bg-muted/50 border-primary/10 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="CARD">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 relative">
                      <Input
                        placeholder={t('paid')}
                        value={paymentType === 'full' ? total.toFixed(2) : amountPaid}
                        onChange={e => setAmountPaid(e.target.value)}
                        disabled={paymentType === 'full'}
                        className="h-9 pr-8 text-right font-mono font-bold text-sm bg-muted/50 border-primary/10 rounded-lg focus-visible:ring-primary"
                        type="number"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-muted-foreground/50 pointer-events-none">{t('paid')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <RadioGroup value={paymentType} onValueChange={(v: 'full' | 'partial') => setPaymentType(v)} className="flex items-center justify-between px-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="r-full" className="h-3.5 w-3.5" />
                        <Label htmlFor="r-full" className="text-[10px] font-black uppercase tracking-wider cursor-pointer text-muted-foreground data-[state=checked]:text-primary">{t('full_payment')}</Label>
                      </div>
                      {selectedCustomer && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partial" id="r-partial" className="h-3.5 w-3.5 border-orange-400 text-orange-600" />
                          <Label htmlFor="r-partial" className="text-[10px] font-black uppercase tracking-wider cursor-pointer text-orange-600/70">{t('partial_khata')}</Label>
                        </div>
                      )}
                    </RadioGroup>

                    {paymentType === 'partial' && (
                      <div className="flex items-center gap-2 bg-orange-50/50 dark:bg-orange-950/10 p-2 rounded-lg border border-orange-200/50 animate-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="due-date" className="text-[9px] font-black uppercase tracking-widest text-orange-700/70 whitespace-nowrap">{t('due_date')}</Label>
                        <Input
                          id="due-date"
                          type="date"
                          value={dueDate}
                          onChange={e => setDueDate(e.target.value)}
                          className="h-7 text-[10px] font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-orange-700 text-right"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-10 text-xs uppercase tracking-[0.2em] font-black rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] shadow-md border-none"
                    disabled={cart.length === 0}
                    onClick={handlePreview}
                  >
                    {t('generate_bill')}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history"><BillingHistory /></TabsContent>
      </Tabs>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Invoice Preview</DialogTitle></DialogHeader>
          {billPreview && (
            !lastInvoice ? (
              <div className="border p-6 rounded-lg text-center space-y-4 max-w-lg mx-auto bg-muted/10">
                <h3 className="text-lg font-bold uppercase tracking-tight">Review Bill Details</h3>
                <div className="text-left space-y-2 text-sm bg-background p-4 rounded-lg shadow-sm border">
                  <p><strong>Customer:</strong> {billPreview.customerName}</p>
                  <p><strong>Items:</strong> {billPreview.items.length}</p>
                  <p><strong>Grand Total:</strong> ₹{billPreview.grandTotal.toFixed(2)}</p>
                  <p><strong>Amount Paid:</strong> ₹{billPreview.amountPaid.toFixed(2)}</p>
                  <p><strong>Balance Due:</strong> ₹{billPreview.balanceDue.toFixed(2)}</p>
                  <p><strong>Payment:</strong> {billPreview.paymentMethod}</p>
                </div>
                <Button onClick={handleConfirm} disabled={processing} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  {processing ? 'Creating...' : 'Confirm & Create Invoice'}
                </Button>
              </div>
            ) : (
              <PDFGenerator billData={billPreview} invoiceNumber={lastInvoice} customerPhone={billPreview.customerPhone || ''} onSuccess={() => { }} />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
