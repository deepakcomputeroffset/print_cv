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
            className={cn("py-12 overflow-hidden", sourceSerif4.className)}
        >
            <div className="container px-4 mx-auto relative">
                {/* Background decorative elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-cyan-500/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-30 h-30 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/10 blur-xl" />

                <motion.div
                    className="relative z-10 bg-gradient-to-br from-primary/80 to-cyan-700 rounded-xl p-6 md:p-8 shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 translate-x-1/2 -translate-y-1/2 blur-xl" />
                    <div className="absolute bottom-0 left-10 w-20 h-20 rounded-full bg-white/5 blur-lg" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Craftsmanship Meets Innovation in Every Print
                            </h2>
                            <p className="text-white/80 text-base mb-6 max-w-lg">
                                Experience the perfect blend of traditional
                                printing expertise and cutting-edge technology.
                                Your vision comes to life exactly as imagined.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg group">
                                    Start Your Project
                                    <Printer className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-white/30 text-black hover:bg-white10"
                                >
                                    Contact Our Team
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                            <h3 className="text-white text-lg font-semibold mb-4">
                                The Aditya Printify Advantage
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-sm">
                                            Uncompromising Quality
                                        </h4>
                                        <p className="text-white/80 text-xs">
                                            Premium materials and
                                            state-of-the-art printing technology
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="h-5 w-5 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-sm">
                                            Reliable Timelines
                                        </h4>
                                        <p className="text-white/80 text-xs">
                                            Consistent, on-time delivery for all
                                            your projects
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Users className="h-5 w-5 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-sm">
                                            Expert Consultation
                                        </h4>
                                        <p className="text-white/80 text-xs">
                                            Personalized guidance from printing
                                            specialists
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Award className="h-5 w-5 text-white/90 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-medium text-sm">
                                            Satisfaction Guarantee
                                        </h4>
                                        <p className="text-white/80 text-xs">
                                            Your complete satisfaction is our
                                            priority
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
