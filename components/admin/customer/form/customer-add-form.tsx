"use client";
import { useForm } from "react-hook-form";
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

export const CustomerRegisterForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { data: states } = useStates();

    const form = useForm<z.infer<typeof customerFormSchema>>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: "Aditya Kumar",
            business_name: "Web Dev",
            email: "aaditya@gmail.com",
            country: "india",
            state: "115",
            city: "4",
            pin_code: "123456",
            gst_number: "",
            line: "example ",
            phone: "1234567890",
            reference_id: "",
            password: "Abc1234@@",
        },
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Radhe Radhe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(e) => {
                                        form.setValue("city", "");
                                        field.onChange(e);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={"Select state"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>States</SelectLabel>
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={"Select city"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>city</SelectLabel>

                                            {states?.map((state) => {
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
                                                                key={city?.id}
                                                                value={city?.id?.toString()}
                                                            >
                                                                {city?.name}
                                                            </SelectItem>
                                                        ),
                                                    );
                                                }
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pin_code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pin code</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="line"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Sector-8, Noida"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gst_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GST Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="+911234567890" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </Form>
    );
};
