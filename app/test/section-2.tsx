"use client";
import { motion } from "motion/react";

export default function SectionTwo() {
    return (
        <motion.div
            initial={{
                translateY: 150,
                opacity: 0,
            }}
            whileInView={{
                translateY: 0,
                opacity: 1,
                transition: {
                    duration: 1,
                    delay: 0.2,
                    ease: "easeInOut",
                },
            }}
            viewport={{ once: true, margin: "500px" }}
            className="w-full max-h-screen overflow-hidden min-h-screen bg-[url(https://images.unsplash.com/photo-1534531688091-a458257992cb?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8Mjh8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)] bg-no-repeat bg-cover bg-center bg-origin-padding "
        />
    );
}
