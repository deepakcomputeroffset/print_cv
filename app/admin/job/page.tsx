"use client";

import React from "react";

import Pagination from "@/components/pagination";
import { defaultJobsPerPage } from "@/lib/constants";
import { QueryParams } from "@/types/types";

import { useJob } from "@/hooks/use-job";
import { JobListTable } from "@/components/admin/job/job-list-table";
import { JobAddModal } from "@/components/admin/job/modal/job-create-modal";
import { JobEditModal } from "@/components/admin/job/modal/job-edit-modal";
import { JobDeleteModal } from "@/components/admin/job/modal/job-delete-modal";
import { ManagePrefixesModal } from "@/components/admin/job/modal/manage-prefixes-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { JobFilter } from "@/components/admin/job/job-filter";
import { Plus, Tag } from "lucide-react";

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
            <div className="gmail-page-header">
                <h1 className="gmail-page-title">Jobs</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpen("managePrefixes", {})}
                        title="Manage Prefixes"
                    >
                        <Tag className="w-4 h-4 mr-1" />
                        Prefixes
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpen("addJob", {})}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>

            <div className="gmail-filter-bar">
                {/* Filter */}
                <JobFilter filters={filters} />
            </div>

            <div className="gmail-table-container">
                <JobListTable jobs={data} isLoading={isLoading} />

                {/* Pagination */}
                <div className="p-4">
                    <Pagination isLoading={isLoading} totalPage={totalPages} />
                </div>
            </div>

            {/* Modals */}
            <JobAddModal />
            <JobEditModal />
            <JobDeleteModal />
            <ManagePrefixesModal />
        </div>
    );
}
