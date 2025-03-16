import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "@/components/modal";
import { useDepartment } from "@/hooks/use-department";

export const DepartmentDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteTaskType";

    const {
        deleteDepartment: { mutateAsync, isPending },
    } = useDepartment();

    const handleDelete = async () => {
        if (data?.taskType?.id) {
            await mutateAsync(data?.taskType?.id);
            onClose();
        }
    };

    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Department"
            description={
                <>
                    Are you sure you want to delete?
                    <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.taskType?.name}
                    </span>
                </>
            }
        >
            <div className="flex items-center justify-between w-full">
                <Button
                    disabled={isPending}
                    variant={"ghost"}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant={"destructive"}
                    disabled={isPending}
                    onClick={handleDelete}
                >
                    {isPending ? "Deleting" : "Confirm"}
                </Button>
            </div>
        </ConfirmationModal>
    );
};
