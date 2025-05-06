"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCustomerCategory } from "@/hooks/use-customer-category";
import { CustomerCategoryAddModal } from "@/components/admin/customer-category/modal/customer-category-add-modal";
import { CustomerCategoryEditModal } from "@/components/admin/customer-category/modal/customer-category-edit-modal";
import { CustomerCategoryDeleteModal } from "@/components/admin/customer-category/modal/customer-category-delete-modal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Pencil, Plus, Trash } from "lucide-react";

export default function CustomerCategoryPage() {
    const { customersCategory, error, isLoading } = useCustomerCategory();
    const { onOpen } = useModal();

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error loading customers category:
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
                    <h1 className="text-2xl font-semibold">
                        Customer Category
                    </h1>
                </div>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => onOpen("addCustomerCategory", {})}
                >
                    <Plus />
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Id
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-center">
                                        Level
                                    </TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <LoadingRow
                                        text="Loading customers..."
                                        colSpan={5}
                                    />
                                ) : customersCategory.length === 0 ? (
                                    <MessageRow
                                        colSpan={5}
                                        text="No customer Category found"
                                    />
                                ) : (
                                    customersCategory?.map((customerCat) => (
                                        <TableRow key={customerCat.id}>
                                            <TableCell>
                                                {customerCat.id}
                                            </TableCell>
                                            <TableCell>
                                                {customerCat.name}
                                            </TableCell>
                                            <TableCell>
                                                {customerCat.level}
                                            </TableCell>
                                            <TableCell>{`${customerCat.discount}%`}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            onOpen(
                                                                "editCustomerCategory",
                                                                {
                                                                    customerCategory:
                                                                        customerCat,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            onOpen(
                                                                "deleteCustomerCategory",
                                                                {
                                                                    customerCategory:
                                                                        customerCat,
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                </CardContent>
            </Card>

            {/* Modal */}
            <CustomerCategoryAddModal />
            <CustomerCategoryDeleteModal />
            <CustomerCategoryEditModal />
        </div>
    );
}
