"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";
import Pagination from "@/components/pagination";
import { CustomerEditModal } from "@/components/admin/customer/modal/customer-edit-modal";
import { CustomerViewModal } from "@/components/admin/customer/modal/customer-view-modal";
import { CustomerDeleteModal } from "@/components/admin/customer/modal/customer-delete-modal";
import { defaultCustomerPerPage } from "@/lib/constants";
import { CustomerFilter } from "@/components/admin/customer/customer-filter";
import { CustomerListTable } from "@/components/admin/customer/customer-list-table";
import { QueryParams } from "@/types/types";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);

    const { customers, totalPages, isLoading, error, toggleBanStatus } =
        useCustomers({
            ...filters,
            sortorder:
                filters?.sortorder !== undefined ? filters?.sortorder : "asc",
            perpage: filters?.perpage || defaultCustomerPerPage,
        });

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading customers:
                    {error instanceof Error
                        ? error.message
                        : "An error occurred"}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-semibold">Customers</h1>
            </div>

            <Card className="p-4">
                {/* Filter */}
                <CustomerFilter filters={filters} />
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <CustomerListTable
                            customers={customers}
                            isLoading={isLoading}
                            toggleBanStatus={toggleBanStatus}
                        />
                    </div>

                    {/* Pagination */}
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </CardContent>
            </Card>

            {/* Modal */}
            <CustomerDeleteModal />
            <CustomerViewModal />
            <CustomerEditModal />
        </div>
    );
}
