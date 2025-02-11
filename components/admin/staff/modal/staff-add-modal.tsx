"use client";
import { AddStaffForm } from "@/components/admin/staff/form/staff-add-form";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";

export function StaffAddModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "addStaff";

    return (
        <Modal title="Add Staff" isOpen={open} onClose={onClose}>
            <AddStaffForm />
        </Modal>
    );
}
