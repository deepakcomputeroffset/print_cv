"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { defaultDepartmentsPerPage } from "@/lib/constants";
import { QueryParams } from "@/types/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">Departments</h1>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen("addTaskType", {})}
                >
                    <Plus />
                </Button>
            </div>

            <Card className="p-4">
                {/* Filter */}
                <DepartmentFilter filters={filters} />
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <DepartmentListTable
                            departments={data}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Pagination */}
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </CardContent>
            </Card>

            {/* Modal */}
            <DepartmentAddModal />
            <DepartmentEditModal />
            <DepartmentDeleteModal />
        </div>
    );
}
