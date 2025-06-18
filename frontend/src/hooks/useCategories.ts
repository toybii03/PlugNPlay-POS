import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export function useCategories() {
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        },
    });

    const createCategory = useMutation({
        mutationFn: async (newCategory: Partial<Category>) => {
            const response = await api.post('/categories', newCategory);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const updateCategory = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Category> & { id: number }) => {
            const response = await api.put(`/categories/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    return {
        categories,
        isLoading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
    };
} 