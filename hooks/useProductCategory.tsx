import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/product.category";
import { QueryParams } from "@/types/types";
import { getProductCategorySchema } from "@/schemas/product.category.form.schema";
import { parseFormData, parsePartialFormData } from "@/lib/formData";

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
        mutationFn: (data: FormData) => {
            const result = parseFormData(data, getProductCategorySchema());
            if (result.success) return api.createProductCategory(data);
            throw result.error;
        },
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
        mutationFn: ({ id, data }: { id: number; data: FormData }) => {
            const result = parsePartialFormData(
                data,
                getProductCategorySchema(),
            );
            if (result.success) return api.updateProductCategory(id, data);
            throw result.error;
        },
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
        productCategories: data?.data?.data ?? [],
        totalPages: data?.data?.totalPages ?? 0,
        currentPage: data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createProductCategory: createMutation,
        updateProductCategory: updateMutation,
        deleteProductCategory: deleteMutation,
    };
}
