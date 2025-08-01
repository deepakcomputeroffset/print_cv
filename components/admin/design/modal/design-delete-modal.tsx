"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../../modal";
import { useDesignItems } from "@/hooks/use-design-items";

export const DesignDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteDesign";
    const { deleteDesign, isLoading } = useDesignItems();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Design"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.design?.name}
                    </span>
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={isLoading}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={isLoading}
                    onClick={() => {
                        deleteDesign.mutate(data?.design?.id as number);
                        onClose();
                    }}
                >
                    {isLoading ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
