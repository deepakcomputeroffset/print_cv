"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "@/components/modal";
import { useStaff } from "@/hooks/use-staff";
import { Loader2 } from "lucide-react";

export const StaffDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "staffDelete";

    const {
        deletestaff: { mutateAsync, isPending },
    } = useStaff();

    const handleDelete = async () => {
        if (data?.staff?.id) {
            await mutateAsync(data?.staff?.id);
            onClose();
        }
    };

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
                    type="submit"
                    className={`w-full`}
                    disabled={isPending}
                    onClick={handleDelete}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "update"
                    )}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
