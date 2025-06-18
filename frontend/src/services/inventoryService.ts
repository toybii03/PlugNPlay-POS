import api from './api';

export interface InventoryStats {
    total_products: number;
    low_stock_items: number;
    out_of_stock: number;
    total_value: number;
}

export interface InventoryTransaction {
    id: number;
    product_id: number;
    type: 'add' | 'remove';
    quantity: number;
    reason: string;
    previous_quantity: number;
    new_quantity: number;
    user_id: number;
    created_at: string;
    product: {
        id: number;
        name: string;
        sku: string;
    };
    user: {
        id: number;
        name: string;
    };
}

export interface StockAdjustment {
    type: 'add' | 'remove';
    quantity: number;
    reason: string;
}

const inventoryService = {
    getStats: async (): Promise<InventoryStats> => {
        const response = await api.get('/inventory/stats');
        return response.data;
    },

    adjustStock: async (productId: number, adjustment: StockAdjustment): Promise<{ message: string; new_quantity: number }> => {
        const response = await api.post(`/inventory/products/${productId}/adjust`, adjustment);
        return response.data;
    },

    getTransactions: async (params?: {
        product_id?: number;
        start_date?: string;
        end_date?: string;
        type?: 'add' | 'remove';
        page?: number;
    }) => {
        const response = await api.get('/inventory/transactions', { params });
        return response.data;
    },

    exportInventory: async () => {
        const response = await api.get('/inventory/export', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inventory.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    importInventory: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/inventory/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default inventoryService; 