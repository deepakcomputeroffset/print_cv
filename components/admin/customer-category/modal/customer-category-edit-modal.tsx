"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "../../../modal";
import { CustomerCategoryEditForm } from "@/components/admin/customer-category/form/customer-category-edit-form";

export const CustomerCategoryEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editCustomerCategory" && isOpen;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onClose}
            title="Edit Customer Category"
        >
            <CustomerCategoryEditForm />
        </Modal>
    );
};
