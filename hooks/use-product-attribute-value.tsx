import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/product-attribute-value";
import { z } from "zod";
import { AxiosError } from "axios";
import { ProductAttributeValueSchema } from "@/schemas/product-attribute-type-value";

export function useProductAttributeValue(productAttributeId?: number) {
    const queryClient = useQueryClient();
    const queryKey = ["ProductAttributeValue", productAttributeId];

    // Fetch ProductAttributeValues query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchProductAttributeValues(productAttributeId),
    });

    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof ProductAttributeValueSchema>) =>
            api.createProductAttributeValue(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success(
                "product attribute value created created successfully",
            );
        },
        onError: (error: AxiosError) => {
            console.log(error);
            toast.error(
                (error?.response?.data as { message?: string })?.message ||
                    "Failed to create product attribute value",
            );
        },
    });

    // Delete ProductAttributeValue mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteProductAttributeValue,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("product attribute value deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product attribute value");
        },
    });

    return {
        ProductAttributeValues: data?.data ?? [],
        error,
        isLoading,
        refetch,
        createProductAttributeValue: createMutation,
        deleteProductAttributeValue: deleteMutation,
    };
}
