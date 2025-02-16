"use client";

// import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import Link from "next/link";

export default function ProductLists({
    products,
}: {
    products: ProductTypeOnlyWithPrice[];
}) {
    // const [searchTerm, setSearchTerm] = useState("");
    // const [categoryFilter, setCategoryFilter] = useState("ALL");
    // const [priceSort, setPriceSort] = useState("NO");

    // let filteredProducts = products.filter(
    //     (product) =>
    //         product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //         (categoryFilter === "ALL" ||
    //             product.category_id === Number(categoryFilter)),
    // );

    // if (priceSort !== "NO") {
    //     filteredProducts = [...filteredProducts].sort((a, b) =>
    //         priceSort === "asc" ? a.price - b.price : b.price - a.price,
    //     );
    // }

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                {/* <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            {categories?.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={priceSort} onValueChange={setPriceSort}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by m.price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NO">No sorting</SelectItem>
                            <SelectItem value="asc">
                                Price: Low to High
                            </SelectItem>
                            <SelectItem value="desc">
                                Price: High to Low
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                        <div
                            className="h-48 w-full bg-cover bg-center rounded-t-lg"
                            style={{
                                backgroundImage: `url(${product.image_url[0]})`,
                            }}
                        />
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {product.category_id}
                            </p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">
                                {product.description}
                            </p>
                            <p className="text-xl font-bold mt-2">
                                ${product.price.toFixed(2)}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link
                                href={`/customer/products/${product?.id}`}
                                className="w-full"
                            >
                                <Button className="w-full">Buy</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
