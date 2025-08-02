import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { DesignEditForm } from "../form/design-edit-form";

export const DesignEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editDesign" && isOpen;

    return (
        <Modal title="Edit Design" isOpen={isModalOpen} onClose={onClose}>
            <DesignEditForm />
        </Modal>
    );
};
