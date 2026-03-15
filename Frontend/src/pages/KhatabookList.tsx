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
        <div className="space-y-5 hig-page-enter">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="ios-title-1" style={{ color: "hsl(var(--foreground))" }}>Khatabook</h1>
                    <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Manage outstanding customer balances and ledgers.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass-widget glass-red" style={{padding:"16px 14px 14px"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"22px 22px 0 0",background:"linear-gradient(90deg,#FF3B30cc,#FF3B3044)",zIndex:2}} />
                    <p style={{fontSize:11,color:"#FF3B30",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Total Receivable</p>
                    <p style={{fontSize:24,fontWeight:700,color:"#FF3B30",letterSpacing:"-0.022em",lineHeight:1}}>₹{totalReceivable.toLocaleString()}</p>
                </div>
                <div className="glass-widget glass-green" style={{padding:"16px 14px 14px"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"22px 22px 0 0",background:"linear-gradient(90deg,#34C759cc,#34C75944)",zIndex:2}} />
                    <p style={{fontSize:11,color:"#34C759",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Total Advance</p>
                    <p style={{fontSize:24,fontWeight:700,color:"#34C759",letterSpacing:"-0.022em",lineHeight:1}}>₹{totalPayable.toLocaleString()}</p>
                </div>
            </div>

            {/* Search + column toggle */}
            <div className="flex items-center gap-2">
                <div className="hig-search flex-1">
                    <Search style={{ width: 15, height: 15, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                    <input
                        placeholder="Search by customer name or mobile..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="hig-btn hig-btn-glass hig-btn-sm flex items-center gap-2" style={{ height: 36, borderRadius: 10, paddingLeft: 12, paddingRight: 12 }}>
                            <Settings2 style={{ width: 14, height: 14 }} />
                            <span className="hidden sm:inline" style={{ fontSize: 13 }}>View</span>
                        </button>
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

            <div className="glass" style={{borderRadius:18,overflow:"hidden"}}>
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
