import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, BookOpen, ChevronLeft, ChevronRight, Settings2, MoreHorizontal, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, type Customer } from '@/lib/store';
import { mockApi } from '@/services/mockApi';
import Loader from '@/services/Loader';
import CustomerLedger from './CustomerLedger';
import { cn } from '@/lib/utils';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';

type KhatabookCustomer = Customer & { balance: number; dueDate?: string };

export default function KhatabookList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [balances, setBalances] = useState<Record<string, { balance: number, dueDate?: string }> | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);

    useEffect(() => {
        setCustomers(getCustomers());
        mockApi.getKhatabookBalances().then(setBalances);
    }, []);

    const data = useMemo<KhatabookCustomer[]>(() => {
        if (!balances) return [];
        return customers.map((c) => {
            const entry = balances[c.id] || { balance: 0 };
            return {
                ...c,
                balance: entry.balance,
                dueDate: entry.dueDate
            };
        });
    }, [customers, balances]);

    const columns: ColumnDef<KhatabookCustomer>[] = [
        {
            accessorKey: 'name',
            header: 'Customer',
            size: 250,
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex h-8 w-8 shrink-0 rounded-full bg-primary/10 items-center justify-center text-primary font-bold text-xs">
                        {row.original.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-xs sm:text-sm">{row.original.name}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground md:hidden">{row.original.phone || 'No Phone'}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'phone',
            header: () => <div className="hidden md:block">Mobile</div>,
            size: 150,
            cell: ({ row }) => (
                <div className="hidden md:block text-xs sm:text-sm text-muted-foreground">
                    {row.original.phone || 'N/A'}
                </div>
            ),
            filterFn: "includesString"
        },
        {
            accessorKey: 'balance',
            header: () => <div className="text-right">Balance</div>,
            size: 120,
            cell: ({ row }) => {
                const bal = row.original.balance;
                if (bal === 0) {
                    return <div className="text-right"><Badge variant="outline" className="text-[10px] sm:text-xs text-gray-500 font-medium">₹0</Badge></div>;
                }
                if (bal > 0) {
                    return <div className="text-right"><Badge variant="outline" className="text-[10px] sm:text-xs text-red-600 bg-red-50 border-red-200 font-medium whitespace-nowrap">₹{Math.abs(bal).toLocaleString()} Due</Badge></div>;
                }
                return <div className="text-right"><Badge variant="outline" className="text-[10px] sm:text-xs text-green-600 bg-green-50 border-green-200 font-medium whitespace-nowrap">₹{Math.abs(bal).toLocaleString()} Adv</Badge></div>;
            }
        },
        {
            accessorKey: 'dueDate',
            header: ({ column }) => <div className="text-center font-bold">Due Date</div>,
            size: 100,
            cell: ({ row }) => {
                const date = row.original.dueDate;
                if (!date) return <div className="text-center text-muted-foreground">-</div>;
                const isOverdue = new Date(date) < new Date();
                return (
                    <div className={cn("text-center font-bold text-xs uppercase tracking-tighter", isOverdue ? "text-red-600" : "text-primary")}>
                        {new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </div>
                );
            }
        },
        {
            id: 'actions',
            size: 50,
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-end pr-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 p-0 focus-visible:ring-0">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingCustomerId(row.original.id); }}>
                                <Eye className="mr-2 h-4 w-4" /> View Ledger
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/admin/ledger/${row.original.id}`); }}>
                                <BookOpen className="mr-2 h-4 w-4" /> Full Page
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ];

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, sorting, columnVisibility },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (!balances) return <Loader message="Loading Khatabook Balances..." />;

    const totalReceivable = data.filter(c => c.balance > 0).reduce((acc, c) => acc + c.balance, 0);
    const totalPayable = data.filter(c => c.balance < 0).reduce((acc, c) => acc + Math.abs(c.balance), 0);

    return (
        <div className="container px-2 sm:px-4 py-4 space-y-4 max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-screen-xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" /> Khatabook
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage outstanding customer balances and ledgers.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <Card className="bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Total Receivable</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 dark:text-red-500">₹{totalReceivable.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Total Advance</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 dark:text-green-500">₹{totalPayable.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-lg shadow-sm border-primary/20"
                        placeholder="Search by customer name or mobile number..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-9 sm:h-10">
                            <Settings2 className="h-4 w-4 mr-2" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        {table.getAllColumns()
                            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === 'dueDate' ? 'Due Date' : column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} style={{ width: header.getSize() }} className="text-xs sm:text-sm font-semibold h-10">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                                    onClick={() => setViewingCustomerId(row.original.id)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }} className="py-2 sm:py-3 h-12">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-xs sm:text-sm text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-end space-x-2 py-3 px-4 border-t bg-muted/20">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Dialog open={!!viewingCustomerId} onOpenChange={(open) => !open && setViewingCustomerId(null)}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Customer Ledger</DialogTitle>
                    </DialogHeader>
                    {viewingCustomerId && (
                        <CustomerLedger customerIdProp={viewingCustomerId} isModal />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
