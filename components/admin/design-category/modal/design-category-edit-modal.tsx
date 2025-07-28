import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { DesignCategoryEditForm } from "../form/design-category-edit-form";

export const DesignCategoryEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editDesignCategory" && isOpen;

    return (
        <Modal
            title="Edit Design Category"
            isOpen={isModalOpen}
            onClose={onClose}
        >
            <DesignCategoryEditForm />
        </Modal>
    );
};
