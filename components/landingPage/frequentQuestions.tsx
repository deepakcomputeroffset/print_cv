"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

export function FrequntQuestionsSection() {
    const faqs = [
        {
            question: "What types of printing do you offer?",
            answer: "We provide a variety of printing services including digital, offset, and large format printing. Whatever your needs, we’ve got you covered!",
        },
        {
            question: "How fast can I get my prints?",
            answer: "Our turnaround times are lightning fast! Most orders are completed within 24-48 hours. Need it quicker? Just ask!",
        },
        {
            question: "Do you offer design services?",
            answer: "Absolutely! Our talented designers can help bring your ideas to life. Just provide your vision, and we’ll handle the rest!",
        },
        {
            question: "Can I see a proof before printing?",
            answer: "Yes! We provide digital proofs for your approval before we hit the print button. No surprises here!",
        },
        {
            question: "What if I need a custom size?",
            answer: "No problem! We can accommodate custom sizes for all your printing needs. Just let us know your specifications!",
        },
        {
            question: "What materials do you use?",
            answer: "We use high-quality materials to ensure your prints look fantastic. From paper to vinyl, we’ve got the best options!",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={cn("pt-10 pb-10 lg:pb-20", sourceSerif4.className)}>
            <div className="w-full mx-auto px-4 max-w-6xl">
                <div className="mb-10">
                    <h3 className="inline-block px-6 py-3 bg-[#EDA371] rounded-lg rotate-[-4deg] text-2xl font-semibold shadow-[4px_4px_0px_0px_#000]">
                        Frequently Asked Questions
                    </h3>
                </div>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="px-8 md:px-12 py-10 md:py-14  rounded-3xl text-white bg-dominant-color shadow-[6px_8px_0px_0px_#000]"
                        >
                            <button
                                className="flex justify-between items-center gap-3 w-full text-left"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h4 className="text-white font-bold text-xl md:text-[28px] m-0 leading-[42px] tracking-[-0.8px">
                                    {faq.question}
                                </h4>
                                <div
                                    className={cn(
                                        "rounded-full px-3 py-3 bg-white/20 transition-transform duration-300",
                                        index === openIndex
                                            ? "rotate-45"
                                            : "rotate-0",
                                    )}
                                >
                                    <Plus className={cn("text-white")} />
                                </div>
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? "auto" : 0,
                                    opacity: openIndex === index ? 1 : 0,
                                }}
                                className="overflow-hidden"
                            >
                                <p className="pt-4 text-white text-[20px] m-0 leading-[30px] font-normal tracking-[-0.2px]">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
