"use client";

import { useState } from "react";
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
import { useProductCategory } from "@/hooks/use-product-categories";
import { product_category } from "@prisma/client";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import { ProductCategoryCreateModal } from "@/components/category/modal/create-product-category-modal";
import { ProductCategoryEditModal } from "@/components/category/modal/edit-product-category-modal";

export default function CategoriesPage() {
    const { productCategories, isLoading } = useProductCategory();
    const { onOpen } = useModal();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Button onClick={() => onOpen("createProductCategory", {})}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                (category: product_category, idx: number) => (
                                    <RenderCategoryRow
                                        category={
                                            category as product_category & {
                                                sub_categories: product_category[];
                                            }
                                        }
                                        level={0}
                                        key={idx}
                                    />
                                ),
                            )
                        )}
                    </TableBody>
                </Table>
            </Card>

            <ProductCategoryCreateModal />
        </div>
    );
}

const RenderCategoryRow = ({
    category,
    level = 0,
}: {
    category: product_category & {
        sub_categories: product_category[];
    };
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
    const hasSubcategories = category.sub_categories.length > 0;
    const { onOpen } = useModal();
    return (
        <>
            <ProductCategoryEditModal />
            <TableRow key={`${category.id}-${level}`}>
                <TableCell>
                    <div
                        className="flex items-center"
                        style={{ paddingLeft: `${level * 2}rem` }}
                    >
                        {hasSubcategories && (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-100 rounded-full mr-2"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                        )}
                        {category?.name}
                    </div>
                </TableCell>
                <TableCell>{category?.description}</TableCell>
                <TableCell>
                    <div className="relative h-10 w-10">
                        <Image
                            src={category?.image_url}
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
                                    product_category: category,
                                })
                            }
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                onOpen("createProductCategory", {
                                    product_category: category,
                                })
                            }
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                onOpen("deleteProductCategory", {
                                    product_category: category,
                                });
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            {isExpanded &&
                category.sub_categories.map((subCategory) => (
                    <RenderCategoryRow
                        category={
                            subCategory as product_category & {
                                sub_categories: product_category[];
                            }
                        }
                        level={level + 1}
                        key={subCategory?.id + level + 1}
                    />
                ))}
        </>
    );
};
