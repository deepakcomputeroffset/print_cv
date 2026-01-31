import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/order";
import { QueryParams } from "@/types/types";
import { UPLOADVIA } from "@prisma/client";

export function useOrder(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["orders", props];

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchOrders(props),
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const createMutation = useMutation({
        mutationFn: (data: {
            productItemId: number;
            qty: number;
            fileOption: UPLOADVIA;
        }) => api.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Order created successfully");
        },
        onError: () => {
            toast.error("Failed to Place Order");
        },
    });

    const cancelMutation = useMutation({
        mutationFn: api.cancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Order Cancelled successfully");
        },
        onError: () => {
            toast.error("Failed to Cancel Order");
        },
    });

    return {
        orders: data?.data?.data?.data ?? [],
        totalPages: data?.data?.data?.totalPages ?? 0,
        currentPage: data?.data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createOrder: createMutation,
        cancelOrder: cancelMutation,
    };
}
