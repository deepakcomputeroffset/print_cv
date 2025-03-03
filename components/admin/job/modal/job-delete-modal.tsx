import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ConfirmationModal } from "@/components/modal";
import { useJob } from "@/hooks/use-job";

export const JobDeleteModal = () => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "deleteJob";

    const {
        deleteJob: { mutateAsync, isPending },
    } = useJob();

    const handleDelete = async () => {
        if (data?.job?.id) {
            await mutateAsync(data?.job?.id);
            onClose();
        }
    };

    return (
        <ConfirmationModal
            isOpen={open}
            onClose={onClose}
            title="Delete Job"
            description={
                <>
                    Are you sure you want to delete?
                    <br />
                    <span className="font-semibold text-indigo-500">
                        {data?.job?.name}
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
