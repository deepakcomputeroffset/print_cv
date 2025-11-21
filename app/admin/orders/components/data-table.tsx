"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { OrdersFilter } from "@/app/admin/orders/components/filter";
import { orderType, QueryParams, ServerResponseType } from "@/types/types";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { AddToJobModal } from "../modal/addToJobModal";
import { Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    totalPage: number;
    filters: QueryParams;
    addJobToOrders: UseMutationResult<
        AxiosResponse<ServerResponseType<null>>,
        Error,
        {
            id: number;
            data: number[];
        },
        unknown
    >;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    totalPage,
    filters,
    addJobToOrders,
}: DataTableProps<TData, TValue>) {
    const { onOpen } = useModal();
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getRowId: (row) => String((row as orderType).id),
        manualPagination: true,
    });

    const selectedRows = table
        ?.getFilteredSelectedRowModel()
        ?.rows?.map((row) => row?.original) as orderType[];

    return (
        <div className="space-y-4">
            <OrdersFilter filters={filters} table={table} />

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="animate-spin w-4 h-4" />
                </div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup?.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header?.id}
                                                    colSpan={header.colSpan}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row?.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell?.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {selectedRows?.length > 0 && (
                            <div className="flex justify-end p-2">
                                <Button
                                    variant={"outline"}
                                    size={"sm"}
                                    onClick={() =>
                                        onOpen("selectJob", {
                                            orders: selectedRows,
                                        })
                                    }
                                >
                                    Add To Job
                                </Button>
                            </div>
                        )}
                    </div>
                    <AddToJobModal addJobToOrders={addJobToOrders} />
                    <DataTablePagination
                        table={table}
                        isLoading={isLoading}
                        totalPage={totalPage}
                    />
                </>
            )}
        </div>
    );
}
