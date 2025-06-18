import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  currency: string;
  taxRate: number;
  receiptFooter: string;
}

export interface PrinterSettings {
  printerName: string;
  paperSize: 'A4' | '80mm' | '58mm';
  autoOpenCashDrawer: boolean;
}

interface SettingsContextType {
  storeSettings: StoreSettings;
  printerSettings: PrinterSettings;
  theme: 'light' | 'dark';
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updatePrinterSettings: (settings: Partial<PrinterSettings>) => void;
  toggleTheme: () => void;
}

const defaultStoreSettings: StoreSettings = {
  storeName: 'POS Store',
  storeAddress: '123 Main Street, City, State 12345',
  storePhone: '+1 (555) 123-4567',
  storeEmail: 'store@example.com',
  currency: 'USD',
  taxRate: 8.0,
  receiptFooter: 'Thank you for your business!'
};

const defaultPrinterSettings: PrinterSettings = {
  printerName: 'Default Printer',
  paperSize: '80mm',
  autoOpenCashDrawer: true
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>(defaultPrinterSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load settings from localStorage
    const savedStoreSettings = localStorage.getItem('pos_store_settings');
    const savedPrinterSettings = localStorage.getItem('pos_printer_settings');
    const savedTheme = localStorage.getItem('pos_theme');

    if (savedStoreSettings) {
      try {
        setStoreSettings(JSON.parse(savedStoreSettings));
      } catch (error) {
        console.error('Error loading store settings:', error);
      }
    }

    if (savedPrinterSettings) {
      try {
        setPrinterSettings(JSON.parse(savedPrinterSettings));
      } catch (error) {
        console.error('Error loading printer settings:', error);
      }
    }

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = { ...storeSettings, ...newSettings };
    setStoreSettings(updated);
    localStorage.setItem('pos_store_settings', JSON.stringify(updated));
  };

  const updatePrinterSettings = (newSettings: Partial<PrinterSettings>) => {
    const updated = { ...printerSettings, ...newSettings };
    setPrinterSettings(updated);
    localStorage.setItem('pos_printer_settings', JSON.stringify(updated));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pos_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <SettingsContext.Provider value={{
      storeSettings,
      printerSettings,
      theme,
      updateStoreSettings,
      updatePrinterSettings,
      toggleTheme
    }} data-id="m94krun52" data-path="src/contexts/SettingsContext.tsx">
      {children}
    </SettingsContext.Provider>);

};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};