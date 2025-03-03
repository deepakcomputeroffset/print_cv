"use client";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { AddJobForm } from "../form/job-add-form";

export function JobAddModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "addJob";

    return (
        <Modal title="Add Job" isOpen={open} onClose={onClose}>
            <AddJobForm />
        </Modal>
    );
}
