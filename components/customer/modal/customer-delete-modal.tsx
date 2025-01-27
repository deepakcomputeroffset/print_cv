"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "../../modal";
import { useCustomers } from "@/hooks/use-customers";

export const CustomerDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "customerDelete";
    const { deleteCustomer, isLoading } = useCustomers();
    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Customer"
            description={
                <>
                    Are you sure you want to do this? <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.customer?.name} {" -- "}
                        {data?.customer?.business_name}
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
                        deleteCustomer(data?.customer?.id as number);
                        onClose();
                    }}
                >
                    {isLoading ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
