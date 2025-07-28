import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/design.category";
import { QueryParams } from "@/types/types";
import { getDesignCategorySchema } from "@/schemas/design.category.form.schema";
import { parseFormData, parsePartialFormData } from "@/lib/formData";

export function useDesignCategory(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["design category", props];

    // Fetch design categories query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchProductCategories(props),
    });

    // Update design category mutation
    const createMutation = useMutation({
        mutationFn: (data: FormData) => {
            const result = parseFormData(data, getDesignCategorySchema());
            if (result.success) return api.createProductCategory(data);
            throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design Category created successfully");
        },
        onError: () => {
            toast.error("Failed to create design category");
        },
    });

    // Update design category mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FormData }) => {
            const result = parsePartialFormData(
                data,
                getDesignCategorySchema(),
            );
            if (result.success) return api.updateProductCategory(id, data);
            throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design Category updated successfully");
        },
        onError: () => {
            toast.error("Failed to update design category");
        },
    });

    // Delete design category mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteProductCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design Category deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete design category");
        },
    });

    return {
        designCategories: data?.data?.data ?? [],
        totalPages: data?.data?.totalPages ?? 0,
        currentPage: data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createDesignCategory: createMutation,
        updateDesignCategory: updateMutation,
        deleteDesignCategory: deleteMutation,
    };
}
