"use client";

import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { CarouselDeleteForm } from "../form/carousel-delete-form";

export const CarouselDeleteModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "deleteCarousel" && isOpen;

    return (
        <Modal
            title="Delete carousel slide"
            isOpen={isModalOpen}
            onClose={onClose}
        >
            <CarouselDeleteForm />
        </Modal>
    );
};
