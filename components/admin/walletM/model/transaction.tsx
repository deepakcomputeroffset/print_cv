"use client";
import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { TransactionForm } from "../form/transaction-form";

export function TransactionCreateModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "transaction";

    return (
        <Modal title="Create Transaction" isOpen={open} onClose={onClose}>
            <TransactionForm />
        </Modal>
    );
}
