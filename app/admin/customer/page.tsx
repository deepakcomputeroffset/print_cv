"use client";

import React from "react";

import { useCustomers } from "@/hooks/use-customers";
import Pagination from "@/components/pagination";
import { CustomerEditModal } from "@/components/admin/customer/modal/customer-edit-modal";
import { CustomerViewModal } from "@/components/admin/customer/modal/customer-view-modal";
import { CustomerDeleteModal } from "@/components/admin/customer/modal/customer-delete-modal";
import { defaultCustomerPerPage } from "@/lib/constants";
import { CustomerFilter } from "@/components/admin/customer/customer-filter";
import { CustomerListTable } from "@/components/admin/customer/customer-list-table";
import { QueryParams } from "@/types/types";


export default function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);

    const {
        customers,
        totalPages,
        isLoading,
        error,
        toggleBanStatus,
        toggleVerifyStatus,
    } = useCustomers({
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
            <div className="gmail-page-header">
                <h1 className="gmail-page-title">Customers</h1>
            </div>

            <div className="gmail-filter-bar">
                {/* Filter */}
                <CustomerFilter filters={filters} />
            </div>

            <div className="gmail-table-container">
                <CustomerListTable
                    customers={customers}
                    isLoading={isLoading}
                    toggleBanStatus={toggleBanStatus}
                    toggleVerifyStatus={toggleVerifyStatus}
                />

                {/* Pagination */}
                <div className="p-4">
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </div>
            </div>

            {/* Modal */}
            <CustomerDeleteModal />
            <CustomerViewModal />
            <CustomerEditModal />
        </div>
    );
}
