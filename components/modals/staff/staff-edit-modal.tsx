"use client";
import { EditStaffForm } from "@/components/admin/forms/staff-form";
import { Modal } from "@/components/modals/modal";
import { useModal } from "@/hooks/useModal";

export function StaffEditModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "staffEdit";

    return (
        <Modal title="Edit Staff" isOpen={open} onClose={onClose}>
            <EditStaffForm />
        </Modal>
    );
}
