import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "@/lib/api/design.items";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { designItemSchema } from "@/schemas/design.item.form.schema";
import { parseFormData, parsePartialFormData } from "@/lib/formData";

export function useDesignItems(props: QueryParams = {}) {
    const queryClient = useQueryClient();
    const queryKey = ["design-items", props];

    // Fetch designs query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => api.fetchDesigns(props),
    });
    // create design mutation
    const createMutation = useMutation({
        mutationFn: (data: FormData) => {
            const result = parseFormData(data, designItemSchema);
            if (result.success) return api.createDesign(data);
            throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design created successfully");
        },
        onError: () => {
            toast.error("Failed to update design");
        },
    });

    // Update design mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FormData }) => {
            const result = parsePartialFormData(data, designItemSchema);
            if (result.success) return api.updateDesign(id, data);
            throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design updated successfully");
        },
        onError: () => {
            toast.error("Failed to update design");
        },
    });

    // Delete design mutation
    const deleteMutation = useMutation({
        mutationFn: api.deleteDesign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("design deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete design");
        },
    });

    return {
        designs: data?.data ?? [],
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.page ?? 1,
        error,
        isLoading,
        refetch,
        createDesign: createMutation,
        updateDesign: updateMutation,
        deleteDesign: deleteMutation,
    };
}
