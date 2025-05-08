import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/distribution";
import { QueryParams } from "@/types/types";
import { toast } from "sonner";

export function useDistribution(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["distribution", props];

    // Fetch Distributor query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => {
            return api.getDistributionOrder(props);
        },
    });

    // Update order dispatch status mutation
    const updateDistributionOrder = useMutation({
        mutationFn: ({ orderId }: { orderId: number }) =>
            api.updatedDistributionOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("distribution order updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update distribution order");
            console.log(error);
        },
    });

    return {
        distributionOrders: data?.data ?? [],
        isLoading,
        error: error,
        refetch: refetch,
        updateDistributionOrder,
    };
}
