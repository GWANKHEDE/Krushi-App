import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Phone, FileText, PlusCircle } from 'lucide-react';
import { mockApi, LedgerEntry } from '@/services/mockApi';
import { toast } from 'react-toastify';
import { PaymentDialog } from '@/components/payments/PaymentDialog';

interface CustomerLedgerProps {
    customerIdProp?: string;
    isModal?: boolean;
}

export default function CustomerLedger({ customerIdProp, isModal = false }: CustomerLedgerProps = {}) {
    const { customerId: paramCustomerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const customerId = customerIdProp || paramCustomerId;
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    // Mock checking customer details
    const customerName = "Ramesh Kumar";
    const customerNumber = "+91 9876543210";

    useEffect(() => {
        if (customerId) {
            loadLedger(customerId);
        }
    }, [customerId]);

    const loadLedger = async (id: string) => {
        setLoading(true);
        try {
            const data = await mockApi.getLedgerEntries(id);
            setEntries(data);
        } catch (error) {
            toast.error('Failed to load ledger');
        } finally {
            setLoading(false);
        }
    };

    const handleSendReminder = async (method: 'whatsapp' | 'sms') => {
        if (!customerId) return;
        try {
            toast.info(`Sending ${method} reminder...`);
            const res = await mockApi.sendReminder(customerId, method);
            toast.success((res as { message: string }).message);
        } catch (error) {
            toast.error(`Failed to send ${method} reminder`);
        }
    };

    const totalBalance = entries.length > 0 ? entries[entries.length - 1].balance : 0;

    return (
        <div className={isModal ? "space-y-6" : "container mx-auto p-4 md:p-8 space-y-6"}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {!isModal && (
                        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/billing')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{customerName} Khata</h1>
                        <p className="text-muted-foreground">{customerNumber}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleSendReminder('sms')}>
                        <Phone className="w-4 h-4" /> SMS Reminder
                    </Button>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handleSendReminder('whatsapp')}>
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setPaymentDialogOpen(true)}>
                        <PlusCircle className="w-4 h-4" /> Record Payment
                    </Button>
                </div>
            </div>

            {customerId && (
                <PaymentDialog
                    open={paymentDialogOpen}
                    onOpenChange={setPaymentDialogOpen}
                    customerId={customerId}
                    onSuccess={() => loadLedger(customerId)}
                />
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${totalBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{Math.abs(totalBalance).toLocaleString()} {totalBalance > 0 ? 'Due' : 'Advance'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Ledger Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Detailed history of all invoices and payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Particulars</TableHead>
                                    <TableHead className="text-right text-red-600">Debit (₹)</TableHead>
                                    <TableHead className="text-right text-green-600">Credit (₹)</TableHead>
                                    <TableHead className="text-right font-bold">Balance (₹)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">Loading ledger...</TableCell>
                                    </TableRow>
                                ) : entries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No transactions found</TableCell>
                                    </TableRow>
                                ) : (
                                    entries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{entry.particulars}</div>
                                                <Badge variant="outline" className="mt-1 text-xs">
                                                    {entry.type.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-red-600">
                                                {entry.debit > 0 ? entry.debit.toLocaleString() : '-'}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600">
                                                {entry.credit > 0 ? entry.credit.toLocaleString() : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {entry.balance > 0 ? `${entry.balance.toLocaleString()} Dr` :
                                                    entry.balance < 0 ? `${Math.abs(entry.balance).toLocaleString()} Cr` :
                                                        '0'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
