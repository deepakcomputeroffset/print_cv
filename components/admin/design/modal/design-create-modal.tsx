"use client";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { DesignCreateForm } from "../form/design-create-form";

export const DesignCreateModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "createDesign" && isOpen;

    return (
        <Modal title="Add new Design" isOpen={isModalOpen} onClose={onClose}>
            <DesignCreateForm />
        </Modal>
    );
};
