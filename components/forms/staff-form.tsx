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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { staffFormSchema } from "@/schemas/staff-schema";
import { ROLE, staff } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useModal } from "@/hooks/useModal";

export const EditStaffForm = () => {
    const { data, onClose } = useModal();
    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            name: data?.staff?.name,
            email: data?.staff?.email,
            phone: data?.staff?.phone,
            password: data?.staff?.password,
            role: data?.staff?.role,
        },
    });
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof staffFormSchema>) => {
            const { data: res } = await axios.put("/api/staff", {
                ...values,
                id: data?.staff?.id,
            });
            return res;
        },

        onError(error: AxiosError<{ message: string; succuss: boolean }>) {
            toast(error?.response?.data?.message || "Update failed");
        },

        onSuccess(res) {
            if (res?.success) {
                try {
                    queryClient.setQueryData(
                        [
                            "admin-staff",
                            data?.page || "1",
                            data?.searchParameter || "",
                        ],
                        (oldData: staff[]) => {
                            return oldData.map((s) =>
                                s.id === res?.data?.id ? res?.data : s,
                            );
                        },
                    );
                    toast(res?.message);
                    form.reset();
                    onClose();
                } catch (error) {
                    console.log(error);
                    console.log("error in staff upadate");
                }
            }
        },
    });
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => mutate(values))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Aditya Kumar" {...field} />
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
                                    placeholder="aaditya1392@gmail.com"
                                    {...field}
                                />
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
                                <Input
                                    type="tel"
                                    placeholder="+917479796212"
                                    {...field}
                                />
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
                                    type="text"
                                    placeholder="Abc123@@"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(ROLE).map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className={`w-full`}
                    disabled={isPending || !form?.formState?.isDirty}
                >
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
};

export const AddStaffForm = () => {
    const { onClose, data } = useModal();

    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            name: "test 1",
            email: "test@gmail.com",
            phone: "+917479796212",
            password: "Abc123@@",
            role: "STAFF",
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof staffFormSchema>) => {
            const { data } = await axios.post("/api/staff", values);
            return data;
        },

        onError(error: AxiosError<{ message: string; succuss: boolean }>) {
            toast(error?.response?.data?.message || "Add failed");
        },

        onSuccess(res) {
            if (res?.success) {
                try {
                    queryClient.setQueryData(
                        [
                            "admin-staff",
                            data?.page || "1",
                            data?.searchParameter || "",
                        ],
                        (oldData: staff[]) => {
                            console.log(oldData);
                            return [res?.data, ...oldData];
                        },
                    );
                    toast(res?.message);
                    form.reset();
                    onClose();
                } catch (error) {
                    console.log(error);
                    console.log("error in staff add");
                }
            }
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => mutate(values))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Aditya Kumar" {...field} />
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
                                    type="email"
                                    placeholder="aaditya1392@gmail.com"
                                    {...field}
                                />
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
                                <Input
                                    type="tel"
                                    placeholder="+917479796212"
                                    {...field}
                                />
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
                                    type="text"
                                    placeholder="Abc123@@"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(ROLE).map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className={`w-full`}
                    disabled={isPending || !form?.formState?.isDirty}
                >
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
};
