"use client";

import React, { useState } from "react";
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
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal";
import { useProductCategory } from "@/hooks/useProductCategory";
import { productCategory } from "@prisma/client";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import { ProductCategoryCreateModal } from "@/components/admin/category/modal/product-category-create-modal";
import { ProductCategoryEditModal } from "@/components/admin/category/modal/product-category-edit-modal";
import { ProductCategoryDeleteModal } from "@/components/admin/category/modal/produt-category-delete-modal";
import { productCategoryWithSubCategory, QueryParams } from "@/types/types";
import { ProductCategoryFilter } from "@/components/admin/category/product-category-filter";
import Pagination from "@/components/pagination";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { productCategories, isLoading, totalPages } =
        useProductCategory(filters);
    const { onOpen } = useModal();

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">Categories</h1>
                </div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className="flex items-center justify-center"
                    onClick={() => onOpen("createProductCategory", {})}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Card className="p-4">
                <ProductCategoryFilter filters={filters} />
            </Card>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <LoadingRow text="Loading category..." />
                        ) : productCategories.length === 0 ? (
                            <MessageRow text="No category found" />
                        ) : (
                            productCategories?.map(
                                (
                                    category: productCategoryWithSubCategory,
                                    idx: number,
                                ) => (
                                    <RenderCategoryRow
                                        category={category}
                                        level={0}
                                        key={idx}
                                    />
                                ),
                            )
                        )}
                    </TableBody>
                </Table>

                <Pagination isLoading={isLoading} totalPage={totalPages} />
            </Card>

            <ProductCategoryCreateModal />
            <ProductCategoryEditModal />
            <ProductCategoryDeleteModal />
        </div>
    );
}

const RenderCategoryRow = ({
    category,
    level = 0,
}: {
    category: productCategoryWithSubCategory;
    level?: number;
}) => {
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const toggleExpand = (categoryId: number) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const isExpanded = expandedCategories.includes(category.id);
    const hasSubcategories = category?.subCategories?.length > 0;
    const { onOpen } = useModal();
    return (
        <>
            <TableRow key={`${category.id}-${level}`}>
                <TableCell>
                    <div style={{ paddingLeft: `${level * 2}rem` }}>
                        {hasSubcategories && (
                            <button
                                onClick={() => toggleExpand(category?.id)}
                                className="p-1 hover:bg-gray-100 rounded-full mr-2"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                        )}
                        {category?.id}
                    </div>
                </TableCell>
                <TableCell>{category?.name}</TableCell>
                <TableCell className="text-clip">
                    {category?.description?.substring(0, 30)}...
                </TableCell>
                <TableCell>
                    <div className="relative h-10 w-10">
                        <Image
                            src={category?.imageUrl}
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
                                onOpen("editProductCategory", {
                                    productCategory: category,
                                })
                            }
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={level >= 2}
                            onClick={() =>
                                onOpen("createProductCategory", {
                                    productCategory: category,
                                })
                            }
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={hasSubcategories}
                            onClick={() => {
                                onOpen("deleteProductCategory", {
                                    productCategory: category,
                                });
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {isExpanded &&
                category.subCategories.map((subCategory) => (
                    <RenderCategoryRow
                        category={
                            subCategory as productCategory & {
                                subCategories: productCategory[];
                            }
                        }
                        level={level + 1}
                        key={subCategory?.id + level + 1}
                    />
                ))}
        </>
    );
};
