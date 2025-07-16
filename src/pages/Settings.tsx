import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell, Lock, FileText, Settings, Warehouse } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [gstReminder, setGstReminder] = useState(true);

  return (
    <div className="container py-10 space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" /> Settings
      </h2>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Edit your personal information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Full Name</Label>
            <Input defaultValue="Ganesh Wankhede" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" defaultValue="ganesh@example.com" />
          </div>
          <div>
            <Label>Mobile</Label>
            <Input type="tel" defaultValue="9876543210" />
          </div>
          <div>
            <Label>Account Created</Label>
            <Input value="2024-01-01" readOnly />
          </div>
          <div className="md:col-span-2 text-right">
            <Button>Update Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>Change your login credentials</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
          <div className="md:col-span-2 text-right">
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" /> Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Section */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>Manage your company information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Business Name</Label>
            <Input defaultValue="Krushi Seva Kendra" />
          </div>
          <div>
            <Label>GST Number</Label>
            <Input defaultValue="27ABCDE1234F1Z5" />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea defaultValue="123 Krushi Road, Nanded, Maharashtra" />
          </div>
          <div className="md:col-span-2 text-right">
            <Button>Update Business Info</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications & Reminders</CardTitle>
          <CardDescription>Manage stock alerts and GST reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>New Stock Alert</Label>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label>GST Billing Reminder</Label>
            <Switch checked={gstReminder} onCheckedChange={setGstReminder} />
          </div>
        </CardContent>
      </Card>

      {/* PDF Generator */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Bill Generator</CardTitle>
          <CardDescription>Generate sample bills for testing or printing</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Generate Sample PDF
          </Button>
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Quick look at your current stock health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Low Stock Items</p>
              <p className="text-lg font-bold">3 Products</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Total Inventory Value</p>
              <p className="text-lg font-bold">₹2,30,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
