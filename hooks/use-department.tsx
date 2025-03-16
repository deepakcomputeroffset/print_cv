import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/department";
import { z } from "zod";
import { taskTypeFormSchema } from "@/schemas/taskType.form.schema";
import { QueryParams, ServerResponseType } from "@/types/types";
import { AxiosError } from "axios";

export function useDepartment(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["departments", props];

    // Fetch department query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchDepartments(props),
    });

    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof taskTypeFormSchema>) =>
            api.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("department created successfully");
        },
        onError: (error) => {
            console.log(error);
            toast.error(
                error instanceof AxiosError
                    ? (error.response?.data as ServerResponseType<null>).message
                    : "Failed to create department",
            );
        },
    });

    // Update customer mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof taskTypeFormSchema>>;
        }) => api.updateDepartment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Department updated successfully");
        },
        onError: () => {
            toast.error("Failed to update Department");
        },
    });

    // Delete customer mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Department deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete department");
        },
    });

    return {
        data: data?.data.data?.departments ?? [],
        totalPages: data?.data?.data?.totalPages ?? 0,
        currentPage: data?.data?.data?.page ?? 1,
        error,
        isLoading,
        refetch,
        updateDepartment: updateMutation,
        deleteDepartment: deleteMutation,
        createDepartment: createMutation,
    };
}
