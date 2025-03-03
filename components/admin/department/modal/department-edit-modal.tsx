import { EditDepartmentForm } from "@/components/admin/department/form/department-edit-form";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";

export function DepartmentEditModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "editDepartment";

    return (
        <Modal title="Edit Department" isOpen={open} onClose={onClose}>
            <EditDepartmentForm />
        </Modal>
    );
}
