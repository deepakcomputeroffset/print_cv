"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function ProductLists({
    products,
    category,
}: {
    products: ProductTypeOnlyWithPrice[];
    category: {
        name: string;
        parentCategory: {
            name: string;
        } | null;
    } | null;
}) {
    return (
        <div className="mx-auto py-4 px-[5vw]">
            <div className="flex flex-col items-start gap-2 mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/categories"
                                className="cursor-pointer"
                            >
                                All
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{category?.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-2xl font-playfair font-semibold text-[#660A27]">
                    Products
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 min-h-96">
                {products?.map((product) => (
                    <Link
                        href={`/customer/products/${product?.id}`}
                        className="w-full"
                        key={product.id}
                    >
                        <Card key={product.id} className="flex flex-col">
                            <div
                                className="h-28 w-full bg-cover bg-center rounded-t-lg"
                                style={{
                                    backgroundImage: `url(${product.imageUrl[0]})`,
                                }}
                            />
                            <CardHeader className="py-2">
                                <div className="flex items-center justify-center text-[#660A27] font-semibold">
                                    <CardTitle>{product.name}</CardTitle>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
