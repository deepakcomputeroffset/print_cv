"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/api/customer";
import { changePasswordFormSchema } from "@/schemas/customer.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "motion/react";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";

export const ChangePasswordForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof changePasswordFormSchema>>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
    });
    const onSubmit = async (data: z.infer<typeof changePasswordFormSchema>) => {
        try {
            const response = await changePassword(data);
            if (response.success) {
                toast.success(response.message);
                form.reset();
                router.push("/customer");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong",
            );
        }
    };
    return (
        <Form {...form}>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                                Current Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="Enter your current password"
                                        className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <div className="pt-2">
                    <div className="flex items-center mb-4">
                        <div className="h-px w-full bg-gray-200"></div>
                        <span className="mx-4 text-sm text-gray-500 whitespace-nowrap">
                            New Password
                        </span>
                        <div className="h-px w-full bg-gray-200"></div>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                                New Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="Create a strong password"
                                        className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="Confirm your new password"
                                        className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />

                <motion.div
                    className="pt-4"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white py-6 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? "Updating Password..."
                            : "Update Password"}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
};
