"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { COMPANY_DATA } from "@/lib/constants";

// Fake testimonial data
const testimonials = [
    {
        id: 1,
        name: "Sarah Thompson",
        role: "Marketing Director, TechCorp",
        image: "https://i.pravatar.cc/150?img=32",
        content:
            "Working with Aditya Printify transformed our marketing materials. The quality and attention to detail exceeded our expectations. Our brochures and business cards now truly represent our brand.",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Event Manager, EventHorizon",
        image: "https://i.pravatar.cc/150?img=53",
        content:
            "The team at Aditya Printify delivered our event banners and promotional materials on an extremely tight deadline. The quality was outstanding, and their customer service was impeccable!",
    },
    {
        id: 3,
        name: "Jessica Williams",
        role: "Owner, Artisan Designs",
        image: "https://i.pravatar.cc/150?img=5",
        content:
            "As a small business owner, finding a reliable printing partner was crucial. Aditya Printify's consistent quality and reasonable pricing have made them an invaluable partner for my design studio.",
    },
    {
        id: 4,
        name: "Robert Garcia",
        role: "CEO, BuildRight Construction",
        image: "https://i.pravatar.cc/150?img=11",
        content:
            "From business cards to large-format blueprints, Aditya Printify has become our one-stop shop for all printing needs. Their attention to detail and color accuracy is remarkable.",
    },
];

const TestimonialCard = ({
    testimonial,
    index,
}: {
    testimonial: (typeof testimonials)[0];
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true, margin: "-100px" }}
        >
            <Card className="h-full border-primary/5 bg-gradient-to-b from-white to-blue-50/10 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                    <div className="text-primary/40 mb-2">
                        <Quote size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground flex-grow mb-3">
                        {testimonial.content}
                    </p>
                    <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-primary/10">
                            <AvatarImage
                                src={testimonial.image}
                                alt={testimonial.name}
                            />
                            <AvatarFallback className="text-xs">
                                {testimonial.name.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-2 sm:ml-3">
                            <h4 className="font-medium text-xs sm:text-sm text-foreground">
                                {testimonial.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {testimonial.role}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function TestimonialsSection() {
    return (
        <section
            className={cn(
                "pt-12 bg-gradient-to-b from-background to-blue-50/30",
                sourceSerif4.className,
            )}
        >
            <div className="container px-4 mx-auto">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-center mb-5">
                        <div className="h-px w-10 bg-primary/30"></div>
                        <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                            Our Testimonial
                        </span>
                        <div className="h-px w-10 bg-primary/30"></div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                        Don&apos;t just take our word for it — hear from some of
                        our satisfied customers about their experiences working
                        with {COMPANY_DATA.shortName}.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            index={index}
                        />
                    ))}
                </div>

                {/* Social proof */}
                <motion.div
                    className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3 md:mb-4">
                        TRUSTED BY OVER 15,000 CUSTOMERS
                    </p>
                    <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-4 md:gap-6">
                        <div className="flex items-center">
                            <div className="flex -space-x-1 sm:-space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 overflow-hidden rounded-full border-2 border-white"
                                    >
                                        <Image
                                            src={`https://i.pravatar.cc/150?img=${i + 20}`}
                                            alt={`Customer ${i}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <span className="ml-2 sm:ml-3 md:ml-4 text-xs sm:text-sm text-muted-foreground">
                                +12K more
                            </span>
                        </div>
                        <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ))}
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-foreground">
                                4.9/5 from 3,200+ reviews
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
