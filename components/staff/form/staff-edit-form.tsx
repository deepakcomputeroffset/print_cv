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
import { staffFormSchema } from "@/schemas/staff-schema";
import { ROLE } from "@prisma/client";
import { useModal } from "@/hooks/use-modal";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { useStaff } from "@/hooks/use-staff";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";

export const EditStaffForm = () => {
    const { data, onClose } = useModal();
    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            name: data?.staff?.name,
            email: data?.staff?.email,
            phone: data?.staff?.phone,
            password: "",
            role: data?.staff?.role,
        },
    });

    const {
        updatestaff: { mutateAsync, isPending },
    } = useStaff();

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;

    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (Object.keys(dirtyFieldsWithValues).length > 0 && data?.staff?.id) {
            await mutateAsync({
                id: data?.staff?.id,
                data: dirtyFieldsWithValues,
            });
        }
        onClose();
    };
    return (
        <Form {...form}>
            <form
                onSubmit={async (e) => await onSubmit(e)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} />
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
                                    placeholder="example@gmail.com"
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
                                    placeholder="1234567890"
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

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "update"
                    )}
                </Button>
            </form>
        </Form>
    );
};
