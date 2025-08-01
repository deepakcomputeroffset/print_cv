import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { ProductCategoryCreateForm } from "../../category/form/product-category-create-form";

export const ProductCategoryCreateModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "createProductCategory" && isOpen;

    return (
        <Modal title="Add new category" isOpen={isModalOpen} onClose={onClose}>
            <ProductCategoryCreateForm />
        </Modal>
    );
};
