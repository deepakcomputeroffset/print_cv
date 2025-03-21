import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/dispatch";
import { QueryParams } from "@/types/types";

export function useDispatch(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["dispatch", props];

    // Fetch orders to dispatch query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.getOrdersToDispatch(props),
    });

    // Update order dispatch status mutation
    const toggleDispatchStatus = useMutation({
        mutationFn: ({ id }: { id: number }) => api.updateOrderDispatch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Order dispatch status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update order dispatch status");
        },
    });

    return {
        orders: data?.data?.orders ?? [],
        totalPages: data?.data?.totalPages ?? 0,
        currentPage: data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        updateOrderDispatch: toggleDispatchStatus,
    };
}
