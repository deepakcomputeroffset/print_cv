"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
    return (
        <Suspense>
            <AuthError />
        </Suspense>
    );
}

function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50/30 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-md w-full"
            >
                {/* Decorative elements */}
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 relative overflow-hidden">
                    {/* Background decorative pattern */}
                    <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.02] mix-blend-overlay z-0"></div>

                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 rounded-full bg-red-50 border border-red-100">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                        </div>

                        <h1
                            className={cn(
                                "text-2xl md:text-3xl font-bold text-center mb-4",
                                sourceSerif4.className,
                            )}
                        >
                            Authentication{" "}
                            <span className="text-red-500">Error</span>
                        </h1>

                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                            <p className="text-gray-700 text-center">
                                {error ||
                                    "An error occurred during authentication"}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Go Back
                            </Button>

                            {/* <Button
                                onClick={() => router.push("/login")}
                                className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white transition-all shadow hover:shadow-md"
                            >
                                Try Again
                            </Button> */}

                            <Button
                                onClick={() => router.push("/")}
                                variant="ghost"
                                className="flex items-center gap-2 hover:bg-gray-100"
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
