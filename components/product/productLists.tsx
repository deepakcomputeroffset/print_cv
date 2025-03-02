"use client";

import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductLists({
    products,
}: {
    products: ProductTypeOnlyWithPrice[];
}) {
    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-8 px-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <h1 className="text-4xl font-playfair font-semibold text-[#660A27]">
                    Products
                </h1>
            </div>
            <Link
                href="/customer/categories"
                className="flex items-center text-base text-dominant-color hover:underline mb-3"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Services
            </Link>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                        <div
                            className="h-48 w-full bg-cover bg-center rounded-t-lg"
                            style={{
                                backgroundImage: `url(${product.imageUrl[0]})`,
                            }}
                        />
                        <CardHeader>
                            <CardTitle className="text-[#660A27]">
                                {product.name}
                            </CardTitle>
                        </CardHeader>

                        <CardFooter>
                            <Link
                                href={`/customer/products/${product?.id}`}
                                className="w-full"
                            >
                                <Button variant={"redish"}>Buy</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
