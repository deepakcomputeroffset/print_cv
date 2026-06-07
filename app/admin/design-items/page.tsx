"use client";
import { Plus } from "lucide-react";

import { QueryParams } from "@/types/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { DesignFilter } from "@/components/admin/design/design-filter";
import { DesignLists } from "@/components/admin/design/design-lists";
import { DesignDeleteModal } from "@/components/admin/design/modal/design-delete-modal";
import { DesignCreateModal } from "@/components/admin/design/modal/design-create-modal";
import { useModal } from "@/hooks/use-modal";
import { DesignEditModal } from "@/components/admin/design/modal/design-edit-modal";

export default function Designspage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { onOpen } = useModal();
    return (
        <div className="space-y-6 h-full">
            <div className="gmail-page-header">
                <h1 className="gmail-page-title">Designs</h1>
                <Button
                    onClick={() => onOpen("createDesign", {})}
                    className="flex items-center px-2 border py-2 rounded-md"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <DesignFilter filters={filters} />

            <DesignLists filters={filters} />

            <DesignDeleteModal />
            <DesignCreateModal />
            <DesignEditModal />
        </div>
    );
}
