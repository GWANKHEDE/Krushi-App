import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { History, Receipt, Minus, Plus, X, Package, ShoppingCart, Search } from 'lucide-react'
import { getProducts, getCustomers, createSale, type Product, type PaymentMethod } from '@/lib/store'
import { BillingHistory } from '@/components/BillingHistory'
import { PDFGenerator } from '@/components/PDFGenerator'
import { toast } from '@/lib/toast'
import { mockApi } from '@/services/mockApi'

interface CartItem extends Product { quantity: number }

export default function Billing() {
  const [products] = useState(getProducts())
  const [customers] = useState(getCustomers())
  const [tab, setTab] = useState<'new-bill' | 'history'>('new-bill')
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

  const subtotal = cart.reduce((s, i) => s + (i.quantity * i.sellingPrice), 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

  const handlePreview = () => {
    const isNew = selectedCustomer === 'new' || !selectedCustomer
    if (isNew && !customerName.trim()) { toast.error('Customer name required'); return }
    if (cart.length === 0) { toast.error('Add items to cart'); return }
    const cust = !isNew ? customers.find(c => c.id === selectedCustomer) : null
    const paidValue = paymentType === 'full' ? total : (amountPaid ? Number(amountPaid) : 0)
    if (paidValue < 0 || paidValue > total) { toast.error('Invalid payment amount'); return }
    setBillPreview({
      customerName: cust?.name || customerName, customerPhone: cust?.phone || customerPhone,
      customerId: cust?.id, items: cart, subtotal, tax, totalDiscount: 0, overallDiscount: 0,
      grandTotal: total, amountPaid: paidValue, balanceDue: total - paidValue, paymentMethod: payment,
      createdAt: new Date().toLocaleDateString(), dueDate: paymentType === 'partial' ? dueDate : undefined
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
      if (sale.customerId && billPreview.amountPaid > 0) {
        await mockApi.recordPayment({ entityId: sale.customerId, amount: billPreview.amountPaid, method: payment, type: 'customer' })
      }
      setLastInvoice(sale.invoiceNumber)
      toast.success('Invoice created!')
      setCart([]); setCustomerName(''); setCustomerPhone(''); setSelectedCustomer(''); setAmountPaid('')
    } catch { toast.error('Failed to create invoice') }
    finally { setProcessing(false) }
  }

  return (
    <div className="space-y-5 hig-page-enter">
      {/* Header + segmented control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="ios-title-1" style={{ color: "hsl(var(--foreground))" }}>Billing</h1>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Manage customer transactions</p>
        </div>
        <div className="hig-segmented w-full sm:w-60 flex-shrink-0">
          <button className={`hig-seg ${tab === 'new-bill' ? 'active' : ''}`} onClick={() => setTab('new-bill')}>
            <Receipt style={{ width: 13, height: 13, marginRight: 4 }} />{t('new_bill')}
          </button>
          <button className={`hig-seg ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
            <History style={{ width: 13, height: 13, marginRight: 4 }} />{t('history')}
          </button>
        </div>
      </div>

      {tab === 'history' && <BillingHistory />}

      {tab === 'new-bill' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Product grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="hig-search">
              <Search style={{ width: 15, height: 15, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
              <input placeholder={t('search') + ' products…'} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Products glass grid */}
            <div className="glass" style={{ padding: 16, borderRadius: 18 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {available.map(p => {
                  const cartItem = cart.find(i => i.id === p.id)
                  return (
                    <div key={p.id} className="glass-action" style={{ padding: "12px 10px", borderRadius: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1.3 }} className="line-clamp-2 flex-1 min-w-0 mr-1">{p.name}</p>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 99, background: p.currentStock <= 5 ? "rgba(255,59,48,0.1)" : "rgba(52,199,89,0.1)", color: p.currentStock <= 5 ? "#FF3B30" : "#34C759", flexShrink: 0 }}>
                          {p.currentStock} {p.unit}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--primary))", letterSpacing: "-0.02em" }}>₹{p.sellingPrice}</span>
                        <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>/{p.unit}</span>
                      </div>
                      {cartItem ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,122,255,0.08)", borderRadius: 9, padding: "2px 4px" }}>
                          <button style={{ width: 28, height: 28, borderRadius: 7, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#007AFF" }} className="hover:bg-[rgba(0,122,255,0.12)]" onClick={() => updateQty(p.id, -1)}>
                            <Minus style={{ width: 13, height: 13 }} />
                          </button>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#007AFF" }}>{cartItem.quantity}</span>
                          <button style={{ width: 28, height: 28, borderRadius: 7, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#007AFF" }} className="hover:bg-[rgba(0,122,255,0.12)]" onClick={() => updateQty(p.id, 1)}>
                            <Plus style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)} className="hig-btn hig-btn-tinted hig-btn-sm w-full" style={{ borderRadius: 9, height: 32, fontSize: 12 }}>
                          <Plus style={{ width: 13, height: 13, marginRight: 4 }} />{t('add_to_cart')}
                        </button>
                      )}
                    </div>
                  )
                })}
                {available.length === 0 && (
                  <div className="col-span-full" style={{ padding: "48px 0", textAlign: "center" }}>
                    <Package style={{ width: 40, height: 40, margin: "0 auto 10px", opacity: 0.2 }} />
                    <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))" }}>No products found</p>
                    <button onClick={() => setSearch('')} style={{ fontSize: 13, color: "#007AFF", background: "none", border: "none", cursor: "pointer", marginTop: 6 }}>Clear search</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart sidebar */}
          <div className="flex flex-col gap-4">
            {/* Customer */}
            <div className="glass" style={{ padding: "14px 16px", borderRadius: 18 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 10 }}>{t('customers')}</p>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="h-10 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-sm">
                  <SelectValue placeholder={t('select_customer')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">+ {t('new_customer')}</SelectItem>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>)}
                </SelectContent>
              </Select>
              {(!selectedCustomer || selectedCustomer === 'new') && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                  <div className="hig-field-wrap"><input placeholder={t('customer_name')} value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
                  <div className="hig-field-wrap"><input placeholder={t('phone_number')} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="glass" style={{ borderRadius: 18, display: "flex", flexDirection: "column", maxHeight: 540, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px 10px", borderBottom: "0.5px solid rgba(60,60,67,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ShoppingCart style={{ width: 15, height: 15, color: "hsl(var(--primary))" }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>{t('cart')} ({totalItems})</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--primary))" }}>₹{subtotal.toFixed(0)}</span>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {cart.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center" }}>
                    <Receipt style={{ width: 32, height: 32, margin: "0 auto 8px", opacity: 0.2 }} />
                    <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Cart is empty</p>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "0.5px solid rgba(60,60,67,0.07)" }} className="hover:bg-black/3 dark:hover:bg-white/3">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }} className="truncate">{item.name}</p>
                      <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>₹{item.sellingPrice} × {item.quantity}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(120,120,128,0.1)", borderRadius: 8, padding: "2px 4px" }}>
                      <button style={{ width: 22, height: 22, borderRadius: 6, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--primary))" }} onClick={() => updateQty(item.id, -1)}><Minus style={{ width: 11, height: 11 }} /></button>
                      <span style={{ fontSize: 12, fontWeight: 700, width: 16, textAlign: "center" }}>{item.quantity}</span>
                      <button style={{ width: 22, height: 22, borderRadius: 6, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--primary))" }} onClick={() => updateQty(item.id, 1)}><Plus style={{ width: 11, height: 11 }} /></button>
                    </div>
                    <button style={{ width: 26, height: 26, borderRadius: 7, background: "none", border: "none", cursor: "pointer", color: "#FF3B30", opacity: 0.5, display: "flex", alignItems: "center", justifyContent: "center" }} className="hover:opacity-90" onClick={() => setCart(c => c.filter(i => i.id !== item.id))}><X style={{ width: 13, height: 13 }} /></button>
                  </div>
                ))}
              </div>

              {/* Totals + pay */}
              <div style={{ padding: "12px 14px", borderTop: "0.5px solid rgba(60,60,67,0.12)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                  {[["Subtotal", `₹${subtotal.toFixed(2)}`], [`GST (18%)`, `₹${tax.toFixed(2)}`]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{k}</span>
                      <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6, borderTop: "0.5px solid rgba(60,60,67,0.12)" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "hsl(var(--foreground))" }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#34C759" }}>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method + amount */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 8, marginBottom: 8 }}>
                  <Select value={payment} onValueChange={v => setPayment(v as PaymentMethod)}>
                    <SelectTrigger className="h-9 rounded-xl border-0 bg-black/5 dark:bg-white/8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hig-field-wrap" style={{ height: 36 }}>
                    <input placeholder={t('paid')} value={paymentType === 'full' ? total.toFixed(2) : amountPaid} onChange={e => setAmountPaid(e.target.value)} disabled={paymentType === 'full'} type="number" style={{ fontSize: 13, textAlign: "right", height: 36 }} />
                  </div>
                </div>

                {/* Payment type radio */}
                <RadioGroup value={paymentType} onValueChange={(v: 'full' | 'partial') => setPaymentType(v)} className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full" id="r-full" />
                    <Label htmlFor="r-full" style={{ fontSize: 11, cursor: "pointer" }}>{t('full_payment')}</Label>
                  </div>
                  {selectedCustomer && (
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="partial" id="r-partial" />
                      <Label htmlFor="r-partial" style={{ fontSize: 11, color: "#FF9500", cursor: "pointer" }}>{t('partial_khata')}</Label>
                    </div>
                  )}
                </RadioGroup>

                {paymentType === 'partial' && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "rgba(255,149,0,0.08)", borderRadius: 10, border: "0.5px solid rgba(255,149,0,0.2)", marginBottom: 8 }}>
                    <Label htmlFor="due-date" style={{ fontSize: 11, color: "#FF9500", whiteSpace: "nowrap" }}>{t('due_date')}</Label>
                    <input id="due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#FF9500", flex: 1, textAlign: "right" }} />
                  </div>
                )}

                <button onClick={handlePreview} disabled={cart.length === 0} className="hig-btn hig-btn-filled w-full" style={{ borderRadius: 12, height: 44, fontSize: 14, opacity: cart.length === 0 ? 0.5 : 1 }}>
                  {t('generate_bill')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle>Invoice Preview</DialogTitle></DialogHeader>
          {billPreview && (!lastInvoice ? (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Review Bill Details</h3>
              <div style={{ background: "hsl(var(--muted)/.5)", borderRadius: 14, padding: 16, textAlign: "left", marginBottom: 16 }}>
                {[["Customer", billPreview.customerName], ["Items", billPreview.items.length], ["Grand Total", `₹${billPreview.grandTotal.toFixed(2)}`], ["Amount Paid", `₹${billPreview.amountPaid.toFixed(2)}`], ["Balance Due", `₹${billPreview.balanceDue.toFixed(2)}`], ["Payment", billPreview.paymentMethod]].map(([k, v]) => (
                  <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid rgba(60,60,67,0.10)" }}>
                    <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleConfirm} disabled={processing} className="hig-btn hig-btn-filled w-full" style={{ borderRadius: 14, height: 48 }}>
                {processing ? 'Creating…' : 'Confirm & Create Invoice'}
              </button>
            </div>
          ) : (
            <PDFGenerator billData={billPreview} invoiceNumber={lastInvoice} customerPhone={billPreview.customerPhone || ''} onSuccess={() => {}} />
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
