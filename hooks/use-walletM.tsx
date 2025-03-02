import { QueryParams } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/walletM";
import { transactionFormSchema } from "@/schemas/transaction.form.schema";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
export const useWalletM = (props: QueryParams = {}) => {
    const queryClient = useQueryClient();
    const queryKey = ["walletM", props];

    // Fetch customers with wallet
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchWallets(props),
    });

    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof transactionFormSchema>) =>
            api.createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("transaction created successfully");
        },
        onError: (error: AxiosError) => {
            console.log(error);
            toast.error(
                (error?.response?.data as { message?: string })?.message ||
                    "Failed to create transaction",
            );
        },
    });

    return {
        data: data?.customers ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createTranction: createMutation,
    };
};
