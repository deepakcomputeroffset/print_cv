"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/api/order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "@/components/modal";

export function CancellationModal() {
    const { isOpen, onClose, modal, data } = useModal();
    const isModalOpen = isOpen && modal === "cancelOrder";
    const orderId = data.orderId;

    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();

    const handleCancelOrder = async () => {
        if (!orderId) {
            toast.error("Order ID is missing");
            return;
        }

        try {
            setIsCancelling(true);
            const response = await cancelOrder(orderId);

            if (!response.data.success) {
                throw new Error(
                    response.data.error || "Failed to cancel order",
                );
            }

            toast.success(
                response.data.message || "Order cancelled successfully",
            );
            router.refresh();
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel order",
            );
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={onClose}
            title={`Cancel Order`}
            description={
                <>
                    Are you sure you want to cancel this order? <br />
                    <span className="font-semibold text-indigo-500">
                        #{orderId}
                    </span>
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={isCancelling}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={isCancelling}
                    onClick={() => handleCancelOrder()}
                >
                    {isCancelling ? "Canceling..." : "Cancel"}
                </Button>
            </div>
        </ConfirmationModal>
    );
}
