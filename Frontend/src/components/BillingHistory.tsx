import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, FileText, Calendar, Filter, X } from 'lucide-react'
import { getSales, type Sale, type PaymentStatus } from '@/lib/store'
import { PDFGenerator } from './PDFGenerator'

export function BillingHistory() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL')
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
    const [pdfOpen, setPdfOpen] = useState(false)

    const sales = useMemo(() => getSales(), [])

    const filtered = sales.filter(s => {
        const matchesSearch =
            (s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
                s.customerPhone?.includes(search))

        const matchesStatus = statusFilter === 'ALL' || s.paymentStatus === statusFilter

        return matchesSearch && matchesStatus
    })

    const mapBillData = (sale: Sale) => ({
        customerName: sale.customerName || 'Walk-in',
        customerPhone: sale.customerPhone || 'N/A',
        createdAt: `${new Date(sale.saleDate).toLocaleDateString()} ${new Date(sale.createdAt).toLocaleTimeString()}`,
        paymentMethod: sale.paymentMethod,
        subtotal: sale.subtotal, tax: sale.taxAmount, totalDiscount: sale.discount,
        overallDiscount: 0, grandTotal: sale.totalAmount,
        items: sale.saleItems.map(item => ({
            name: item.product?.name || 'Unknown', sku: item.product?.sku || '',
            quantity: item.quantity, unit: item.product?.unit || 'Unit',
            sellingPrice: item.unitPrice, discount: 0,
        })),
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search invoice, customer or phone..."
                        className="pl-10 h-8 border-primary/20 bg-background shadow-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                        <SelectTrigger className="w-[180px] h-8 border-primary/20 bg-background shadow-sm">
                            <Filter className="mr-2 h-3.5 w-3.5 opacity-50" />
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PARTIALLY_PAID">Partial</SelectItem>
                        </SelectContent>
                    </Select>

                    {(search || statusFilter !== 'ALL') && (
                        <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('ALL') }} className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center justify-center">
                            <X className="mr-1 h-3.5 w-3.5" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-none shadow-medium overflow-hidden">
                <CardHeader className="bg-secondary/10 pb-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-primary uppercase">Recent Invoices</CardTitle>
                            <CardDescription className="text-[10px] font-medium italic">Showing {filtered.length} total transactions</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-6 font-bold border-primary/20 text-[9px] uppercase tracking-widest">{filtered.length} Found</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-primary/10">
                                    <TableHead className="w-[120px] font-bold text-foreground text-xs uppercase tracking-wider">Invoice #</TableHead>
                                    <TableHead className="hidden sm:table-cell font-bold text-foreground text-xs uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wider">Customer</TableHead>
                                    <TableHead className="font-bold text-foreground text-xs uppercase tracking-wider">Total</TableHead>
                                    <TableHead className="hidden sm:table-cell font-bold text-foreground text-xs uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-right font-bold text-foreground text-xs uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-48">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                                    <Search className="h-6 w-6 opacity-30" />
                                                </div>
                                                <p className="font-medium text-lg">No matching invoices found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map(sale => (
                                    <TableRow key={sale.id} className="hover:bg-primary/5 transition-colors border-primary/5">
                                        <TableCell className="font-bold text-primary/80">{sale.invoiceNumber}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(sale.saleDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-foreground/90">{sale.customerName || 'Walk-in Customer'}</span>
                                                <span className="text-xs text-muted-foreground font-medium">{sale.customerPhone || 'No Phone'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-foreground">₹{sale.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge
                                                variant={sale.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                                                className={`text-[10px] font-black uppercase tracking-widest ${sale.paymentStatus === 'PAID' ? 'bg-success hover:bg-success text-success-foreground' : ''
                                                    }`}
                                            >
                                                {sale.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setSelectedSale(sale); setPdfOpen(true) }}
                                                className="h-8 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-bold shadow-sm rounded-lg text-[10px] uppercase tracking-wide"
                                            >
                                                <FileText className="h-3.5 w-3.5 mr-1.5" />View PDF
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                    {selectedSale && <PDFGenerator billData={mapBillData(selectedSale)} invoiceNumber={selectedSale.invoiceNumber} customerPhone={selectedSale.customerPhone || ''} onSuccess={() => { }} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
