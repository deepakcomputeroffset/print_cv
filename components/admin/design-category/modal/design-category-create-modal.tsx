import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { DesignCategoryCreateForm } from "../form/design-category-create-form";

export const DesignCategoryCreateModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "addDesignCategory" && isOpen;

    return (
        <Modal
            title="Add new Design category"
            isOpen={isModalOpen}
            onClose={onClose}
        >
            <DesignCategoryCreateForm />
        </Modal>
    );
};
