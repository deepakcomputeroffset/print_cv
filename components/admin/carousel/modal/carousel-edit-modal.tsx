"use client";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { CarouselEditForm } from "../form/carousel-edit-form";

export const CarouselEditModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "editCarousel" && isOpen;

    return (
        <Modal title="Edit carousel slide" isOpen={isModalOpen} onClose={onClose}>
            <CarouselEditForm />
        </Modal>
    );
};
