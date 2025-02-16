import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";
import { Modal } from "../../../modal";

export const CustomerViewModal = () => {
    const { data, isOpen, modal, onClose } = useModal();
    const isModelOpen = modal === "viewCustomer" && isOpen;
    return (
        <Modal
            isOpen={isModelOpen}
            onClose={onClose}
            title="Customer Details"
            description={""}
        >
            {data?.customer && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">
                                Personal Information
                            </h3>
                            <div className="mt-2 space-y-2">
                                <p>
                                    <span className="text-muted-foreground">
                                        Name:
                                    </span>
                                    {data?.customer?.name}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Email:
                                    </span>
                                    {data?.customer?.email}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Phone:
                                    </span>
                                    {data?.customer?.phone}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                Business Information
                            </h3>
                            <div className="mt-2 space-y-2">
                                <p>
                                    <span className="text-muted-foreground">
                                        Business Name:
                                    </span>
                                    {data?.customer?.businessName}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Category:
                                    </span>
                                    {data?.customer?.customerCategory}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Status:
                                    </span>
                                    {data?.customer?.isBanned
                                        ? "Banned"
                                        : "Active"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {data?.customer?.address && (
                        <div>
                            <h3 className="font-semibold">
                                Address Information
                            </h3>
                            <div className="mt-2 space-y-2">
                                <p>
                                    <span className="text-muted-foreground">
                                        Street:
                                    </span>
                                    {data?.customer?.address.line}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        PIN Code:
                                    </span>
                                    {data?.customer?.address.pinCode}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        City:
                                    </span>
                                    {data?.customer?.address?.city?.name}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        State:
                                    </span>
                                    {data?.customer?.address?.city?.state?.name}
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold">
                            Additional Information
                        </h3>
                        <div className="mt-2">
                            <p>
                                <span className="text-muted-foreground">
                                    Customer Id:
                                </span>
                                {data?.customer?.id}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Member Since:
                                </span>
                                {format(data?.customer?.createdAt, "PPP")}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};
