"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "./compnents/changePasswordForm";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { KeyRound } from "lucide-react";

export default function CustomerChangePasswordPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-8 px-4"
        >
            <div className="mb-8">
                <div className="flex items-center">
                    <div className="h-1 w-8 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-3"></div>
                    <h1
                        className={cn(
                            "text-2xl font-bold text-gray-800",
                            sourceSerif4.className,
                        )}
                    >
                        Security Settings
                    </h1>
                </div>
                <p className="text-gray-500 text-sm ml-11 mt-1">
                    Manage your account security and password
                </p>
            </div>

            <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-white">
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary"></div>

                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <KeyRound className="h-5 w-5 text-primary/80" />
                            </div>
                            <CardTitle
                                className={cn(
                                    "text-lg",
                                    sourceSerif4.className,
                                )}
                            >
                                Change Password
                            </CardTitle>
                        </div>
                        <p className="text-sm text-gray-500 ml-11 mt-1">
                            Update your password to keep your account secure
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm />
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
}
