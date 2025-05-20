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
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/hooks/use-product";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import Pagination from "@/components/pagination";
import { QueryParams } from "@/types/types";
import { useModal } from "@/hooks/use-modal";
import { ProductDeleteModal } from "./modal/product-delete-modal";
import Link from "next/link";

export const ProductLists = ({ filters }: { filters: QueryParams }) => {
    const { products, totalPages, isLoading, toggleProductAvailability } =
        useProducts({ ...filters });
    const { onOpen } = useModal();

    return (
        <Card className="p-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-nowrap">
                            Price Range
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <LoadingRow colSpan={7} text="Loading products..." />
                    ) : products?.length === 0 ? (
                        <MessageRow colSpan={8} text="No Products found" />
                    ) : (
                        products?.map((product) => (
                            <TableRow key={product?.id}>
                                <TableCell>{product?.id}</TableCell>
                                <TableCell>{product?.sku}</TableCell>
                                <TableCell>
                                    <div className="relative h-10 w-10">
                                        <Image
                                            src={product?.imageUrl[0]}
                                            alt={product?.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-nowrap">
                                    {product?.name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground text-nowrap">
                                            {product?.category?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-nowrap">
                                    ₹{product?.price}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product?.isAvailable
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {product?.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                toggleProductAvailability.mutate(
                                                    product?.id,
                                                )
                                            }
                                        >
                                            {product?.isAvailable ? (
                                                <X className="h-4 w-4 text-red-600" />
                                            ) : (
                                                <Check className="h-4 w-4 text-green-600" />
                                            )}
                                        </Button>
                                        {/* <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button> */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/products/${product?.id}/edit`}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                onOpen("deleteProduct", {
                                                    product,
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
