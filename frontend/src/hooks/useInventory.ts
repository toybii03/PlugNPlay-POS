import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import inventoryService, { StockAdjustment } from '@/services/inventoryService';
import { useToast } from '@/hooks/use-toast';

export const useInventory = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isImporting, setIsImporting] = useState(false);

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['inventory-stats'],
        queryFn: inventoryService.getStats,
    });

    const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['inventory-transactions'],
        queryFn: () => inventoryService.getTransactions(),
    });

    const adjustStockMutation = useMutation({
        mutationFn: ({ productId, adjustment }: { productId: number; adjustment: StockAdjustment }) =>
            inventoryService.adjustStock(productId, adjustment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: 'Success',
                description: 'Stock adjusted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to adjust stock',
                variant: 'destructive',
            });
        },
    });

    const handleExport = useCallback(async () => {
        try {
            await inventoryService.exportInventory();
            toast({
                title: 'Success',
                description: 'Inventory exported successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to export inventory',
                variant: 'destructive',
            });
        }
    }, [toast]);

    const handleImport = useCallback(async (file: File) => {
        setIsImporting(true);
        try {
            await inventoryService.importInventory(file);
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: 'Success',
                description: 'Inventory imported successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to import inventory',
                variant: 'destructive',
            });
        } finally {
            setIsImporting(false);
        }
    }, [queryClient, toast]);

    return {
        stats,
        transactions,
        isLoadingStats,
        isLoadingTransactions,
        isImporting,
        adjustStock: adjustStockMutation.mutate,
        exportInventory: handleExport,
        importInventory: handleImport,
    };
}; 