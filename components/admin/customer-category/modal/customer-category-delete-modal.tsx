"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../../modal";
import { useCustomerCategory } from "@/hooks/use-customer-category";

export const CustomerCategoryDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteCustomerCategory";
    const { deleteCustomerCategory } = useCustomerCategory();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Customer Category"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.customerCategory?.name} {" -- "}
                        {data?.customerCategory?.discount}%
                    </span>
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={deleteCustomerCategory.isPending}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={deleteCustomerCategory.isPending}
                    onClick={() => {
                        deleteCustomerCategory.mutate(
                            data?.customerCategory?.id as number,
                        );
                        onClose();
                    }}
                >
                    {deleteCustomerCategory.isPending ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
