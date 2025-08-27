"use client";

import { Row } from "@tanstack/react-table";
import { FileText, MoreHorizontal } from "lucide-react";
import { orderType } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { STATUS } from "@prisma/client";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const order = row.original as orderType;
    const { onOpen } = useModal();
    const [open, setOpen] = useState(false);
    const openChange = () => setOpen(!open);
    return (
        <DropdownMenu open={open} onOpenChange={openChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    onClick={() => openChange()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[160px] space-y-2 py-2"
            >
                <Button variant={"info"} size={"sm"} className="w-full">
                    <Link href={`/admin/orders/${order.id}`} className="flex">
                        <FileText className="w-4 h-4 mr-2" />
                        View Order
                    </Link>
                </Button>
                {order?.status === STATUS.FILE_UPLOADED && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                            onOpen("improperOrder", { orderId: order.id });
                            openChange();
                        }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Mark Improper
                    </Button>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
