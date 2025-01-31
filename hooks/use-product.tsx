import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/product";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { productFormSchema } from "@/schemas/product-schema";

export function useProducts(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["products", props];

    // Fetch products query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchProducts(props),
    });

    // create product mutation
    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof productFormSchema>) =>
            api.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Product created successfully");
        },
        onError: () => {
            toast.error("Failed to update product");
        },
    });

    // Update product mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof productFormSchema>>;
        }) => api.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Product created successfully");
        },
        onError: () => {
            toast.error("Failed to update product");
        },
    });

    // Toggle avialable status mutation
    const toggleProductAvialability = useMutation({
        mutationFn: api.toggleAvialability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("product status created successfully");
        },
        onError: () => {
            toast.error("Failed to create product status");
        },
    });

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("product deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product");
        },
    });

    return {
        products: data?.data ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createProduct: createMutation,
        updateproduct: updateMutation,
        toggleBanStatus: toggleProductAvialability,
        deleteproduct: deleteMutation,
    };
}
