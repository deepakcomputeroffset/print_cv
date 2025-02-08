"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../modal";
import { useProducts } from "@/hooks/use-product";

export const ProductDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteProduct";
    const { deleteproduct } = useProducts();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Product"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.product?.name} {" -- "}
                        {data?.product?.sku}
                    </span>
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={deleteproduct?.isPending}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={deleteproduct?.isPending}
                    onClick={() => {
                        deleteproduct?.mutate(data?.product?.id as number);
                        onClose();
                    }}
                >
                    {deleteproduct?.isPending ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
