import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ReportData {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topProducts: {
        name: string;
        quantity: number;
        revenue: number;
        growth: string;
    }[];
    lowStockItems: {
        name: string;
        stock: number;
        minStock: number;
    }[];
    summary: {
        totalSales: number;
        totalOrders: number;
        averageOrderValue: number;
        totalCustomers: number;
        totalProducts: number;
    };
}

interface UseReportsProps {
    reportType: 'sales' | 'inventory' | 'products';
    dateRange: 'today' | 'week' | 'month' | 'year';
    timeRange: '7d' | '30d' | '90d' | '1y';
}

export function useReports({ reportType, dateRange, timeRange }: UseReportsProps) {
    const queryClient = useQueryClient();

    // Fetch report data
    const { data: reportData, isLoading, error } = useQuery({
        queryKey: ['reports', reportType, dateRange, timeRange],
        queryFn: async () => {
            try {
                const response = await api.get('/reports', {
                    params: {
                        type: reportType,
                        range: dateRange,
                        timeRange
                    }
                });
                return response.data;
            } catch (error) {
                // For demo, return mock data
                return {
                    totalSales: 25890.50,
                    totalOrders: 142,
                    averageOrderValue: 182.33,
                    topProducts: [
                        { name: 'iPhone 13 Pro', quantity: 25, revenue: 24975.00, growth: '+15%' },
                        { name: 'Samsung Galaxy S22', quantity: 18, revenue: 14399.82, growth: '+8%' },
                        { name: 'AirPods Pro', quantity: 30, revenue: 7499.70, growth: '+12%' },
                        { name: 'MacBook Air M2', quantity: 10, revenue: 11999.90, growth: '+3%' },
                        { name: 'iPad Pro', quantity: 15, revenue: 16499.85, growth: '+5%' }
                    ],
                    lowStockItems: [
                        { name: 'iPhone 13 Pro', stock: 2, minStock: 5 },
                        { name: 'MacBook Air M2', stock: 1, minStock: 3 },
                        { name: 'AirPods Pro', stock: 4, minStock: 10 }
                    ],
                    summary: {
                        totalSales: 156780.50,
                        totalOrders: 287,
                        averageOrderValue: 546.27,
                        totalCustomers: 145,
                        totalProducts: 89,
                    }
                };
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    });

    // Function to manually refresh data
    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['reports'] });
    };

    // Function to download report
    const downloadReport = async () => {
        try {
            const response = await api.get('/reports/download', {
                params: {
                    type: reportType,
                    range: dateRange,
                    timeRange
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType}-report-${dateRange}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download report:', error);
        }
    };

    return {
        reportData,
        isLoading,
        error,
        refreshData,
        downloadReport
    };
} 