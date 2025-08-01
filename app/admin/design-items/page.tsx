import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { QueryParams } from "@/types/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { DesignFilter } from "@/components/admin/design/design-filter";
import { DesignLists } from "@/components/admin/design/design-lists";
import { DesignDeleteModal } from "@/components/admin/design/modal/design-delete-modal";

export default function Designspage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Designs</h1>
                </div>
                <Button className="flex items-center px-2 border py-2 rounded-md">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <DesignFilter filters={filters} />

            <DesignLists filters={filters} />

            <DesignDeleteModal />
        </div>
    );
}
