import { Table } from "@tanstack/react-table";
import Pagination from "@/components/pagination";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    totalPage: number;
    isLoading: boolean;
}

export function DataTablePagination<TData>({
    table,
    totalPage,
    isLoading,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <Pagination
                    totalPage={totalPage}
                    isLoading={isLoading}
                    className="mt-0"
                />
            </div>
        </div>
    );
}
