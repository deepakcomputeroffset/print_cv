import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api/distributor";

export function useDistributor(cityId: number) {
    const queryKey = ["distributor", cityId];

    // Fetch Distributor query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => {
            return api.getDistributorByCity(cityId);
        },
    });

    return {
        distributorsByCity: data?.data ?? [],
        isLoadingByCity: isLoading,
        errorByCity: error,
        refetchByCity: refetch,
    };
}
