"use client";

import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductLists({
    products,
}: {
    products: ProductTypeOnlyWithPrice[];
}) {
    const router = useRouter();
    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-8 px-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <h1 className="text-4xl font-playfair font-semibold text-[#660A27]">
                    Products
                </h1>
            </div>
            <ArrowLeft
                onClick={() => router?.push("/customer/categories")}
                className="cursor-pointer text-[#A6192E] hover:text-[#870F20] transition mb-4"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
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
