import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Store, Printer, User, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { storeSettings, printerSettings, updateStoreSettings, updatePrinterSettings } = useSettings();
  const { toast } = useToast();

  const handleStoreSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    updateStoreSettings({
      storeName: formData.get('storeName') as string,
      storeAddress: formData.get('storeAddress') as string,
      storePhone: formData.get('storePhone') as string,
      storeEmail: formData.get('storeEmail') as string,
      currency: formData.get('currency') as string,
      taxRate: parseFloat(formData.get('taxRate') as string),
      receiptFooter: formData.get('receiptFooter') as string
    });

    toast({
      title: 'Settings Updated',
      description: 'Store settings have been saved successfully.'
    });
  };

  const handlePrinterSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    updatePrinterSettings({
      printerName: formData.get('printerName') as string,
      paperSize: formData.get('paperSize') as any
    });

    toast({
      title: 'Settings Updated',
      description: 'Printer settings have been saved successfully.'
    });
  };

  return (
    <div className="space-y-6" data-id="8sqyygmj6" data-path="src/pages/SettingsPage.tsx">
      {/* Header */}
      <div data-id="9af429nf2" data-path="src/pages/SettingsPage.tsx">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-id="svwb6q1vq" data-path="src/pages/SettingsPage.tsx">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400" data-id="zzgkhyn0m" data-path="src/pages/SettingsPage.tsx">
          Configure your POS system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-id="5lkhutryi" data-path="src/pages/SettingsPage.tsx">
        {/* Store Settings */}
        <Card data-id="zofdb968d" data-path="src/pages/SettingsPage.tsx">
          <CardHeader data-id="l7lv1o3fw" data-path="src/pages/SettingsPage.tsx">
            <CardTitle className="flex items-center" data-id="s2rleftql" data-path="src/pages/SettingsPage.tsx">
              <Store className="mr-2 h-5 w-5" data-id="p3bs72rk3" data-path="src/pages/SettingsPage.tsx" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent data-id="v2qff19e5" data-path="src/pages/SettingsPage.tsx">
            <form onSubmit={handleStoreSettingsSubmit} className="space-y-4" data-id="kdg7axgio" data-path="src/pages/SettingsPage.tsx">
              <div data-id="hhsnff5h3" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="storeName" data-id="749yzb7hk" data-path="src/pages/SettingsPage.tsx">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  defaultValue={storeSettings.storeName}
                  placeholder="Enter store name" data-id="vjahmgw4r" data-path="src/pages/SettingsPage.tsx" />

              </div>
              
              <div data-id="txn40vvc3" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="storeAddress" data-id="gx93tlq7c" data-path="src/pages/SettingsPage.tsx">Address</Label>
                <Textarea
                  id="storeAddress"
                  name="storeAddress"
                  defaultValue={storeSettings.storeAddress}
                  placeholder="Enter store address"
                  rows={3} data-id="li0ampe02" data-path="src/pages/SettingsPage.tsx" />

              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="yqq9ug6cu" data-path="src/pages/SettingsPage.tsx">
                <div data-id="pj28l8j1t" data-path="src/pages/SettingsPage.tsx">
                  <Label htmlFor="storePhone" data-id="amdzjzmk9" data-path="src/pages/SettingsPage.tsx">Phone</Label>
                  <Input
                    id="storePhone"
                    name="storePhone"
                    defaultValue={storeSettings.storePhone}
                    placeholder="Enter phone number" data-id="2lcvg4u91" data-path="src/pages/SettingsPage.tsx" />

                </div>
                <div data-id="2fbswmsci" data-path="src/pages/SettingsPage.tsx">
                  <Label htmlFor="storeEmail" data-id="juo0rdtdu" data-path="src/pages/SettingsPage.tsx">Email</Label>
                  <Input
                    id="storeEmail"
                    name="storeEmail"
                    type="email"
                    defaultValue={storeSettings.storeEmail}
                    placeholder="Enter email address" data-id="hgny42eo7" data-path="src/pages/SettingsPage.tsx" />

                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="9an5hwi9u" data-path="src/pages/SettingsPage.tsx">
                <div data-id="vl9zyqq0w" data-path="src/pages/SettingsPage.tsx">
                  <Label htmlFor="currency" data-id="j079cgvxf" data-path="src/pages/SettingsPage.tsx">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    defaultValue={storeSettings.currency}
                    placeholder="USD" data-id="2lzfgy4rm" data-path="src/pages/SettingsPage.tsx" />

                </div>
                <div data-id="wv8drnh4l" data-path="src/pages/SettingsPage.tsx">
                  <Label htmlFor="taxRate" data-id="lpeih1z39" data-path="src/pages/SettingsPage.tsx">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.01"
                    defaultValue={storeSettings.taxRate}
                    placeholder="8.00" data-id="jwes72ozc" data-path="src/pages/SettingsPage.tsx" />

                </div>
              </div>
              
              <div data-id="d8018peg0" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="receiptFooter" data-id="f34qgdv7y" data-path="src/pages/SettingsPage.tsx">Receipt Footer</Label>
                <Textarea
                  id="receiptFooter"
                  name="receiptFooter"
                  defaultValue={storeSettings.receiptFooter}
                  placeholder="Thank you message for receipts"
                  rows={2} data-id="sxlqxq3dv" data-path="src/pages/SettingsPage.tsx" />

              </div>
              
              <Button type="submit" className="w-full" data-id="9hbn3nhk3" data-path="src/pages/SettingsPage.tsx">
                Save Store Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Printer Settings */}
        <Card data-id="3ugziwhoa" data-path="src/pages/SettingsPage.tsx">
          <CardHeader data-id="4c3i86oo1" data-path="src/pages/SettingsPage.tsx">
            <CardTitle className="flex items-center" data-id="5a33h8yuj" data-path="src/pages/SettingsPage.tsx">
              <Printer className="mr-2 h-5 w-5" data-id="5vqqq3m6m" data-path="src/pages/SettingsPage.tsx" />
              Printer Configuration
            </CardTitle>
          </CardHeader>
          <CardContent data-id="9rfv61tai" data-path="src/pages/SettingsPage.tsx">
            <form onSubmit={handlePrinterSettingsSubmit} className="space-y-4" data-id="hwhzp66ek" data-path="src/pages/SettingsPage.tsx">
              <div data-id="voscw5nwg" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="printerName" data-id="tnnqvzke3" data-path="src/pages/SettingsPage.tsx">Printer Name</Label>
                <Input
                  id="printerName"
                  name="printerName"
                  defaultValue={printerSettings.printerName}
                  placeholder="Select printer" data-id="xtbly4cn3" data-path="src/pages/SettingsPage.tsx" />

              </div>
              
              <div data-id="zjxqozsmu" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="paperSize" data-id="d8qdpv0k8" data-path="src/pages/SettingsPage.tsx">Paper Size</Label>
                <select
                  id="paperSize"
                  name="paperSize"
                  defaultValue={printerSettings.paperSize}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-id="adn3jo1rl" data-path="src/pages/SettingsPage.tsx">

                  <option value="A4" data-id="uop7qdnng" data-path="src/pages/SettingsPage.tsx">A4</option>
                  <option value="80mm" data-id="y0vz4p442" data-path="src/pages/SettingsPage.tsx">80mm Thermal</option>
                  <option value="58mm" data-id="hg3sdyop6" data-path="src/pages/SettingsPage.tsx">58mm Thermal</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between" data-id="vdr4uvqib" data-path="src/pages/SettingsPage.tsx">
                <Label htmlFor="autoOpenCashDrawer" data-id="6jc0i5mz0" data-path="src/pages/SettingsPage.tsx">Auto Open Cash Drawer</Label>
                <Switch
                  id="autoOpenCashDrawer"
                  defaultChecked={printerSettings.autoOpenCashDrawer} data-id="n6j84n4lo" data-path="src/pages/SettingsPage.tsx" />

              </div>
              
              <Button type="submit" className="w-full" data-id="46u274t5c" data-path="src/pages/SettingsPage.tsx">
                Save Printer Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card data-id="wtquurkrz" data-path="src/pages/SettingsPage.tsx">
          <CardHeader data-id="bllyrgt9y" data-path="src/pages/SettingsPage.tsx">
            <CardTitle className="flex items-center" data-id="pfnh1otsf" data-path="src/pages/SettingsPage.tsx">
              <User className="mr-2 h-5 w-5" data-id="wbpou3e6m" data-path="src/pages/SettingsPage.tsx" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="rht4cgqwj" data-path="src/pages/SettingsPage.tsx">
            <p className="text-sm text-gray-600 dark:text-gray-400" data-id="vcv83avhs" data-path="src/pages/SettingsPage.tsx">
              Manage user accounts and permissions
            </p>
            <Button variant="outline" className="w-full" data-id="uic810thy" data-path="src/pages/SettingsPage.tsx">
              Manage Users
            </Button>
            <Button variant="outline" className="w-full" data-id="7pv173d4u" data-path="src/pages/SettingsPage.tsx">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card data-id="1rtagdwps" data-path="src/pages/SettingsPage.tsx">
          <CardHeader data-id="pv50zf3rb" data-path="src/pages/SettingsPage.tsx">
            <CardTitle className="flex items-center" data-id="7brjv5ghw" data-path="src/pages/SettingsPage.tsx">
              <Shield className="mr-2 h-5 w-5" data-id="0ymtj21mi" data-path="src/pages/SettingsPage.tsx" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="hll976ml2" data-path="src/pages/SettingsPage.tsx">
            <div className="flex items-center justify-between" data-id="z116l8eaw" data-path="src/pages/SettingsPage.tsx">
              <div data-id="08wtxja8h" data-path="src/pages/SettingsPage.tsx">
                <Label data-id="4me4e09qg" data-path="src/pages/SettingsPage.tsx">Require Password for Refunds</Label>
                <p className="text-sm text-gray-500" data-id="j3mkurgut" data-path="src/pages/SettingsPage.tsx">Admin password required for refunds</p>
              </div>
              <Switch defaultChecked data-id="uov6b82wd" data-path="src/pages/SettingsPage.tsx" />
            </div>
            
            <div className="flex items-center justify-between" data-id="hga4ei91n" data-path="src/pages/SettingsPage.tsx">
              <div data-id="ei6a107hp" data-path="src/pages/SettingsPage.tsx">
                <Label data-id="hfy5657ob" data-path="src/pages/SettingsPage.tsx">Session Timeout</Label>
                <p className="text-sm text-gray-500" data-id="76v80wdd4" data-path="src/pages/SettingsPage.tsx">Auto-logout after 30 minutes</p>
              </div>
              <Switch defaultChecked data-id="2t9j3c7hd" data-path="src/pages/SettingsPage.tsx" />
            </div>
            
            <div className="flex items-center justify-between" data-id="mx1mwaezq" data-path="src/pages/SettingsPage.tsx">
              <div data-id="4abkwotrb" data-path="src/pages/SettingsPage.tsx">
                <Label data-id="bj47knm57" data-path="src/pages/SettingsPage.tsx">End of Day Backup</Label>
                <p className="text-sm text-gray-500" data-id="2priz7ao7" data-path="src/pages/SettingsPage.tsx">Automatic daily data backup</p>
              </div>
              <Switch defaultChecked data-id="pqi6hnuwl" data-path="src/pages/SettingsPage.tsx" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default SettingsPage;