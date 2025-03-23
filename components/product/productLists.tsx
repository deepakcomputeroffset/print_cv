"use client";

import { Card } from "@/components/ui/card";
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
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { ChevronRight } from "lucide-react";

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
        <div className="py-4 px-4 md:px-8 lg:container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/"
                                className="cursor-pointer text-gray-600 hover:text-primary"
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/categories"
                                className="cursor-pointer text-gray-600 hover:text-primary"
                            >
                                Categories
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-primary font-medium">
                                {category?.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="text-center max-w-3xl mx-auto">
                    {/* Decorative accent */}
                    <div className="flex justify-center mb-6">
                        <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full opacity-80"></div>
                    </div>

                    <div className="inline-flex items-center justify-center mb-5">
                        <div className="h-px w-10 bg-primary/30"></div>
                        <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                            Explore Products
                        </span>
                        <div className="h-px w-10 bg-primary/30"></div>
                    </div>

                    <h1
                        className={cn(
                            "text-3xl md:text-5xl font-bold mb-6 leading-tight",
                            sourceSerif4.className,
                        )}
                    >
                        <span>
                            {category?.name}{" "}
                            <span className="text-primary relative inline-block">
                                Collection
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                            </span>
                        </span>
                    </h1>

                    <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Discover our premium selection of{" "}
                        {category?.name.toLowerCase()} products designed to meet
                        your professional printing needs with exceptional
                        quality.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {products?.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={`/products/${product?.id}`}
                            className="block h-full"
                        >
                            <Card className="overflow-hidden h-full bg-white transition-all duration-300 border-0 rounded-xl shadow-md hover:shadow-xl group hover:-translate-y-2">
                                <div className="relative h-64 w-full overflow-hidden">
                                    {/* Premium gradient overlay for depth */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>

                                    {/* Top accent line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

                                    <div
                                        className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${product.imageUrl[0]})`,
                                            transformOrigin: "center",
                                        }}
                                    />

                                    {/* Interactive accent element */}
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <ChevronRight className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                        <span className="text-sm text-gray-500 font-medium">
                                            Product
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 mb-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {product.description ||
                                            "Premium quality printing product"}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
