"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Printer, Users, Clock, Award } from "lucide-react";

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    prefix?: string;
    text: string;
    decimals?: number;
    delay: number;
}

const StatItem = ({
    icon,
    value,
    suffix,
    prefix,
    text,
    decimals = 0,
    delay,
}: StatItemProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: delay }}
            className="flex flex-col items-center p-3 sm:p-4 md:p-6 rounded-xl bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-lg transition-all"
        >
            <div className="p-2 sm:p-3 md:p-4 rounded-full bg-primary/10 text-primary mb-2 sm:mb-3 md:mb-4">
                {icon}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-primary to-cyan-600 text-transparent bg-clip-text">
                {prefix}
                {inView ? (
                    <CountUp
                        end={value}
                        duration={2}
                        decimals={decimals}
                        decimal="."
                        suffix={suffix}
                    />
                ) : (
                    "0"
                )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                {text}
            </p>
        </motion.div>
    );
};

export default function StatsSection() {
    const stats = [
        {
            icon: <Printer className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            value: 1.5,
            suffix: "M+",
            text: "Prints Delivered",
            decimals: 1,
            delay: 0.1,
        },
        {
            icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            value: 15000,
            suffix: "+",
            text: "Happy Customers",
            delay: 0.2,
        },
        {
            icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            value: 99.8,
            suffix: "%",
            text: "On-time Delivery",
            decimals: 1,
            delay: 0.3,
        },
        {
            icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            value: 10,
            suffix: "+",
            text: "Years of Excellence",
            delay: 0.4,
        },
    ];

    return (
        <section
            className={cn(
                "py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50/30 to-background",
                sourceSerif4.className,
            )}
        >
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-10 md:mb-14"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        Our Impact By The Numbers
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                        We take pride in our track record of delivering
                        high-quality printing solutions and creating meaningful
                        impact for our customers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
