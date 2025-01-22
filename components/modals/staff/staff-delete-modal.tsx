"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { staff } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useModal } from "@/hooks/useModal";
import { ConfirmationModal } from "../modal";

export const StaffDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "staffDelete";

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (id: number) => {
            const { data: res } = await axios.delete("/api/staff", {
                data: {
                    id,
                },
            });
            return res;
        },

        onError(error: AxiosError<{ message: string; succuss: boolean }>) {
            toast(error?.response?.data?.message || "Delete failed");
        },

        onSuccess(res) {
            if (res?.success) {
                try {
                    queryClient.setQueryData(
                        [
                            "admin-staff",
                            data?.page || "1",
                            data?.searchParameter || "",
                        ],
                        (oldData: staff[]) => {
                            return oldData.filter(
                                (s) => s.id !== res?.data?.id,
                            );
                        },
                    );
                    toast(res?.message);
                    onClose();
                } catch (error) {
                    console.log(error);
                    console.log("error in staff upadate");
                }
            }
        },
    });

    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Staff"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.staff?.name}
                    </span>{" "}
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={isPending}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={isPending}
                    onClick={() => mutate(data?.staff?.id as number)}
                >
                    {isPending ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
