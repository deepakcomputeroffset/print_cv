import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/job";
import { z } from "zod";
import { jobFormSchema } from "@/schemas/job.form.schema";
import { QueryParams, ServerResponseType } from "@/types/types";
import { AxiosError } from "axios";

export function useJob(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["jobs", props];

    // Fetch job query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchJobs(props),
    });

    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof jobFormSchema>) =>
            api.createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("job created successfully");
        },
        onError: (error) => {
            console.log(error);
            toast.error(
                error instanceof AxiosError
                    ? (error.response?.data as ServerResponseType<null>).message
                    : "Failed to create job",
            );
        },
    });

    // Update job mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof jobFormSchema>>;
        }) => api.updateJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Job updated successfully");
        },
        onError: () => {
            toast.error("Failed to update Job");
        },
    });

    // Delete job mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Job deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete job");
        },
    });

    return {
        data: data?.data.data?.jobs ?? [],
        totalPages: data?.data?.data?.totalPages ?? 0,
        currentPage: data?.data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        updateJob: updateMutation,
        deleteJob: deleteMutation,
        createJob: createMutation,
    };
}
