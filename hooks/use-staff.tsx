import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/staff";
import { z } from "zod";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import { QueryParams } from "@/types/types";
import { AxiosError } from "axios";

export function useStaff(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["staff", props];

    // Fetch staff query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchStaffs(props),
    });

    // Update staff mutation
    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<z.infer<typeof staffFormSchema>>;
        }) => api.updatestaff(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("staff updated successfully");
        },
        onError: () => {
            toast.error("Failed to update staff");
        },
    });
    const createMutation = useMutation({
        mutationFn: (data: z.infer<typeof staffFormSchema>) =>
            api.createstaff(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("staff created successfully");
        },
        onError: (error: AxiosError) => {
            console.log(error);
            toast.error(
                (error?.response?.data as { message?: string })?.message ||
                    "Failed to create staff",
            );
        },
    });

    // Toggle ban status mutation
    const toggleBanMutation = useMutation({
        mutationFn: api.togglestaffBan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("staff status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update staff status");
        },
    });

    // Delete staff mutation
    const deleteMutation = useMutation({
        mutationFn: api.deletestaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("staff deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete staff");
        },
    });

    return {
        staffs: data?.staff ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createStaff: createMutation,
        updatestaff: updateMutation,
        toggleBanStatus: (id: number) => toggleBanMutation.mutate(id),
        deletestaff: deleteMutation,
    };
}
