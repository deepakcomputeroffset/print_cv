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
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/hooks/use-product";
import { LoadingRow } from "@/components/loading-row";
import { MessageRow } from "@/components/message-row";
import Pagination from "@/components/pagination";
import { QueryParams } from "@/types/types";

export const ProductLists = ({ filters }: { filters: QueryParams }) => {
    const { products, totalPages, isLoading } = useProducts({ ...filters });

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
                        <MessageRow text="No Products found" />
                    ) : (
                        products?.map((product) => (
                            <TableRow key={product?.id}>
                                <TableCell>{product?.id}</TableCell>
                                <TableCell>{product?.sku}</TableCell>
                                <TableCell>
                                    <div className="relative h-10 w-10">
                                        <Image
                                            src={product?.image_url[0]}
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
                                    ₹{product?.min_price} - ₹
                                    {product?.max_price}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product?.is_avialable
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {product?.is_avialable
                                            ? "Available"
                                            : "Unavailable"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon">
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
        </Card>
    );
};
