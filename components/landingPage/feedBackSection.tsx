"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
import Image from "next/image";

export default function FeedBackSection() {
    return (
        <section
            className={cn(
                "box-border relative overflow-hidden py-5 bg-cover bg-no-repeat bg-[50%_50%] text-[#232323] font-normal leading-[24px] m-0 hidden sm:flex flex-wrap justify-center w-full gap-12",
                sourceSerif4.className,
            )}
        >
            {/* Client Love */}

            <div className="w-3/4 px-4 max-w-customHaf lg:max-w-custom">
                <motion.h2
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className="text-8xl lg:text-8xl leading-[1.0336] tracking-[-0.6px] font-medium lg:font-normal mt-0 -mb-4 text-black origin-top-left"
                >
                    Client Love
                </motion.h2>
            </div>
            <TestimonialsCarousel />

            {/* What They Say */}

            <div className="w-3/4 max-w-customHaf lg:max-w-custom px-4">
                <motion.h2
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className="text-8xl lg:text-8xl leading-[1.0336] tracking-[-0.6px] font-medium lg:font-normal -mt-4 mb-0 text-right text-black"
                >
                    What They Say
                </motion.h2>
            </div>
        </section>
    );
}

const TestimonialsCarousel = () => {
    return (
        <Marquee pauseOnHover direction="right">
            {testimonials.map((testimonial, index) => (
                <div className="w-1/4 -ml-5 py-8 shrink-0" key={index}>
                    <div
                        className={cn(
                            "box-border relative flex justify-center min-w-[450px] max-w-[450px] rotate-[-4deg] rounded-3xl my-0 leading-[24px] font-normal pl-4 md:pl-6 lg:pl-0 pr-4 md:pr-6 lg:pr-0 text-[#232323]",
                            testimonial?.color ?? "bg-dominant-color",
                        )}
                    >
                        <div className="w-full">
                            <div className="h-full p-8 md:p-12 lg:p-[56px] flex flex-col justify-between rounded-[32px]">
                                <div className="relative">
                                    <p className="mt-0 mb-4 md:mb-6 lg:mb-[16px] leading-[1.3] md:leading-[1.4] lg:leading-[42px] break-words text-white text-xl md:text-2xl lg:text-[28px] tracking-[-0.8px]">
                                        {testimonial.text}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <div>
                                            <Image
                                                alt={testimonial.name}
                                                src={testimonial.imageUrl}
                                                className="w-[50px] h-[50px] object-cover rounded-full"
                                                height={50}
                                                width={50}
                                            />
                                        </div>
                                        <div className="ml-4 md:ml-6 lg:ml-[20px] relative">
                                            <p className="mt-0 mb-0 text-lg md:text-xl lg:text-[20px] font-normal leading-[1.2] md:leading-[1.3] lg:leading-[30px] break-words text-white tracking-[-0.2px]">
                                                <strong className="font-bold">
                                                    {testimonial.name}
                                                </strong>
                                            </p>
                                            <p className="mt-0 mb-0 text-lg md:text-xl lg:text-[20px] font-normal leading-[1.2] md:leading-[1.3] lg:leading-[30px] break-words text-white tracking-[-0.2px]">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Marquee>
    );
};

const testimonials = [
    {
        text: "Printify made my project pop!",
        name: "Sarah Lee",
        role: "Graphic Designer",
        imageUrl:
            "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
        text: "Fast and reliable service every time!",
        name: "Mike Chen",
        role: "Marketing Manager",
        imageUrl:
            "https://images.unsplash.com/photo-1679746584014-fb31d4eb0a5e?auto=format&fit=crop&w=600&h=600&q=80",
        color: "bg-[#CE4257]",
    },
    {
        text: "Quality that speaks for itself!",
        name: "Emily Davis",
        role: "Event Planner",
        imageUrl:
            "https://images.unsplash.com/photo-1545803928-04e3f4cdd4ed?auto=format&fit=crop&w=600&h=600&q=80",
        color: "bg-[#EDA371]",
    },
    {
        text: "Best printing service I've ever used!",
        name: "John Smith",
        role: "Business Owner",
        imageUrl:
            "https://images.unsplash.com/photo-1626899798511-c3eaacb02846?auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
        text: "They nailed my vision perfectly!",
        name: "Lisa Wong",
        role: "Artist",
        imageUrl:
            "https://images.unsplash.com/photo-1692558588242-57cec1e32bba?auto=format&fit=crop&w=600&h=600&q=80",
        color: "bg-[#CE4257]",
    },
    {
        text: "Highly recommend for all printing needs!",
        name: "Tom Brown",
        role: "Entrepreneur",
        imageUrl:
            "https://images.unsplash.com/photo-1497485692312-a26e1cc30f1d?auto=format&fit=crop&w=600&h=600&q=80",
        color: "bg-[#EDA371]",
    },
];
