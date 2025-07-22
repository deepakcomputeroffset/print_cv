"use client";

import { Row } from "@tanstack/react-table";
import { FileText, MoreHorizontal, UploadCloud } from "lucide-react";
import { orderType } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const order = row.original as orderType;
    const file = order.attachment;
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
            <DropdownMenuContent align="end" className="w-[160px]">
                {file && file?.urls?.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                            onOpen("viewFiles", {
                                files: file.urls,
                            });
                            openChange();
                        }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        View Files
                    </Button>
                )}
                {order?.status === "PENDING" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onOpen("improperOrder", { orderId: order.id });
                            openChange();
                        }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Mark as Improper
                    </Button>
                )}
                {order?.status === "PENDING" &&
                    order?.attachment.uploadVia === "EMAIL" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onOpen("uploadOrderFile", {
                                    orderId: order.id,
                                });
                                openChange();
                            }}
                        >
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Uplad Files
                        </Button>
                    )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
