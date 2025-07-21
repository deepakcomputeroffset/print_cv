"use client";

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
import { product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { PCard } from "./card";

export default function PList({
    products,
    category,
}: {
    products: Pick<
        product,
        "name" | "description" | "id" | "imageUrl" | "isAvailable"
    >[];
    category: {
        name: string;
        parentCategory: {
            name: string;
        } | null;
    } | null;
}) {
    const router = useRouter();
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

                <div className="hidden md:block text-center max-w-3xl mx-auto">
                    {/* Decorative accent */}
                    {/* <div className="flex justify-center mb-6">
                        <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full opacity-80"></div>
                    </div> */}

                    <div className="inline-flex items-center justify-center mb-5">
                        <div className="h-px w-10 bg-primary/30"></div>
                        <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                            Explore Products
                        </span>
                        <div className="h-px w-10 bg-primary/30"></div>
                    </div>

                    <h1
                        className={cn(
                            "text-3xl md:text-4xl font-bold mb-6 leading-tight",
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

                    {/* <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Discover our premium selection of{" "}
                        {category?.name.toLowerCase()} products designed to meet
                        your professional printing needs with exceptional
                        quality.
                    </p> */}
                </div>
            </motion.div>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
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
                        <PCard
                            product={product}
                            onClickHandler={() =>
                                router.push(`/products/${product.id}`)
                            }
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
