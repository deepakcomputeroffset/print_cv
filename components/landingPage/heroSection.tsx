"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section
            className={cn(
                "py-16 md:py-24 overflow-hidden",
                sourceSerif4.className,
            )}
        >
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="flex flex-col space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Bringing Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                                Ideas to Life
                            </span>{" "}
                            Through Print
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            We transform your concepts into tangible,
                            high-quality printed materials that make an impact.
                            From business essentials to creative projects, our
                            cutting-edge technology delivers exceptional
                            results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/categories">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 transition-all shadow-md group"
                                >
                                    Browse Services
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-primary/20 hover:bg-primary/5 group"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative order-first lg:order-last"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/printing-process.jpg"
                                alt="Modern printing process"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                        </div>

                        {/* Floating accent elements */}
                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/30 to-primary/30 blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-primary/20 blur-3xl" />
                    </motion.div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 pt-10 border-t border-gray-200">
                    <h3 className="text-center text-lg font-medium text-gray-700 mb-8">
                        Trusted by businesses of all sizes
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                        {[
                            "Nike",
                            "Google",
                            "Microsoft",
                            "Airbnb",
                            "Shopify",
                        ].map((brand, i) => (
                            <div
                                key={i}
                                className="text-2xl font-bold tracking-tight"
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
