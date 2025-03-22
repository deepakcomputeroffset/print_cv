"use client";

import React from "react";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Printer,
    Building2,
    Palette,
    Users,
    LayoutGrid,
    Award,
    ChevronRight,
} from "lucide-react";

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    delay: number;
    color: string;
}

function ServiceCard({
    icon,
    title,
    description,
    href,
    delay,
    color,
}: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.7,
                delay: delay * 0.15,
                ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden border border-gray-100"
        >
            <div
                className={`h-2 w-full ${color} absolute top-0 left-0 right-0`}
            />

            <div className="p-8 relative z-10">
                <div
                    className={`${color.replace("bg-", "text-").replace("/10", "")} mb-6 flex items-center justify-between`}
                >
                    <div className={`${color} p-4 rounded-lg`}>{icon}</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="h-5 w-5" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    {description}
                </p>

                <div className="pt-4 border-t border-gray-100">
                    <Link
                        href={href}
                        className="text-primary font-medium flex items-center group/link"
                    >
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function ServicesSection() {
    const services = [
        {
            icon: <Printer className="h-6 w-6" />,
            title: "Commercial Printing",
            description:
                "High-quality printing services for businesses including brochures, catalogs, flyers, and more.",
            href: "/services/commercial",
            color: "bg-primary/10",
        },
        {
            icon: <Building2 className="h-6 w-6" />,
            title: "Corporate Identity",
            description:
                "Business cards, letterheads, envelopes, and other essentials to establish your brand identity.",
            href: "/services/corporate",
            color: "bg-cyan-500/10",
        },
        {
            icon: <Palette className="h-6 w-6" />,
            title: "Design Services",
            description:
                "Professional graphic design services to create stunning visuals for your print materials.",
            href: "/services/design",
            color: "bg-purple-500/10",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Event Materials",
            description:
                "Banners, posters, tickets, and promotional items for trade shows, conferences, and events.",
            href: "/services/events",
            color: "bg-amber-500/10",
        },
        {
            icon: <LayoutGrid className="h-6 w-6" />,
            title: "Large Format",
            description:
                "Attention-grabbing banners, signs, posters, and display graphics in various sizes.",
            href: "/services/large-format",
            color: "bg-emerald-500/10",
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Premium Finishes",
            description:
                "Elevate your prints with foil stamping, embossing, spot UV, and other premium finishing options.",
            href: "/services/premium-finishes",
            color: "bg-rose-500/10",
        },
    ];

    return (
        <section className="py-28 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 inset-0 pointer-events-none">
                <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-70" />
                <div className="absolute bottom-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl opacity-70" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className={cn(
                        "text-center max-w-3xl mx-auto mb-20",
                        sourceSerif4.className,
                    )}
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-px w-10 bg-primary/30"></div>
                        <span className="mx-3 text-primary font-medium text-sm uppercase tracking-wider">
                            Our Expertise
                        </span>
                        <div className="h-px w-10 bg-primary/30"></div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Premium{" "}
                        <span className="text-primary relative inline-block">
                            Printing Services
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-cyan-500/30"></span>
                        </span>
                    </h2>
                    <p className="text-gray-600 md:text-lg leading-relaxed">
                        From concept to completion, our comprehensive printing
                        solutions deliver exceptional quality and craftsmanship
                        for businesses and individuals alike.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            href={service.href}
                            delay={index}
                            color={service.color}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        delay: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block p-2 bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-xl">
                        <Link href="/services">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white group px-8 py-6 h-auto text-lg"
                            >
                                Explore All Services
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
