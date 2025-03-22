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
            className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-lg transition-all"
        >
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-primary to-cyan-600 text-transparent bg-clip-text">
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
            <p className="text-muted-foreground text-center">{text}</p>
        </motion.div>
    );
};

export default function StatsSection() {
    const stats = [
        {
            icon: <Printer className="w-8 h-8" />,
            value: 1.5,
            suffix: "M+",
            text: "Prints Delivered",
            decimals: 1,
            delay: 0.1,
        },
        {
            icon: <Users className="w-8 h-8" />,
            value: 15000,
            suffix: "+",
            text: "Happy Customers",
            delay: 0.2,
        },
        {
            icon: <Clock className="w-8 h-8" />,
            value: 99.8,
            suffix: "%",
            text: "On-time Delivery",
            decimals: 1,
            delay: 0.3,
        },
        {
            icon: <Award className="w-8 h-8" />,
            value: 10,
            suffix: "+",
            text: "Years of Excellence",
            delay: 0.4,
        },
    ];

    return (
        <section
            className={cn(
                "py-20 bg-gradient-to-b from-blue-50/30 to-background",
                sourceSerif4.className,
            )}
        >
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Impact By The Numbers
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We take pride in our track record of delivering
                        high-quality printing solutions and creating meaningful
                        impact for our customers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
