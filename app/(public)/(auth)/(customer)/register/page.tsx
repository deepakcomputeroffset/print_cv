"use client";

import { CustomerRegisterForm } from "@/components/admin/customer/form/customer-add-form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-6 py-16 bg-gradient-to-b from-white to-blue-50/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto container max-w-3xl relative"
            >
                {/* Decorative accent */}
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary"></div>

                <div className="bg-white p-8 rounded-lg shadow-lg border border-primary/5 relative overflow-hidden">
                    {/* Background decorative pattern */}
                    <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.02] mix-blend-overlay z-0"></div>

                    <div className="relative z-10 text-center mb-6">
                        <div className="flex justify-center mb-6">
                            <div className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-cyan-500/10 mb-4">
                                <UserPlus className="h-7 w-7 text-primary" />
                            </div>
                        </div>

                        <h1
                            className={cn(
                                "text-3xl font-bold text-center mb-2",
                                sourceSerif4.className,
                            )}
                        >
                            Create Your{" "}
                            <span className="text-primary">Printing Press</span>{" "}
                            Account
                        </h1>

                        <div className="flex justify-center my-4">
                            <div className="h-1 w-24 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                        </div>

                        <p className="text-gray-600 max-w-xl mx-auto">
                            Join our premium printing service to access
                            exclusive features and professional printing
                            solutions tailored to your needs.
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto container max-w-3xl"
            >
                <div className="bg-white p-8 rounded-lg shadow-lg border border-primary/5 relative overflow-hidden">
                    {/* Background decorative pattern */}
                    <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.02] mix-blend-overlay z-0"></div>

                    <div className="relative z-10">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">
                                Personal Information
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Please provide your details to create your
                                account
                            </p>
                        </div>

                        <CustomerRegisterForm />

                        <div className="text-center mt-6 pt-6 border-t border-gray-100">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary font-medium hover:underline transition-all"
                                >
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
