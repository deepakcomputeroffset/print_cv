import { ServerResponseType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useWallet = (initialData?: { id: number; balance: number }) => {
    return useQuery({
        queryKey: ["wallet"],
        queryFn: async () => {
            const { data } = await axios<
                ServerResponseType<{ id: number; balance: number }>
            >("/api/customer/wallet");
            return data.data;
        },
        initialData,
    });
};
