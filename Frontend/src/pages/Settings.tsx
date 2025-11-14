import { useState, useEffect } from 'react';
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
import Loader from '@/services/Loader';
import { 
  Bell, 
  Lock, 
  FileText, 
  Settings, 
  Warehouse,
  User,
  Building,
  Download,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { dashboardAPI, productsAPI, settingsAPI } from '@/services/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  business?: Business;
}

interface Business {
  id: string;
  name: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  gstin?: string;
  settings?: BusinessSettings;
}

interface BusinessSettings {
  id: string;
  lowStockAlert: boolean;
  gstReminder: boolean;
  gstRate: number;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  pdfTemplate?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface InventoryStats {
  lowStockItems: number;
  totalInventoryValue: number;
  totalProducts: number;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [businessForm, setBusinessForm] = useState({
    name: '',
    address: '',
    email: '',
    gstin: '',
    contactNumber: ''
  });

  // Load user data and settings
  useEffect(() => {
    loadUserData();
    loadInventoryStats();
  }, []);

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      const businessData = localStorage.getItem('business');
      const settingsData = localStorage.getItem('settings');

      if (userData) {
        const userProfile = JSON.parse(userData);
        setUser(userProfile);
        setProfileForm({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || userProfile.business?.contactNumber || ''
        });

        if (userProfile.business) {
          setBusiness(userProfile.business);
          setBusinessForm({
            name: userProfile.business.name || '',
            address: userProfile.business.address || '',
            email: userProfile.business.email || '',
            gstin: userProfile.business.gstin || '',
            contactNumber: userProfile.business.contactNumber || ''
          });
        }
      }

      if (settingsData) {
        const savedSettings = JSON.parse(settingsData);
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryStats = async () => {
    try {
      const response = await dashboardAPI.getDashboardData();
      const data = response.data.data;
      
      // Calculate inventory value (simplified - using cost price * stock)
      const productsResponse = await productsAPI.getAllProducts({ limit: 1000 });
      const products = productsResponse.data.data.products || [];
      
      const totalValue = products.reduce((sum: number, product: any) => 
        sum + (product.costPrice * product.currentStock), 0
      );

      setInventoryStats({
        lowStockItems: data.totals.lowStockItems,
        totalInventoryValue: totalValue,
        totalProducts: data.totals.totalProducts
      });
    } catch (error) {
      console.error('Error loading inventory stats:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await settingsAPI.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone
      });

      // Update local storage with new data
      const updatedUser = {
        ...user,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        business: {
          ...user?.business,
          contactNumber: profileForm.phone
        }
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBusinessUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await settingsAPI.updateBusiness({
        name: businessForm.name,
        address: businessForm.address,
        email: businessForm.email,
        gstin: businessForm.gstin,
        contactNumber: businessForm.contactNumber
      });

      // Update local storage with new business data
      const updatedBusiness = {
        ...business,
        name: businessForm.name,
        address: businessForm.address,
        email: businessForm.email,
        gstin: businessForm.gstin,
        contactNumber: businessForm.contactNumber
      };
      
      const updatedUser = {
        ...user,
        business: updatedBusiness
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('business', JSON.stringify(updatedBusiness));
      setBusiness(updatedBusiness);
      setUser(updatedUser);

      toast({
        title: "Success",
        description: "Business information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update business information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      await settingsAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsChange = async (key: keyof BusinessSettings, value: any) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    try {
      await settingsAPI.updateSettings({
        lowStockAlert: updatedSettings.lowStockAlert,
        gstReminder: updatedSettings.gstReminder,
        gstRate: updatedSettings.gstRate,
        invoicePrefix: updatedSettings.invoicePrefix
      });

      // Update local storage
      localStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const generateSamplePDF = async () => {
    try {
      // Simulate PDF generation
      toast({
        title: "Generating PDF",
        description: "Creating sample bill document...",
      });
      
      await settingsAPI.generatePDF({
        billData: {
          // Sample bill data
          invoiceNumber: 'INV-001',
          customerName: 'Sample Customer',
          items: [],
          total: 0
        }
      });
      
      toast({
        title: "Success",
        description: "Sample PDF generated successfully",
      });
      
      // In a real implementation, you would download the PDF
      // window.open('/api/generate-pdf', '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return <Loader message="Please wait..." />;
  }

  return (
    <div className="container py-8 space-y-8">
      {/* <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" /> Settings
      </h2> */}

      {/* Profile Section */}
      <Card>
        <CardHeader className='border-b border-border border-green-500 mb-1 pb-2'>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile Settings
          </CardTitle>
          <CardDescription>Edit your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Mobile</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  placeholder="Enter your mobile number"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={user?.role || ''}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="md:col-span-2 text-right">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader className='border-b border-border border-green-500 mb-1 pb-2'>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Password Management
          </CardTitle>
          <CardDescription>Change your login credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-7 h-6 w-6 p-0"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-7 h-6 w-6 p-0"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-7 h-6 w-6 p-0"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="md:col-span-2 text-right">
                <Button type="submit" variant="outline" disabled={saving}>
                  <Lock className="mr-2 h-4 w-4" />
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Business Section */}
      <Card>
        <CardHeader className='border-b border-border border-green-500 mb-1 pb-2'>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Business Details
          </CardTitle>
          <CardDescription>Manage your company information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBusinessUpdate}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessForm.name}
                  onChange={(e) => setBusinessForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={businessForm.gstin}
                  onChange={(e) => setBusinessForm(prev => ({
                    ...prev,
                    gstin: e.target.value
                  }))}
                  placeholder="Enter GST number"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={businessForm.address}
                  onChange={(e) => setBusinessForm(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  placeholder="Enter business address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Enter business email"
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={businessForm.contactNumber}
                  onChange={(e) => setBusinessForm(prev => ({
                    ...prev,
                    contactNumber: e.target.value
                  }))}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="md:col-span-2 text-right">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Updating..." : "Update Business Info"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notifications & Settings */}
      <Card>
        <CardHeader className='border-b border-border border-green-500 mb-1 pb-2'>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications & Reminders
          </CardTitle>
          <CardDescription>Manage stock alerts and GST reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="lowStockAlert" className="text-base">Low Stock Alert</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when product stock is running low
              </p>
            </div>
            <Switch
              id="lowStockAlert"
              checked={settings?.lowStockAlert || false}
              onCheckedChange={(checked) => 
                handleSettingsChange('lowStockAlert', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="gstReminder" className="text-base">GST Billing Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Remind to include GST in bills and track GST payments
              </p>
            </div>
            <Switch
              id="gstReminder"
              checked={settings?.gstReminder || false}
              onCheckedChange={(checked) => 
                handleSettingsChange('gstReminder', checked)
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settings?.gstRate || 18}
                onChange={(e) => 
                  handleSettingsChange('gstRate', parseFloat(e.target.value))
                }
                placeholder="GST percentage"
              />
            </div>
            <div>
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={settings?.invoicePrefix || 'INV'}
                onChange={(e) => 
                  handleSettingsChange('invoicePrefix', e.target.value)
                }
                placeholder="Invoice prefix"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Generator */}
      <Card>
        <CardHeader className='border-b border-border border-green-500 mb-3 pb-2'>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> PDF Bill Generator
          </CardTitle>
          <CardDescription>Generate sample bills for testing or printing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={generateSamplePDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Sample Bill
            </Button>
            <Button 
              variant="outline" 
              onClick={generateSamplePDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF Template
            </Button>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Features:</strong> Professional bill layout, GST calculation, 
              business details, automatic numbering, and print-friendly format.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Overview */}
      <Card>
        <CardHeader className="border-b border-border border-green-500 mb-3 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" /> Inventory Status
          </CardTitle>
          <CardDescription>Quick look at your current stock health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg border-2 ${
              (inventoryStats?.lowStockItems || 0) > 0 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  (inventoryStats?.lowStockItems || 0) > 0 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Low Stock Items</p>
                  <p className={`text-2xl font-bold ${
                    (inventoryStats?.lowStockItems || 0) > 0 
                      ? 'text-orange-700' 
                      : 'text-green-700'
                  }`}>
                    {inventoryStats?.lowStockItems || 0} Products
                  </p>
                  {(inventoryStats?.lowStockItems || 0) > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Requires immediate attention
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{(inventoryStats?.totalInventoryValue || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Across {inventoryStats?.totalProducts || 0} products
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Inventory Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-lg font-semibold">{inventoryStats?.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Stock Health</p>
              <p className="text-lg font-semibold">
                {inventoryStats && inventoryStats.totalProducts > 0 
                  ? `${Math.round(((inventoryStats.totalProducts - (inventoryStats.lowStockItems || 0)) / inventoryStats.totalProducts) * 100)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
