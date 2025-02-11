import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { ProductCategoryEditForm } from "../form/product-category-edit-form";

export const ProductCategoryEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editProductCategory" && isOpen;

    return (
        <Modal
            title="Edit Product Category"
            isOpen={isModalOpen}
            onClose={onClose}
        >
            <ProductCategoryEditForm />
        </Modal>
    );
};
