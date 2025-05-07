import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { staffType } from "@/types/types";
import { getDistributorByCity } from "@/lib/api/distributor";
import { UseMutationResult } from "@tanstack/react-query";
import { Modal } from "@/components/modal";

export const SelectDributorModal = ({
    dispatchDirectly,
    dispatchViaDistributor,
}: {
    dispatchDirectly: UseMutationResult<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        Error,
        {
            id: number;
        },
        unknown
    >;
    dispatchViaDistributor: UseMutationResult<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        Error,
        {
            id: number;
            distributorId: number;
        },
        unknown
    >;
}) => {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "selectDistributor";
    const [isLoading, setIsLoading] = useState(false);
    const [distributor, setDistributor] = useState<number>();
    const [distributors, setDistributors] = useState<staffType[]>([]);

    const fetchDistributor = useCallback(async () => {
        if (!data?.cityId) return;
        setIsLoading(true);
        const dis = await getDistributorByCity(data?.cityId);
        setIsLoading(false);
        if (!dis?.data) return;
        setDistributors(dis?.data);
    }, [data?.cityId]);

    useEffect(() => {
        fetchDistributor();
    }, [data?.cityId, fetchDistributor]);

    const sendViaDistributorHandler = async () => {
        if (!distributor || !data?.cityId || !data?.order) return;
        await dispatchViaDistributor.mutateAsync({
            id: data?.order?.id,
            distributorId: distributor,
        });
        onClose();
    };

    const sendDirectHandler = async () => {
        if (!data?.order || data?.order.status !== "PROCESSED") return;
        const confirmed = confirm(
            "Are you sure you want to dispatch this order?",
        );
        if (confirmed) {
            await dispatchDirectly.mutateAsync({ id: data?.order?.id });
            onClose();
        }
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Select Distributor"
            description={"Select Distributor for orders to deliver"}
        >
            <div className="space-y-2">
                {distributors?.length === 0 ? (
                    <div>
                        <span>No Distributor Found</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Select
                            value={distributor?.toString()}
                            onValueChange={(e) => setDistributor(parseInt(e))}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={"Select Distributor"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Distributors</SelectLabel>
                                    {distributors?.map((dist) => (
                                        <SelectItem
                                            key={dist?.id}
                                            value={dist?.id?.toString()}
                                        >
                                            {dist?.name}-{dist.phone}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            disabled={
                                isLoading ||
                                !distributor ||
                                !data?.cityId ||
                                !data?.order
                            }
                            onClick={() => sendViaDistributorHandler()}
                        >
                            Send Via Distributor
                        </Button>
                    </div>
                )}
                <p>OR</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendDirectHandler()}
                    disabled={data?.order?.status !== "PROCESSED" || isLoading}
                >
                    <Truck className="w-4 h-4 mr-2" />
                    Send direct
                </Button>
            </div>
        </Modal>
    );
};
