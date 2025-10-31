"use client";
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
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { LoadingRow } from "@/components/loaders/loading-row";
import { MessageRow } from "@/components/message-row";
import Pagination from "@/components/pagination";
import { QueryParams } from "@/types/types";
import { useModal } from "@/hooks/use-modal";
import { ProductDeleteModal } from "../product/modal/product-delete-modal";
import Link from "next/link";
import { useDesignItems } from "@/hooks/use-design-items";

export const DesignLists = ({ filters }: { filters: QueryParams }) => {
    const { designs, totalPages, isLoading } = useDesignItems({ ...filters });
    const { onOpen } = useModal();

    return (
        <Card className="p-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Download Link</TableHead>

                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <LoadingRow colSpan={7} text="Loading products..." />
                    ) : designs?.length === 0 ? (
                        <MessageRow colSpan={8} text="No Products found" />
                    ) : (
                        designs?.map((design) => (
                            <TableRow key={design?.id}>
                                <TableCell>{design?.id}</TableCell>
                                <TableCell className="font-medium text-nowrap">
                                    {design?.name}
                                </TableCell>
                                <TableCell>
                                    <div className="relative h-10 w-10">
                                        <Image
                                            src={design?.img}
                                            alt={design?.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground text-nowrap">
                                            {design?.designCategory?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                {/* <TableCell className="text-nowrap">
                                    ₹{design?.price}
                                </TableCell> */}
                                <TableCell>
                                    <Link
                                        href={design.downloadUrl}
                                        target="_blank"
                                    >
                                        Link
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end space-x-2">
                                        {/* <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button> */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                onOpen("editDesign", {
                                                    design,
                                                })
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                onOpen("deleteDesign", {
                                                    design,
                                                })
                                            }
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

            <Pagination totalPage={totalPages} isLoading={isLoading} />
            <ProductDeleteModal />
        </Card>
    );
};
