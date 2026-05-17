import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/job.prefix";
import { z } from "zod";
import { jobPrefixFormSchema } from "@/schemas/job.form.schema";
import { ServerResponseType } from "@/types/types";
import { AxiosError } from "axios";

const QUERY_KEY = ["job-prefixes"];

export function useJobPrefix() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => api.fetchJobPrefixes(),
    });

    const createMutation = useMutation({
        mutationFn: (values: z.infer<typeof jobPrefixFormSchema>) =>
            api.createJobPrefix(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success("Prefix created successfully");
        },
        onError: (error) => {
            toast.error(
                error instanceof AxiosError
                    ? (error.response?.data as ServerResponseType<null>)
                          ?.message || "Failed to create prefix"
                    : "Failed to create prefix",
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteJobPrefix(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success("Prefix deleted successfully");
        },
        onError: (error) => {
            toast.error(
                error instanceof AxiosError
                    ? (error.response?.data as ServerResponseType<null>)
                          ?.message || "Failed to delete prefix"
                    : "Failed to delete prefix",
            );
        },
    });

    return {
        prefixes: data?.data?.data ?? [],
        isLoading,
        error,
        createPrefix: createMutation,
        deletePrefix: deleteMutation,
    };
}
