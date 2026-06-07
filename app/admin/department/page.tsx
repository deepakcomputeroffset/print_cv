"use client";

import React from "react";

import Pagination from "@/components/pagination";
import { defaultDepartmentsPerPage } from "@/lib/constants";
import { QueryParams } from "@/types/types";

import { useDepartment } from "@/hooks/use-department";
import { DepartmentListTable } from "@/components/admin/department/department-list-table";
import { DepartmentAddModal } from "@/components/admin/department/modal/department-create-modal";
import { DepartmentEditModal } from "@/components/admin/department/modal/department-edit-modal";
import { DepartmentDeleteModal } from "@/components/admin/department/modal/department-delete-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { DepartmentFilter } from "@/components/admin/department/department-filter";
import { Plus } from "lucide-react";

export default function DepartmentsPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);

    const { data, totalPages, isLoading, error } = useDepartment({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "asc",
        perpage: filters?.perpage || defaultDepartmentsPerPage,
    });

    const { onOpen } = useModal();

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading departments:{" "}
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
                <h1 className="gmail-page-title">Departments</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen("addTaskType", {})}
                >
                    <Plus />
                </Button>
            </div>

            <div className="gmail-filter-bar">
                {/* Filter */}
                <DepartmentFilter filters={filters} />
            </div>

            <div className="gmail-table-container">
                <DepartmentListTable
                    departments={data}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                <div className="p-4">
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </div>
            </div>

            {/* Modal */}
            <DepartmentAddModal />
            <DepartmentEditModal />
            <DepartmentDeleteModal />
        </div>
    );
}
