"use client";

import React from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../modal";
import { CustomerEditForm } from "@/components/forms/customer-form";

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
