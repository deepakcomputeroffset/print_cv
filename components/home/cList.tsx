"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { ProductCategoryCard } from "./cCard";
import ProductCategoryHeader from "./cHeader";
import { productCategoryType } from "@/types/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const ProductCategoryList = ({
    categories,
}: {
    categories: productCategoryType[];
}) => {
    const router = useRouter();
    const { setParam } = useUrlFilters();

    const handleCategoryClick = (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            setParam("parentCategoryId", category?.id.toString());
        } else if (category.isList) {
            router.push(`/customer/products/list/${category.id}`);
        } else {
            router.push(`/customer/products?categoryId=${category.id}`);
        }
    };

    return (
        <div className="flex flex-col space-y-12 2xl:space-y-15">
            <ProductCategoryHeader category={categories[0]} />

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {categories.map((category, index) => (
                    <ProductCategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        onClick={() => handleCategoryClick(category)}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
                viewport={{ once: true, margin: "100px" }}
                className="flex justify-center"
            >
                <Link href="/categories">
                    <Button
                        size="lg"
                        className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl group px-8 py-6 h-auto text-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                        <span className="relative z-10 flex items-center">
                            Explore All Categories
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all duration-300" />
                        </span>
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
};
