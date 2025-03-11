"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { orderType } from "@/types/types";
import { IndianRupee } from "lucide-react";
import { format } from "date-fns";

export const columns: ColumnDef<orderType>[] = [
    {
        id: "select",
        header: ({ table }) => {
            // Get selectable rows (those with files and no job)
            const selectableRows = table.getRowModel().rows.filter((row) => {
                const hasFileUrls = row.original.attachment?.urls?.length > 0;
                const hasJobId = row.original.job?.id;
                return hasFileUrls && !hasJobId;
            });

            // Check if all selectable rows are selected
            const allSelected = selectableRows.every((row) =>
                row.getIsSelected(),
            );
            const someSelected = selectableRows.some((row) =>
                row.getIsSelected(),
            );

            return (
                <Checkbox
                    checked={allSelected || (someSelected && "indeterminate")}
                    onCheckedChange={(value) => {
                        selectableRows.forEach((row) =>
                            row.toggleSelected(!!value),
                        );
                    }}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            );
        },
        cell: ({ row }) => {
            const hasFileUrls = row.original.attachment?.urls?.length > 0;
            const hasJobId = row.original.job?.id; // Assuming job has an `id` field

            return (
                <Checkbox
                    checked={
                        hasFileUrls && !hasJobId ? row.getIsSelected() : false
                    }
                    onCheckedChange={(value) => {
                        if (hasFileUrls && !hasJobId) {
                            row.toggleSelected(!!value);
                        }
                    }}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                    disabled={!hasFileUrls || !!hasJobId} // Disable checkbox when not selectable
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "customer",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer" />
        ),
        cell: ({ row }) => {
            const customer = row.original.customer;
            return (
                <div className="flex flex-col">
                    <span>{customer?.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {customer?.phone}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {customer?.businessName}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "productItem",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => {
            const productItem = row.original.productItem;
            return (
                <div className="flex flex-col">
                    <span>
                        {productItem?.product?.name} ({productItem?.sku})
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {productItem?.product?.category.name}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "qty",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Qty" />
        ),
        cell: ({ row }) => {
            return <span className="font-medium">{row.getValue("qty")}</span>;
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {row.getValue("amount")}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-xs">
                        {format(row.getValue("createdAt"), "dd/MM/yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(row.getValue("createdAt"), "hh:MMa")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            return <span className="lowercase">{row.getValue("status")}</span>;
        },
    },

    {
        accessorKey: "attachment",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="File" />
        ),
        cell: ({ row }) => {
            const file = row.original.attachment;
            return (
                <div className="flex flex-col justify-center">
                    <span className="text-xs">{file?.uploadVia}</span>
                    {file?.urls?.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Uploaded
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "job",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Job Id" />
        ),
        cell: ({ row }) => {
            const job = row.original.job;
            return <span className="font-medium">{job?.name}</span>;
        },
        enableSorting: true,
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
