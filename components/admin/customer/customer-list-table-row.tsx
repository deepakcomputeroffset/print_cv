import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserX, UserCheck, Eye, Pencil, Trash } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { customerType } from "@/types/types";

export const CustomerTableRow = ({
    customer,
    toggleBanStatus,
}: {
    customer: customerType;
    toggleBanStatus: (id: number) => void;
}) => {
    const { onOpen } = useModal();
    return (
        <TableRow key={customer?.id}>
            <TableCell className="text-center">{customer?.id}</TableCell>
            <TableCell>
                <div>
                    <div className="font-medium">{customer?.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {customer?.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {customer?.phone}
                    </div>
                </div>
            </TableCell>
            <TableCell>{customer?.businessName}</TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(
                        customer?.customerCategory?.name || "ASSOCIATE",
                    )}`}
                >
                    {customer?.customerCategory?.name}
                </span>
            </TableCell>
            <TableCell>
                {!!customer?.address ? (
                    <div>
                        <div className="text-sm">
                            {customer?.address?.city?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {customer.address?.city?.state?.name}
                        </div>
                    </div>
                ) : (
                    <span className="text-muted-foreground">No address</span>
                )}
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                                customer.isBanned
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                >
                    {customer.isBanned ? "Banned" : "Active"}
                </span>
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBanStatus(customer.id)}
                    >
                        {customer.isBanned ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            onOpen("editCustomer", {
                                customer,
                            })
                        }
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            onOpen("viewCustomer", {
                                customer,
                            });
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            onOpen("customerDelete", {
                                customer,
                            });
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export const getCategoryBadgeClass = (category: string) => {
    switch (category) {
        case "PREMIUM":
            return "bg-green-100 text-green-800";
        case "GOLD":
            return "bg-yellow-100 text-blue-800";
        case "ELITE":
            return "bg-green-100 text-gray-800";
        case "ASSOCIATE":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-pink-100 text-gray-800";
    }
};
