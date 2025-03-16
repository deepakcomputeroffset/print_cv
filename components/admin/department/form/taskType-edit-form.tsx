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
import { taskTypeFormSchema } from "@/schemas/taskType.form.schema";
import { useModal } from "@/hooks/use-modal";
import { useDepartment } from "@/hooks/use-department";
import { Loader2 } from "lucide-react";

export const EditDepartmentForm = () => {
    const {
        onClose,
        data: { taskType },
    } = useModal();

    const form = useForm<z.infer<typeof taskTypeFormSchema>>({
        resolver: zodResolver(taskTypeFormSchema),
        defaultValues: {
            name: taskType?.name || "",
            description: taskType?.description || "",
        },
    });

    const {
        updateDepartment: { mutateAsync, isPending },
    } = useDepartment();

    const handleSubmit = async (values: z.infer<typeof taskTypeFormSchema>) => {
        await mutateAsync({ id: taskType?.id as number, data: values });
        onClose();
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Department Name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Department Description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
        </Form>
    );
};
