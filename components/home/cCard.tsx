"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { productCategoryType } from "@/types/types";

export const ProductCategoryCard = ({
    category,
    index,
    onClick,
}: {
    category: productCategoryType;
    index: number;
    onClick: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: Math.min(0.1, index * 0.03),
            }}
            viewport={{ once: true, margin: "100px" }}
            className="h-full"
        >
            <Card
                className={cn(
                    "bg-white transition-all duration-300 overflow-hidden relative h-full border-0 rounded-2xl shadow-md hover:shadow-xl",
                    category.isAvailable
                        ? "cursor-pointer group hover:-translate-y-2"
                        : "cursor-not-allowed opacity-80",
                )}
                onClick={category.isAvailable ? onClick : undefined}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative h-40  w-full overflow-hidden">
                    {/* Premium gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-black/10 z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

                    {/* Subtle texture overlay */}
                    <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay z-10"></div>

                    <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                        style={{
                            backgroundImage: `url(${category.imageUrl || "/placeholder-image.jpg"})`,
                            transformOrigin: "center",
                        }}
                    />

                    {/* Category name overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-4 md:px-6 py-2 z-20">
                        <h3 className="text-base font-bold text-white drop-shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-1">
                            {category.name}
                        </h3>

                        {category.isAvailable && (
                            <div className="flex items-center text-white/90 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                {category._count.subCategories > 0
                                    ? `Explore ${category._count.subCategories} subcategories`
                                    : "View available products"}
                                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 opacity-70" />
                            </div>
                        )}
                    </div>

                    {/* Interactive accent elements */}
                    {category.isAvailable && (
                        <>
                            <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-all duration-300 z-10 rounded-2xl"></div>
                        </>
                    )}
                </div>

                <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="h-1 w-5 sm:w-8 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                            <div className="text-xs text-gray-500 font-medium">
                                {category.isAvailable
                                    ? "Click to explore this category"
                                    : "This category will be available soon"}
                            </div>
                        </div>

                        {category.isAvailable && (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            </div>
                        )}
                    </div>
                </div>

                {!category.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 shadow-lg">
                            <span className="text-white font-semibold tracking-wide">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};
