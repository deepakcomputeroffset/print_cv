import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/product-categories";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { productCategorySchema } from "@/schemas/product-category-schema";

export function useProductCategory(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["product category", props];

    // Fetch product categories query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchProductCategories(props),
    });

    // Update product category mutation
    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof productCategorySchema>) =>
            api.createProductCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Product Category created successfully");
        },
        onError: () => {
            toast.error("Failed to create product category");
        },
    });

    // Update product category mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof productCategorySchema>>;
        }) => api.updateProductCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Product Category updated successfully");
        },
        onError: () => {
            toast.error("Failed to update product category");
        },
    });

    // Delete product category mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteProductCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Product Category deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product category");
        },
    });

    return {
        productCategories: data?.data ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createProductCategory: createMutation,
        updateProductCategory: (
            id: number,
            data: Partial<z.infer<typeof productCategorySchema>>,
        ) => updateMutation.mutate({ id, data }),
        deleteProductCategory: (id: number) => deleteMutation.mutate(id),
    };
}
