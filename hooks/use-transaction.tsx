import { QueryParams } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet } from "@/lib/api/walletM";

export const useTransaction = (props: QueryParams = {}) => {
    const queryKey = ["wallet", props];
    // Fetch wallet query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => fetchWallet(props),
    });

    return {
        data: { wallet: data?.wallet, transactions: data?.transactions },
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
    };
};
