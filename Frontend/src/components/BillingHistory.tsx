import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { salesAPI, Sale } from "@/services/api";
import { Loader2, Eye, Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PDFGenerator } from "./PDFGenerator";

export function BillingHistory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [viewPdfOpen, setViewPdfOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await salesAPI.getAllSales({ limit: 100 });
            if (response.data.success) {
                setSales(response.data.data.sales);
            }
        } catch (error) {
            console.error("Error fetching sales history:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSales = sales.filter((sale) =>
        sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerPhone?.includes(searchTerm)
    );

    const mapSaleToBillData = (sale: Sale) => {
        return {
            customerName: sale.customerName || "Walk-in Customer",
            customerPhone: sale.customerPhone || "N/A",
            createdAt: new Date(sale.saleDate).toLocaleDateString() + " " + new Date(sale.createdAt).toLocaleTimeString(),
            paymentMethod: sale.paymentMethod,
            subtotal: sale.subtotal,
            tax: sale.taxAmount,
            totalDiscount: sale.discount,
            overallDiscount: 0,
            grandTotal: sale.totalAmount,
            items: sale.saleItems.map((item: any) => ({
                name: item.product?.name || "Unknown Product",
                sku: item.product?.sku || "",
                quantity: item.quantity,
                unit: item.product?.unit || "Unit",
                sellingPrice: item.unitPrice,
                discount: 0 // Assuming line item discount is not stored separately or is 0
            }))
        };
    };

    const handleViewPdf = (sale: Sale) => {
        setSelectedSale(sale);
        setViewPdfOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by invoice, customer or phone..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No sales found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSales.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                                                <TableCell>
                                                    {new Date(sale.saleDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{sale.customerName || "Walk-in"}</span>
                                                        <span className="text-xs text-muted-foreground">{sale.customerPhone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={sale.paymentStatus === "PAID" ? "default" : "secondary"}>
                                                        {sale.paymentStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewPdf(sale)}
                                                        className="text-primary hover:text-primary/80"
                                                    >
                                                        <FileText className="h-4 w-4 mr-1" /> View PDF
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* PDF View Dialog */}
            <Dialog open={viewPdfOpen} onOpenChange={setViewPdfOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedSale && (
                        <PDFGenerator
                            billData={mapSaleToBillData(selectedSale)}
                            invoiceNumber={selectedSale.invoiceNumber}
                            customerPhone={selectedSale.customerPhone || ""}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
