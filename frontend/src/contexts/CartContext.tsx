import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  tax: number;
  discountTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.08; // 8% tax rate

export const CartProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
        item.id === product.id ?
        { ...item, quantity: item.quantity + quantity } :
        item
        );
      }

      return [...prev, { ...product, quantity, discount: 0 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
    prev.map((item) =>
    item.id === productId ? { ...item, quantity } : item
    )
    );
  };

  const applyDiscount = (productId: string, discount: number) => {
    setItems((prev) =>
    prev.map((item) =>
    item.id === productId ? { ...item, discount } : item
    )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmount = (item.discount || 0) / 100 * itemTotal;
    return sum + (itemTotal - discountAmount);
  }, 0);

  const discountTotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmount = (item.discount || 0) / 100 * itemTotal;
    return sum + discountAmount;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      applyDiscount,
      clearCart,
      total,
      subtotal,
      tax,
      discountTotal
    }} data-id="k3x73n5gg" data-path="src/contexts/CartContext.tsx">
      {children}
    </CartContext.Provider>);

};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};