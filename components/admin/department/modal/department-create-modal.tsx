"use client";
import { AddDepartmentForm } from "@/components/admin/department/form/department-add-form";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";

export function DepartmentAddModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "addDepartment";

    return (
        <Modal title="Add Department" isOpen={open} onClose={onClose}>
            <AddDepartmentForm />
        </Modal>
    );
}
