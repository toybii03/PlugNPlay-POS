import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface Product {
  [x: string]: any;
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost_price: number;
  quantity: number;
  alert_quantity: number;
  category_id: number;
  barcode: string;
  image: string;
  is_active: boolean;
}

interface ProductFilters {
  search?: string;
  category_id?: number;
  low_stock?: boolean;
}

export function useProducts(filters?: ProductFilters) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await api.get("/products", { params: filters });
      return response.data;
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: FormData) => {
      const response = await api.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, product }: { id: number; product: FormData }) => {
      const response = await api.post(`/products/${id}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products: (data?.data ?? []) as Product[],
    pagination: {
      total: data?.total,
      per_page: data?.per_page,
      current_page: data?.current_page,
      last_page: data?.last_page,
    },
    isLoading,
    refetch,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isCreating: createProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
}
