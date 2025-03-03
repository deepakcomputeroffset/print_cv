import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { EditJobForm } from "../form/job-edit-form";

export function JobEditModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "editJob";

    return (
        <Modal title="Edit Job" isOpen={open} onClose={onClose}>
            <EditJobForm />
        </Modal>
    );
}
