"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "../../modal";
import { CustomerEditForm } from "@/components/customer/form/customer-form";

export const CustomerEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editCustomer" && isOpen;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onClose}
            title="Edit Customer"
            description={
                "The long string is hashed, so that one can see the actual password. if you want to change the password. so, remove all text and enter new password."
            }
        >
            <CustomerEditForm />
        </Modal>
    );
};
