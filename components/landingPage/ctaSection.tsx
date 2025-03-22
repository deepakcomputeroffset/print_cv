"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, Clock, Award, Users } from "lucide-react";

export default function CtaSection() {
    return (
        <section
            className={cn("py-20 overflow-hidden", sourceSerif4.className)}
        >
            <div className="container px-4 mx-auto relative">
                {/* Background decorative elements */}
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/10 blur-2xl" />

                <motion.div
                    className="relative z-10 bg-gradient-to-br from-primary/80 to-cyan-700 rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/2 -translate-y-1/2 blur-xl" />
                    <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-white/5 blur-lg" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Craftsmanship Meets Innovation in Every Print
                            </h2>
                            <p className="text-white/80 text-lg mb-8 max-w-lg">
                                Experience the perfect blend of traditional
                                printing expertise and cutting-edge technology.
                                Our dedication to quality ensures your vision
                                comes to life exactly as you imagined.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg group"
                                >
                                    Start Your Project
                                    <Printer className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto border-white/30 text-black hover:bg-white/10"
                                >
                                    Contact Our Team
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-white text-xl font-semibold mb-6">
                                The Printify Advantage
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-start">
                                    <CheckCircle2 className="h-6 w-6 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-lg">
                                            Uncompromising Quality
                                        </h4>
                                        <p className="text-white/80 text-sm">
                                            Premium materials and
                                            state-of-the-art printing technology
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="h-6 w-6 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-lg">
                                            Reliable Timelines
                                        </h4>
                                        <p className="text-white/80 text-sm">
                                            Consistent, on-time delivery for all
                                            your projects
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Users className="h-6 w-6 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-lg">
                                            Expert Consultation
                                        </h4>
                                        <p className="text-white/80 text-sm">
                                            Personalized guidance from our
                                            printing specialists
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Award className="h-6 w-6 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-lg">
                                            Satisfaction Guarantee
                                        </h4>
                                        <p className="text-white/80 text-sm">
                                            Your complete satisfaction is our
                                            highest priority
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
