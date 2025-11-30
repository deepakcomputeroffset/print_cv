"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";

const faqs = [
    {
        question: "What printing services do you offer?",
        answer: "We offer a comprehensive range of printing services including business cards, brochures, flyers, posters, banners, custom stationery, packaging materials, large format printing, promotional items, and more. Our services cater to businesses of all sizes and individual needs.",
    },
    {
        question: "How long will my order take to complete?",
        answer: "Turnaround times vary depending on the complexity and size of your order. Standard jobs typically take 3-5 business days from approval of your design to shipping. Rush services are available for an additional fee, with some projects eligible for same-day or next-day production.",
    },
    {
        question: "What file formats do you accept for printing?",
        answer: "We accept a variety of file formats including PDF, AI, PSD, JPG, PNG, and TIFF. For best results, we recommend high-resolution PDFs with fonts embedded and all images converted to CMYK color mode. Our design team can also help convert your files if needed.",
    },
    {
        question: "Do you offer design services?",
        answer: "Yes! Our in-house design team can help create or refine your artwork to ensure it looks perfect when printed. We offer everything from minor adjustments to complete design services. Just let us know what you need when placing your order.",
    },
    {
        question: "What is your minimum order quantity?",
        answer: "Minimum order quantities vary by product. Business cards typically start at 1000 pieces, while flyers and brochures may start at 1000-2000 pieces. For specialty items, minimums may be higher. We also offer small batch printing for certain products to accommodate smaller needs.",
    },
    {
        question: "Do you offer samples before placing a bulk order?",
        answer: "Yes, we offer sample packs of our paper stocks and finish options, as well as the option to order a physical proof of your specific project before committing to a larger quantity. There may be a small fee for custom proofs, which is credited toward your final order.",
    },
];

export default function FaqSection() {
    return (
        <section className={cn("pt-16 bg-white", sourceSerif4.className)}>
            <div className="container px-4 mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Find answers to our most commonly asked questions. If
                        you can&apos;t find what you&apos;re looking for, please
                        reach out to our support team.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-4"
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <AccordionItem
                                    value={`item-${index}`}
                                    className="border border-primary/10 rounded-lg px-6 shadow-sm"
                                >
                                    <AccordionTrigger className="text-left font-medium py-4 hover:text-primary transition-colors [&[data-state=open]>svg]:text-primary">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>

                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className="mb-6 text-muted-foreground">
                            Still have questions? Our team is here to help.
                        </p>
                        <Link href="/contact">
                            <Button className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 shadow-md">
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Contact Support
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
