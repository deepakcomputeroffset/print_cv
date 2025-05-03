"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStates } from "@/hooks/useStates";
import { createCustomer } from "@/lib/api/customer";
import { motion } from "motion/react";
import {
    Building,
    User,
    MapPin,
    Mail,
    Phone,
    Key,
    Hash,
    Home,
} from "lucide-react";

export const CustomerRegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { data: states } = useStates();
    const form = useForm<z.infer<typeof customerFormSchema>>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: process.env.NODE_ENV === "development" ? "Aditya Kumar" : "",
            businessName:
                process.env.NODE_ENV === "development" ? "Web Dev" : "",
            email:
                process.env.NODE_ENV === "development"
                    ? "aaditya@gmail.com"
                    : "",
            country: process.env.NODE_ENV === "development" ? "india" : "",
            state: process.env.NODE_ENV === "development" ? "115" : "",
            city: process.env.NODE_ENV === "development" ? "4" : "",
            pinCode: process.env.NODE_ENV === "development" ? "123456" : "",
            gstNumber: process.env.NODE_ENV === "development" ? "" : "",
            line: process.env.NODE_ENV === "development" ? "example " : "",
            phone: process.env.NODE_ENV === "development" ? "1234567890" : "",
            referenceId: process.env.NODE_ENV === "development" ? "" : "",
            password: process.env.NODE_ENV === "development" ? "Abc1234@@" : "",
        },
    });

    const selectedStateId = useWatch({
        control: form.control,
        name: "state",
    });

    async function onSubmit(values: z.infer<typeof customerFormSchema>) {
        try {
            setLoading(true);
            await createCustomer(values);
            toast.success("Registration successful");
            router.push("/login");
        } catch (error) {
            console.log(error);
            toast.error(
                ((error as AxiosError)?.response?.data as { message?: string })
                    ?.message || "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Business Name
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="Your business name"
                                            {...field}
                                            disabled={loading}
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Your Name
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="Your full name"
                                            {...field}
                                            disabled={loading}
                                            className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    State
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(e) => {
                                            form.setValue("city", "");
                                            console.log(e);
                                            field.onChange(e);
                                        }}
                                        disabled={loading}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
                                            <div className="flex items-center">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                <SelectValue
                                                    placeholder={"Select state"}
                                                />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    States
                                                </SelectLabel>
                                                {states?.map((state) => (
                                                    <SelectItem
                                                        key={state?.id}
                                                        value={state?.id.toString()}
                                                    >
                                                        {state?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    City
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={loading}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
                                            <div className="flex items-center">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                <SelectValue
                                                    placeholder={"Select city"}
                                                />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>City</SelectLabel>
                                                {states
                                                    ?.find(
                                                        (state) =>
                                                            state.id.toString() ===
                                                            selectedStateId,
                                                    )
                                                    ?.cities?.map(
                                                        (city: {
                                                            id: number;
                                                            name: string;
                                                        }) => (
                                                            <SelectItem
                                                                key={city?.id}
                                                                value={city?.id?.toString()}
                                                            >
                                                                {city?.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                {/* {states?.map((state) => {
                                                    if (
                                                        state?.id?.toString() ==
                                                        form?.getValues("state")
                                                    ) {
                                                        return state?.cities?.map(
                                                            (city: {
                                                                id: number;
                                                                name: string;
                                                            }) => (
                                                                <SelectItem
                                                                    key={
                                                                        city?.id
                                                                    }
                                                                    value={city?.id?.toString()}
                                                                >
                                                                    {city?.name}
                                                                </SelectItem>
                                                            ),
                                                        );
                                                    }
                                                })} */}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Pin Code
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="123456"
                                            {...field}
                                            disabled={loading}
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
                        name="line"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Address
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="Enter your address"
                                            {...field}
                                            disabled={loading}
                                            className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="your.email@example.com"
                                            {...field}
                                            disabled={loading}
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
                        name="gstNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    GST Number
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="Optional"
                                            {...field}
                                            disabled={loading}
                                            className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Phone
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            placeholder="Your phone number"
                                            {...field}
                                            disabled={loading}
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            type="password"
                                            disabled={loading}
                                            placeholder="Create a secure password"
                                            {...field}
                                            className="w-full pl-10 py-6 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />
                </div>

                <motion.div
                    className="pt-4"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white py-6 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
};
