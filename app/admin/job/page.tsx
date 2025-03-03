"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { defaultJobsPerPage } from "@/lib/constants";
import { QueryParams } from "@/types/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useJob } from "@/hooks/use-job";
import { JobListTable } from "@/components/admin/job/job-list-table";
import { JobAddModal } from "@/components/admin/job/modal/job-create-modal";
import { JobEditModal } from "@/components/admin/job/modal/job-edit-modal";
import { JobDeleteModal } from "@/components/admin/job/modal/job-delete-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { JobFilter } from "@/components/admin/job/job-filter";
import { Plus } from "lucide-react";

export default function DepartmentsPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);

    const { data, totalPages, isLoading, error } = useJob({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "asc",
        perpage: filters?.perpage || defaultJobsPerPage,
    });

    const { onOpen } = useModal();

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading jobs:{" "}
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
                    <h1 className="text-2xl font-semibold">Jobs</h1>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen("addJob", {})}
                >
                    <Plus />
                </Button>
            </div>

            <Card className="p-4">
                {/* Filter */}
                <JobFilter filters={filters} />
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <JobListTable jobs={data} isLoading={isLoading} />
                    </div>

                    {/* Pagination */}
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </CardContent>
            </Card>

            {/* Modal */}
            <JobAddModal />
            <JobEditModal />
            <JobDeleteModal />
        </div>
    );
}
