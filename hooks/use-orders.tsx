import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/orders";
import { QueryParams } from "@/types/types";

export function useOrders(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["admin-orders", props];

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchOrders(props),
        refetchInterval: 1000 * 10,
    });

    // Update job mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: number[] }) =>
            api.addJobToOrders(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Orders updated successfully");
        },
        onError: () => {
            toast.error("Failed to update Orders");
        },
    });
    return {
        orders: data?.data?.data?.orders ?? [],
        totalPages: data?.data?.data?.totalPages ?? 0,
        currentPage: data?.data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        addJobToOrders: updateMutation,
    };
}
