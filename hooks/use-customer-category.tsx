import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/customer.category";
import { z } from "zod";
import { customerCategorySchema } from "@/schemas/customer.category.form.schema";

export function useCustomerCategory() {
    const queryClient = useQueryClient();
    const queryKey = ["customers-category"];

    // Fetch customers query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchCustomerCategories(),
    });

    // create customer category mutation
    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof customerCategorySchema>) =>
            api.createCustomerCategories(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer category created successfully");
        },
        onError: () => {
            toast.error("Failed to create customer category");
        },
    });
    // Update customer mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof customerCategorySchema>>;
        }) => api.updateCustomerCategories(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer category updated successfully");
        },
        onError: () => {
            toast.error("Failed to update customer category");
        },
    });

    // Delete customer mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer category deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete customer category");
        },
    });

    return {
        customersCategory: data ?? [],
        createCustomerCategory: createMutation,
        error,
        isLoading,
        refetch,
        updateCustomerCategory: updateMutation,
        deleteCustomerCategory: deleteMutation,
    };
}
