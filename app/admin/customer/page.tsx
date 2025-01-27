"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";
import Pagination from "@/components/pagination";
import { CustomerEditModal } from "@/components/customer/modal/customer-edit-modal";
import { CustomerViewModal } from "@/components/customer/modal/customer-view-modal";
import { CustomerDeleteModal } from "@/components/customer/modal/customer-delete-modal";
import { default_customer_per_page } from "@/lib/constants";
import { CustomerFilter } from "@/components/customer/customer-filter";
import { CustomerListTable } from "@/components/customer/customer-list-table";
import { QueryParams } from "@/types/types";

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
            perpage: filters?.perpage || default_customer_per_page,
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
        <div className="p-6 space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Customers</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    {/* Filter */}
                    <CustomerFilter filters={filters} />

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
