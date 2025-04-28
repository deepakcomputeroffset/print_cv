"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";

interface TopProduct {
    id: number;
    name: string;
    sku: string;
    category: string;
    quantity: number;
}

interface TopProductsProps {
    products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">
                            Quantity Sold
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <span>{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {product.sku}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="text-right">
                                {product.quantity}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
