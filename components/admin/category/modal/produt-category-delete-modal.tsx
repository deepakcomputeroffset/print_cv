"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../../modal";
import { useProductCategory } from "@/hooks/useProductCategory";

export const ProductCategoryDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteProductCategory";
    const { deleteProductCategory, isLoading } = useProductCategory();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Category"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.productCategory?.name}
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
                        deleteProductCategory.mutate(
                            data?.productCategory?.id as number,
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
