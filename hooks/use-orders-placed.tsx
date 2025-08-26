import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api/orders.placed";
import { QueryParams } from "@/types/types";

export function useOrdersPlaced(props: QueryParams = {}) {
    const queryKey = ["admin-orders-placed", props];

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchOrdersPlaced(props),
        refetchInterval: 1000 * 10,
    });

    return {
        orders: data?.data?.data?.orders ?? [],
        totalPages: data?.data?.data?.totalPages ?? 0,
        currentPage: data?.data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
    };
}
