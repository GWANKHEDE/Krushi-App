// Mock API service for UI development before backend integration

export interface LedgerEntry {
    id: string;
    customerId?: string;
    date: string;
    particulars: string;
    debit: number;
    credit: number;
    balance: number;
    type: 'sale' | 'payment' | 'purchase';
    dueDate?: string;
}

export interface GSTReportSummary {
    cgstCollected: number;
    sgstCollected: number;
    igstCollected: number;
    totalCollected: number;

    cgstPaid: number;
    sgstPaid: number;
    igstPaid: number;
    totalPaid: number;

    netPayable: number;
}

export interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: string;
    reference: string;
}

const getStoredLedgers = (): LedgerEntry[] => {
    try {
        const data = localStorage.getItem('krushi_ledgers');
        if (data) return JSON.parse(data);
    } catch { return []; }
    return [];
}

const saveStoredLedgers = (data: LedgerEntry[]) => {
    localStorage.setItem('krushi_ledgers', JSON.stringify(data));
}

const MOCK_GST_REPORT: GSTReportSummary = {
    cgstCollected: 12500,
    sgstCollected: 12500,
    igstCollected: 0,
    totalCollected: 25000,

    cgstPaid: 8000,
    sgstPaid: 8000,
    igstPaid: 2000,
    totalPaid: 18000,

    netPayable: 7000
};

// API Methods
export const mockApi = {
    // Ledger
    getLedgerEntries: async (customerId: string): Promise<LedgerEntry[]> => {
        return new Promise((resolve) => {
            const allLedgers = getStoredLedgers();
            const customerLedgers = allLedgers.filter((l: any) => l.customerId === customerId);
            setTimeout(() => resolve(customerLedgers), 600);
        });
    },

    getKhatabookBalances: async (): Promise<Record<string, { balance: number, dueDate?: string }>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const allLedgers = getStoredLedgers();
                const result: Record<string, { balance: number, dueDate?: string }> = {};

                // Group by customerId, take last entry for balance and latest dueDate
                allLedgers.forEach(l => {
                    if (!result[l.customerId!]) {
                        result[l.customerId!] = { balance: 0 };
                    }
                    result[l.customerId!].balance = l.balance;

                    // Keep the latest due date if available
                    if (l.dueDate) {
                        result[l.customerId!].dueDate = l.dueDate;
                    }
                });
                resolve(result);
            }, 600);
        });
    },

    // Payments
    recordPayment: async (data: { entityId: string, amount: number, method: string, type: 'customer' | 'supplier' }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const ledgers = getStoredLedgers();
                const entityLedgers = ledgers.filter((l: any) => l.customerId === data.entityId);
                const lastBalance = entityLedgers.length > 0 ? entityLedgers[entityLedgers.length - 1].balance : 0;

                const newEntry = {
                    id: String(Date.now()),
                    customerId: data.entityId,
                    date: new Date().toISOString(),
                    particulars: `Payment ${data.type === 'customer' ? 'Received' : 'Paid'} (${data.method})`,
                    debit: data.type === 'customer' ? 0 : data.amount,
                    credit: data.type === 'customer' ? data.amount : 0,
                    balance: data.type === 'customer' ? lastBalance - data.amount : lastBalance + data.amount,
                    type: 'payment' as const
                };

                saveStoredLedgers([...ledgers, newEntry]);
                resolve({ success: true, message: 'Payment recorded successfully' });
            }, 800);
        });
    },

    // Reminders
    sendReminder: async (customerId: string, method: 'whatsapp' | 'sms') => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true, message: `Reminder sent successfully via ${method.toUpperCase()}` }), 1000);
        });
    },

    // GST
    getGSTReport: async (period: 'month' | 'quarter' | 'year'): Promise<GSTReportSummary> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ ...MOCK_GST_REPORT }), 700);
        });
    }
};
