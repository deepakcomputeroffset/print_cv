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
import { jobFormSchema } from "@/schemas/job.form.schema";
import { useModal } from "@/hooks/use-modal";
import { useJob } from "@/hooks/use-job";
import { Loader2 } from "lucide-react";

export const AddJobForm = () => {
    const { onClose } = useModal();

    const form = useForm<z.infer<typeof jobFormSchema>>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const {
        createJob: { mutateAsync, isPending },
    } = useJob();

    const handleSubmit = async (values: z.infer<typeof jobFormSchema>) => {
        await mutateAsync(values);
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
                                <Input placeholder="Job Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Create"
                    )}
                </Button>
            </form>
        </Form>
    );
};
