"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "../../../modal";
import { CustomerCategoryAddForm } from "@/components/admin/customer-category/form/customer-category-add-form";

export const CustomerCategoryAddModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "addCustomerCategory" && isOpen;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onClose}
            title="Add Customer Category"
        >
            <CustomerCategoryAddForm />
        </Modal>
    );
};
