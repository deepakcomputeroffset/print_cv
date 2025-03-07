import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useJob } from "@/hooks/use-job";
import { useModal } from "@/hooks/use-modal";
import { ServerResponseType } from "@/types/types";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const AddToJobModal = ({
    addJobToOrders,
}: {
    addJobToOrders: UseMutationResult<
        AxiosResponse<ServerResponseType<null>>,
        Error,
        {
            id: number;
            data: number[];
        },
        unknown
    >;
}) => {
    const { isOpen, modal, data, onClose } = useModal();
    const isModalOpen = modal === "selectJob" && isOpen;
    const { data: jobs, isLoading } = useJob({ perpage: 100 });
    const [selectedJob, setSelectedJob] = useState<string>();
    const { mutateAsync, isPending } = addJobToOrders;
    const orderIds = useCallback(
        () => data?.orders?.map((v) => v.id),
        [data?.orders],
    );

    const handleSubmit = async () => {
        try {
            if (
                !selectedJob ||
                isNaN(parseInt(selectedJob)) ||
                !data?.orders?.length
            ) {
                toast.warning("Select Job or order");
                return;
            }

            await mutateAsync({
                id: parseInt(selectedJob),
                data: orderIds() as number[],
            });

            onClose();
        } catch (error) {
            console.log(error);
            onClose();
        }
    };
    return (
        <Modal
            title="Select Jobs"
            onClose={() => {
                onClose();
                setSelectedJob("");
            }}
            isOpen={isModalOpen}
        >
            <div>
                <span>Total Order Selected : </span>{" "}
                <span>{data.orders?.length}</span>
            </div>
            <Select
                value={selectedJob}
                onValueChange={(value) => setSelectedJob(value)}
            >
                <SelectTrigger>
                    {isLoading ? (
                        <SelectValue placeholder="Loading..." />
                    ) : (
                        <SelectValue placeholder="Select a Job" />
                    )}
                </SelectTrigger>
                <SelectContent>
                    {jobs?.map((job) => (
                        <SelectItem value={job.id.toString()} key={job.id}>
                            {job?.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button disabled={!selectedJob || isPending} onClick={handleSubmit}>
                {isPending ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                    "Add"
                )}
            </Button>
        </Modal>
    );
};
