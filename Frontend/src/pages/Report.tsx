import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  mockDashboardStats,
  mockBills,
  mockPurchases,
  mockTransactions,
} from '@/data/mockData';
import {
  DollarSign,
  IndianRupee,
  Percent,
  Receipt,
  History,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { Transaction } from '@/types';

const COLORS = ['#4f46e5', '#16a34a', '#f97316', '#e11d48'];

export default function Report() {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie');

  const salesData = [
    { month: 'Jan', sales: 15000 },
    { month: 'Feb', sales: 20000 },
    { month: 'Mar', sales: 18000 },
    { month: 'Apr', sales: 22000 },
    { month: 'May', sales: 25000 },
    { month: 'Jun', sales: 30000 },
  ];

  return (
    <div className="container py-10 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Business Report Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<Card>
  <div className="relative p-4">
    <IndianRupee className="absolute top-4 right-4 h-5 w-5 text-green-600" />    
    <CardHeader className="p-0">
      <CardTitle className="text-lg">Total Sales</CardTitle>
    </CardHeader>
    <CardContent className="pt-8">
      <p className="text-2xl font-bold">₹{mockDashboardStats.totalSales}</p>
    </CardContent>
  </div>
</Card>

<Card>
  <div className="relative p-4">
    <Percent className="absolute top-4 right-4 h-5 w-5 text-emerald-600" />

    <CardHeader className="p-0">
      <CardTitle className="text-lg">Monthly Profit</CardTitle>
    </CardHeader>
    <CardContent className="pt-8">
      <p className="text-2xl font-bold">₹{mockDashboardStats.monthlyProfit}</p>
    </CardContent>
  </div>
</Card>
<Card>
  <div className="relative p-4">
    <Receipt className="absolute top-4 right-4 h-5 w-5 text-blue-600" />
    <CardHeader className="p-0">
    <CardTitle className="text-lg">Billing Records</CardTitle>
    </CardHeader>
    <CardContent className="pt-8">
      <p className="text-2xl font-bold">{mockBills.length} Bills</p>
    </CardContent>
  </div>
</Card>
<Card>
  <div className="relative p-4">
    <History className="absolute top-4 right-4 h-5 w-5 text-purple-600" />
    <CardHeader className="p-0">
      <CardTitle className="text-lg">Transactions</CardTitle>
    </CardHeader>
    <CardContent className="pt-8">
      <p className="text-2xl font-bold">{mockTransactions.length} Entries</p>
    </CardContent>
  </div>
</Card>
      </div>

      {/* Chart Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Sales Overview</CardTitle>
            <div className="flex gap-2">
              <button
                className={`text-sm px-2 py-1 rounded border ${
                  chartType === 'pie' ? 'bg-primary text-white' : 'text-primary border-primary'
                }`}
                onClick={() => setChartType('pie')}
              >
                Pie
              </button>
              <button
                className={`text-sm px-2 py-1 rounded border ${
                  chartType === 'bar' ? 'bg-primary text-white' : 'text-primary border-primary'
                }`}
                onClick={() => setChartType('bar')}
              >
                Bar
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData}
                      dataKey="sales"
                      nameKey="month"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#4f46e5"
                      label
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTransactions.map((txn: Transaction) => (
              <div key={txn.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-semibold capitalize">{txn.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={txn.type === 'sale' ? 'default' : 'destructive'}>
                  ₹{txn.amount}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="billing">
        <TabsList>
          <TabsTrigger value="billing">Billing Records</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="gst">GST Summary</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockBills.map((bill) => (
                <div key={bill.id} className="flex justify-between border p-2 rounded">
                  <div>
                    <p className="font-semibold">{bill.customerName}</p>
                    <p className="text-sm text-muted-foreground">{bill.items.length} items</p>
                  </div>
                  <Badge variant="outline">₹{bill.total}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockPurchases.map((entry) => (
                <div key={entry.id} className="flex justify-between border p-2 rounded">
                  <div>
                    <p className="font-semibold">{entry.productName}</p>
                    <p className="text-sm text-muted-foreground">{entry.supplier}</p>
                  </div>
                  <Badge>₹{entry.total}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card>
            <CardHeader>
              <CardTitle>GST Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total GST Collected: ₹1200</p>
              <p className="text-sm text-muted-foreground">Total GST Paid: ₹800</p>
              <p className="font-semibold mt-2">Net GST: ₹400</p>
            </CardContent>
          </Card>
        </TabsContent>
    

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockTransactions.map((txn) => (
                <div key={txn.id} className="flex justify-between border p-2 rounded">
                  <div>
                    <p className="font-semibold capitalize">{txn.type}</p>
                    <p className="text-sm text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={txn.type === 'sale' ? 'default' : 'destructive'}>
                    ₹{txn.amount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
