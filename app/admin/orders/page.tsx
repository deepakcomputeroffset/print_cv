"use client";
import React from "react";
import { QueryParams } from "@/types/types";
import { useOrders } from "@/hooks/use-orders";
import { defaultOrderPerPage } from "@/lib/constants";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { ViewFilesModal } from "../../../components/view-files-modal";
import { ImproperOrderModal } from "./modal/ImproperOrderModal";

export default function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { isLoading, orders, totalPages, addJobToOrders } = useOrders({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "desc",
        perpage: filters?.perpage || defaultOrderPerPage,
    });
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Orders Management</h1>
            </div>
            <DataTable
                columns={columns}
                data={orders}
                isLoading={isLoading}
                totalPage={totalPages}
                filters={filters}
                addJobToOrders={addJobToOrders}
            />

            <ViewFilesModal />
            <ImproperOrderModal />
        </div>
    );
}
