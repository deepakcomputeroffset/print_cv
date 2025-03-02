import { useQuery } from "@tanstack/react-query";
import { fetchCustomerByWalletid } from "@/lib/api/walletM";

export function useCustomerByWallet(id: number | string) {
    const queryKey = ["customer", "wallet", id];

    // Fetch customers query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => fetchCustomerByWalletid(id),
        staleTime: 10000,
        refetchInterval: 10000,
    });

    return {
        customer: data?.data.data,
        error,
        isLoading,
        refetch,
    };
}
