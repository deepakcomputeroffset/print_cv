import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/customers";
import { z } from "zod";
import { customerFormSchema } from "@/schemas/customer-register-schema";

export function useCustomers(props: api.CustomerQueryParams = {}) {
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
            queryClient.invalidateQueries({ queryKey: ["customers"] });
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
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Customer status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update customer status");
        },
    });

    // Delete customer mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
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
        updateCustomer: (
            id: number,
            data: Partial<z.infer<typeof customerFormSchema>>,
        ) => updateMutation.mutate({ id, data }),
        toggleBanStatus: (id: number) => toggleBanMutation.mutate(id),
        deleteCustomer: (id: number) => deleteMutation.mutate(id),
    };
}
