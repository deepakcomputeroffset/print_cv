"use client";

import React from "react";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";

const categories = [
    {
        name: "Business Essentials",
        description:
            "Professional business cards, letterheads, envelopes, and corporate stationery",
        icon: "M2 7h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm14 14V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
        color: "from-blue-500 to-cyan-500",
    },
    {
        name: "Marketing Materials",
        description:
            "Eye-catching brochures, flyers, postcards, and promotional items",
        icon: "M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm0 0l2.45-4.9A2 2 0 017.24 3h9.52a2 2 0 011.8 1.1L21 9zM12 3v6",
        color: "from-purple-500 to-pink-500",
    },
    {
        name: "Publications",
        description:
            "High-quality books, magazines, catalogs, and custom publishing solutions",
        icon: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
        color: "from-amber-500 to-orange-500",
    },
    {
        name: "Personalized Gifts",
        description:
            "Custom photo gifts, calendars, greeting cards, and personalized merchandise",
        icon: "M20 12v10H4V12M2 7h20v5M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
        color: "from-emerald-500 to-teal-500",
    },
    {
        name: "Large Format",
        description:
            "Banners, posters, signage, trade show displays, and architectural prints",
        icon: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16",
        color: "from-red-500 to-rose-500",
    },
    {
        name: "Custom Apparel",
        description:
            "Branded t-shirts, hoodies, caps, workwear, and promotional clothing",
        icon: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z",
        color: "from-indigo-500 to-violet-500",
    },
];

export default function ServiceCategories() {
    return (
        <section className="pt-5 bg-gray-50/50">
            <div className="container px-4 mx-auto">
                <div className="flex justify-center mt-2 mb-5">
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full opacity-80"></div>
                </div>

                <div className="flex items-center justify-center mb-5">
                    <div className="h-px w-10 bg-primary/30"></div>
                    <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                        Our Vision
                    </span>
                    <div className="h-px w-10 bg-primary/30"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className={cn(
                        "text-center max-w-3xl mx-auto mb-8 md:mb-16",
                        sourceSerif4.className,
                    )}
                >
                    <h2 className="text-3xl font-bold relative inline-block">
                        Exceptional Print Solutions for{" "}
                        <span className="text-primary relative">
                            Every Vision
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 8"
                            >
                                <path
                                    d="M0,5 Q40,0 80,5 T160,5 T240,5"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    className="text-primary/40"
                                />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-base text-muted-foreground mt-4 md:mt-6">
                        From business essentials to large format displays, our
                        premium printing services bring your ideas to life with
                        unmatched quality and precision.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: Math.min(0.1 * index, 0.5),
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="cursor-pointer"
                        >
                            <div className="group flex flex-col items-center text-center p-3 md:p-6 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                                <div
                                    className={`mb-3 p-2 rounded-full bg-gradient-to-br ${category.color} text-white transform transition-transform group-hover:scale-110 duration-300`}
                                >
                                    <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d={category.icon} />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 max-w-xs">
                                    {category.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-8 md:mt-16 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center"
                >
                    <p className="text-xs text-gray-700 font-medium">
                        Can&apos;t find what you need? We offer custom printing
                        solutions tailored to your specific requirements.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
