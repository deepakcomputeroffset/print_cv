"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import { DesignCategoryCreateModal } from "@/components/admin/design-category/modal/design-category-create-modal";
import { DesignCategoryEditModal } from "@/components/admin/design-category/modal/design-category-edit-modal";
import { DesignCategoryDeleteModal } from "@/components/admin/design-category/modal/design-category-delete-modal";
import { QueryParams } from "@/types/types";
import { CategoryFilter } from "@/components/admin/category-filter";
import Pagination from "@/components/pagination";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDesignCategory } from "@/hooks/use-design-category";

export default function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { designCategories, isLoading, totalPages } =
        useDesignCategory(filters);
    const { onOpen } = useModal();

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">
                        Design Categories
                    </h1>
                </div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className="flex items-center justify-center"
                    onClick={() => onOpen("addDesignCategory", {})}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Card className="p-4">
                <CategoryFilter filters={filters} />
            </Card>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <LoadingRow text="Loading category..." />
                        ) : designCategories.length === 0 ? (
                            <MessageRow text="No category found" />
                        ) : (
                            designCategories?.map((category) => (
                                <TableRow key={`${category.id}`}>
                                    <TableCell>
                                        <div>{category?.id}</div>
                                    </TableCell>
                                    <TableCell>{category?.name}</TableCell>

                                    <TableCell>
                                        <div className="relative h-10 w-10">
                                            <Image
                                                src={category?.img}
                                                alt={category?.name}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    onOpen(
                                                        "editDesignCategory",
                                                        {
                                                            designCategory:
                                                                category,
                                                        },
                                                    )
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    onOpen(
                                                        "addDesignCategory",
                                                        {},
                                                    )
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    onOpen(
                                                        "deleteDesignCategory",
                                                        {
                                                            designCategory:
                                                                category,
                                                        },
                                                    );
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Pagination isLoading={isLoading} totalPage={totalPages} />
            </Card>

            <DesignCategoryCreateModal />
            <DesignCategoryEditModal />
            <DesignCategoryDeleteModal />
        </div>
    );
}
