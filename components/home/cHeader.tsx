"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { productCategory } from "@prisma/client";

export default function ProductCategoryHeader({
    category,
}: {
    category: Omit<productCategory, "createdAt" | "updatedAt"> & {
        parentCategory: productCategory | null;
    };
}) {
    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className={cn(
                "text-center max-w-3xl mx-auto",
                sourceSerif4.className,
            )}
        >
            {/* Decorative accent */}
            <div className="flex justify-center mt-2 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full opacity-80"></div>
            </div>

            <div className="inline-flex items-center justify-center mb-5">
                <div className="h-px w-10 bg-primary/30"></div>
                <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                    {!!category?.parentCategory
                        ? "Sub-categories"
                        : "Explore Categories"}
                </span>
                <div className="h-px w-10 bg-primary/30"></div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {!!category?.parentCategory ? (
                    <span>
                        {category?.parentCategory.name}{" "}
                        <span className="text-primary relative inline-block">
                            Solutions
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                        </span>
                    </span>
                ) : (
                    <span>
                        Premium{" "}
                        <span className="text-primary relative inline-block">
                            Printing Categories
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                        </span>
                    </span>
                )}
            </h2>

            <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                {!!category?.parentCategory
                    ? `Discover our specialized ${category.parentCategory.name.toLowerCase()} solutions tailored to meet your precise printing requirements.`
                    : "Explore our comprehensive range of professional printing services designed for businesses and individuals seeking exceptional quality."}
            </p>

            {category?.parentCategory !== null && (
                <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/categories"
                        className="flex items-center text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">
                            Back to all categories
                        </span>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
