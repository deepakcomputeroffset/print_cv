"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { defaultStaffPerPage } from "@/lib/constants";
import { QueryParams } from "@/types/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useStaff } from "@/hooks/use-staff";
import { StaffListTable } from "@/components/admin/staff/staff-list-table";
import { StaffAddModal } from "@/components/admin/staff/modal/staff-add-modal";
import { StaffEditModal } from "@/components/admin/staff/modal/staff-edit-modal";
import { StaffDeleteModal } from "@/components/admin/staff/modal/staff-delete-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { StaffFilter } from "@/components/admin/staff/staff-filter";
import { Plus } from "lucide-react";

export default function StaffsPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);

    const { staffs, totalPages, isLoading, error, toggleBanStatus } = useStaff({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "asc",
        perpage: filters?.perpage || defaultStaffPerPage,
    });

    const { onOpen } = useModal();

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading staffs:
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
                    <h1 className="text-2xl font-semibold">Staffs</h1>
                </div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => onOpen("addStaff", {})}
                >
                    <Plus />
                </Button>
            </div>

            <Card className="p-4">
                {/* Filter */}
                <StaffFilter filters={filters} />
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <StaffListTable
                            staffs={staffs}
                            isLoading={isLoading}
                            toggleBanStatus={toggleBanStatus}
                        />
                    </div>

                    {/* Pagination */}
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </CardContent>
            </Card>

            {/* Modal */}
            <StaffAddModal />
            {/* <CustomerViewModal /> */}
            <StaffEditModal />
            <StaffDeleteModal />
        </div>
    );
}
