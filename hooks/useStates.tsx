import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useStates = () => {
    return useQuery<
        {
            id: number;
            cities: [];
            countryId: 1;
            name: string;
        }[]
    >({
        queryKey: ["states"],
        staleTime: -1,
        queryFn: async () => {
            try {
                const { data } = await axios("/api/state");
                return data?.data;
            } catch (error) {
                console.error(error);
                toast("Failed to get states");
                return [];
            }
        },
    });
};
