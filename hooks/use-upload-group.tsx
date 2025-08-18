import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api/upload.group";
import { QueryParams } from "@/types/types";

export function useUploadGroup(props: QueryParams = {}) {
    const queryKey = ["upload group", props];

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchUploadGroups(props),
    });

    return {
        data: data?.data?.data ?? [],
        error,
        isLoading,
        refetch,
    };
}
