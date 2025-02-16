import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/product.attribute";
import { z } from "zod";
import { AxiosError } from "axios";
import { ProductAttributeTypeSchema } from "@/schemas/product.attribute.type.form.schema";

export function useProductAttributeType(product_category_id?: number) {
    const queryClient = useQueryClient();
    const queryKey = ["ProductAttributeType", product_category_id];

    // Fetch ProductAttributeType query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchProductAttributes(product_category_id),
    });

    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof ProductAttributeTypeSchema>) =>
            api.createProductAttributeType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("product attribute created created successfully");
        },
        onError: (error: AxiosError) => {
            console.log(error);
            toast.error(
                (error?.response?.data as { message?: string })?.message ||
                    "Failed to create product attribute type",
            );
        },
    });

    // Delete ProductAttributeType mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteProductAttributeType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("product attribute type deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product attribute type");
        },
    });

    return {
        ProductAttributeTypes: data?.data ?? [],
        error,
        isLoading,
        refetch,
        createProductAttributeType: createMutation,
        deleteProductAttributeType: deleteMutation,
    };
}
