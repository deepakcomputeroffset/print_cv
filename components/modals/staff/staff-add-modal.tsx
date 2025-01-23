"use client";
import { AddStaffForm } from "@/components/forms/staff-form";
import { Modal } from "@/components/modals/modal";
import { useModal } from "@/hooks/useModal";

export function StaffAddModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "addStaff";

    return (
        <Modal title="Add Staff" isOpen={open} onClose={onClose}>
            <AddStaffForm />
        </Modal>
    );
}
