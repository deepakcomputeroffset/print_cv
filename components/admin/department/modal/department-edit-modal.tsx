import { EditDepartmentForm } from "@/components/admin/department/form/taskType-edit-form";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";

export function DepartmentEditModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "editTaskType";

    return (
        <Modal title="Edit Department" isOpen={open} onClose={onClose}>
            <EditDepartmentForm />
        </Modal>
    );
}
