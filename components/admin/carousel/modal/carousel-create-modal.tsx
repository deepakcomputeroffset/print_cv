"use client";

import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { CarouselCreateForm } from "../form/carousel-create-form";

export const CarouselCreateModal = () => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "createCarousel" && isOpen;

    return (
        <Modal title="Add new carousel slide" isOpen={isModalOpen} onClose={onClose}>
            <CarouselCreateForm />
        </Modal>
    );
};
