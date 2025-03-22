"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sourceSerif4 } from "@/lib/font";
import { ArrowRight } from "lucide-react";

// Define product interface
interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    featured: boolean;
}

// Sample product data
const products: Product[] = [
    {
        id: "1",
        name: "Premium Business Cards",
        description:
            "Make a lasting impression with our high-quality business cards featuring premium paper and finishes.",
        price: "$45.99",
        image: "/images/products/business-cards.jpg",
        category: "Business",
        featured: true,
    },
    {
        id: "2",
        name: "Full-Color Brochures",
        description:
            "Eye-catching tri-fold brochures printed on glossy paper perfect for marketing campaigns.",
        price: "$89.99",
        image: "/images/products/brochures.jpg",
        category: "Marketing",
        featured: true,
    },
    {
        id: "3",
        name: "Custom T-Shirt Printing",
        description:
            "High-quality custom t-shirts perfect for events, teams, or promotional merchandise.",
        price: "$24.99",
        image: "/images/products/tshirts.jpg",
        category: "Apparel",
        featured: true,
    },
    {
        id: "4",
        name: "Large Format Banners",
        description:
            "Attention-grabbing banners for trade shows, events, and storefront advertising.",
        price: "$129.99",
        image: "/images/products/banners.jpg",
        category: "Signage",
        featured: true,
    },
];

function ProductCard({ product }: { product: Product }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20" />
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    {product.category}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                        {product.price}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export default function FeaturedProducts() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className={cn("max-w-2xl", sourceSerif4.className)}>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-4"
                        >
                            Our Most Popular{" "}
                            <span className="text-primary">
                                Printing Products
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-gray-600 max-w-xl"
                        >
                            Discover our best-selling printing solutions that
                            help businesses make a lasting impression. From
                            premium business cards to eye-catching banners,
                            we&apos;ve got you covered.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-6 md:mt-0"
                    >
                        <Link href="/products">
                            <Button className="group">
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-block bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h3 className="text-xl font-semibold mb-2">
                            Need a Custom Quote?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            We offer personalized solutions for all your
                            printing needs
                        </p>
                        <Link href="/quote">
                            <Button variant="outline" className="w-full">
                                Request a Quote
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
