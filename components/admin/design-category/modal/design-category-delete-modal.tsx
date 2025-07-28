"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../../modal";
import { useDesignCategory } from "@/hooks/use-design-category";

export const DesignCategoryDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteDesignCategory";
    const { deleteDesignCategory, isLoading } = useDesignCategory();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Design Category"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.designCategory?.name}
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
                        deleteDesignCategory?.mutate(
                            data?.designCategory?.id as number,
                        );
                        onClose();
                    }}
                >
                    {isLoading ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
