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
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Old Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="New Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Confirm Password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting
                        ? "Changing Password..."
                        : "Change Password"}
                </Button>
            </form>
        </Form>
    );
};
