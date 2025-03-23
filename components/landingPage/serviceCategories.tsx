"use client";

import React from "react";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";

// Icons for categories
const BriefcaseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const StoreIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
        <path d="M12 3v6"></path>
    </svg>
);

const BookIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const GiftIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <line x1="12" y1="22" x2="12" y2="7"></line>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
);

const MapIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);

const ShirtIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
    </svg>
);

const categories = [
    {
        id: 1,
        name: "Business Essentials",
        description:
            "Professional business cards, letterheads, envelopes, and corporate stationery",
        icon: <BriefcaseIcon />,
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: 2,
        name: "Marketing Materials",
        description:
            "Eye-catching brochures, flyers, postcards, and promotional items",
        icon: <StoreIcon />,
        color: "from-purple-500 to-pink-500",
    },
    {
        id: 3,
        name: "Publications",
        description:
            "High-quality books, magazines, catalogs, and custom publishing solutions",
        icon: <BookIcon />,
        color: "from-amber-500 to-orange-500",
    },
    {
        id: 4,
        name: "Personalized Gifts",
        description:
            "Custom photo gifts, calendars, greeting cards, and personalized merchandise",
        icon: <GiftIcon />,
        color: "from-emerald-500 to-teal-500",
    },
    {
        id: 5,
        name: "Large Format",
        description:
            "Banners, posters, signage, trade show displays, and architectural prints",
        icon: <MapIcon />,
        color: "from-red-500 to-rose-500",
    },
    {
        id: 6,
        name: "Custom Apparel",
        description:
            "Branded t-shirts, hoodies, caps, workwear, and promotional clothing",
        icon: <ShirtIcon />,
        color: "from-indigo-500 to-violet-500",
    },
];

interface CategoryCardProps {
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    index: number;
}

function CategoryCard({
    name,
    description,
    icon,
    color,
    index,
}: CategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(0.1 * index, 0.5) }}
            viewport={{ once: true, margin: "-50px" }}
            className="cursor-pointer"
        >
            <div className="group flex flex-col items-center text-center p-2 sm:p-3 md:p-6 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                <div
                    className={`mb-2 sm:mb-3 md:mb-4 p-2 rounded-full bg-gradient-to-br ${color} text-white transform transition-transform group-hover:scale-110 duration-300`}
                >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <h3 className="text-sm sm:text-base md:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                    {name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xs">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}

export default function ServiceCategories() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50/50">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className={cn(
                        "text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16",
                        sourceSerif4.className,
                    )}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 relative inline-block">
                        Exceptional Print Solutions for{" "}
                        <span className="text-primary relative">
                            Every Vision
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 8"
                                xmlns="http://www.w3.org/2000/svg"
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
                    <p className="text-xs sm:text-sm md:text-lg text-gray-600 mt-3 sm:mt-4 md:mt-6">
                        From business essentials to large format displays, our
                        premium printing services bring your ideas to life with
                        unmatched quality and precision.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            description={category.description}
                            icon={category.icon}
                            color={category.color}
                            index={index}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-8 sm:mt-12 md:mt-16 p-4 sm:p-5 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center"
                >
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                        Can&apos;t find what you need? We offer custom printing
                        solutions tailored to your specific requirements.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
