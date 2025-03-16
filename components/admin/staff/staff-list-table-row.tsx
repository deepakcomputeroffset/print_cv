import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { UserX, UserCheck, Eye, Pencil, Trash } from "lucide-react";
import { staff } from "@prisma/client";
import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";

export const StaffTableRow = ({
    staff,
    toggleBanStatus,
}: {
    staff: staff;
    toggleBanStatus: (id: number) => void;
}) => {
    const { onOpen } = useModal();
    return (
        <TableRow key={staff?.id}>
            <TableCell className="text-center">{staff?.id}</TableCell>
            <TableCell className="font-medium">{staff?.name}</TableCell>

            <TableCell>{staff?.email}</TableCell>
            <TableCell>{staff?.phone}</TableCell>
            <TableCell>{staff?.role}</TableCell>
            <TableCell>{format(staff?.createdAt, "dd/MM/yyyy")}</TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                                staff.isBanned
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                >
                    {staff.isBanned ? "Banned" : "Active"}
                </span>
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBanStatus(staff.id)}
                    >
                        {staff.isBanned ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            onOpen("staffEdit", {
                                staff,
                            })
                        }
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            onOpen("staffDelete", {
                                staff,
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
