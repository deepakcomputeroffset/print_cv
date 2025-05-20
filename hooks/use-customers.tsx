import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/customer";
import { z } from "zod";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import { QueryParams } from "@/types/types";

export function useCustomers(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["customers", props];

    // Fetch customers query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchCustomers(props),
    });

    // Update customer mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof customerFormSchema>>;
        }) => api.updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer updated successfully");
        },
        onError: () => {
            toast.error("Failed to update customer");
        },
    });

    // Toggle ban status mutation
    const toggleBanMutation = useMutation({
        mutationFn: api.toggleCustomerBan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update customer status");
        },
    });
    // Toggle verify status mutation
    const toggleVerifyMutation = useMutation({
        mutationFn: api.toggleCustomerVerifyStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer verification status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update customer status");
        },
    });

    // Delete customer mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Customer deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete customer");
        },
    });

    return {
        customers: data?.customers ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        updateCustomer: updateMutation,
        toggleBanStatus: (id: number) => toggleBanMutation.mutate(id),
        toggleVerifyStatus: (id: number) => toggleVerifyMutation.mutate(id),
        deleteCustomer: (id: number) => deleteMutation.mutate(id),
    };
}
