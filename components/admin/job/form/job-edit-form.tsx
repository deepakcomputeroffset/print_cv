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
import { useJobPrefix } from "@/hooks/use-job-prefix";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export const EditJobForm = () => {
    const {
        onClose,
        data: { job },
    } = useModal();

    const form = useForm<z.infer<typeof jobFormSchema>>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            name: job?.name || "",
            prefixId: job?.prefixId || null,
        },
    });

    useEffect(() => {
        if (job) {
            form.reset({
                name: job.name || "",
                prefixId: job.prefixId || null,
            });
        }
    }, [job, form]);

    const { prefixes, isLoading: prefixLoading } = useJobPrefix();
    const selectedPrefixId = form.watch("prefixId");
    const selectedPrefix = prefixes?.find((p) => p.id === selectedPrefixId);

    const {
        updateJob: { mutateAsync, isPending },
    } = useJob();

    const handleSubmit = async (values: z.infer<typeof jobFormSchema>) => {
        await mutateAsync({ id: job?.id as number, data: values });
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
                    name="prefixId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prefix</FormLabel>
                            <Select
                                onValueChange={(val) =>
                                    field.onChange(
                                        val === "none" ? null : parseInt(val),
                                    )
                                }
                                value={
                                    field.value
                                        ? String(field.value)
                                        : undefined
                                }
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a prefix (optional)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">
                                        No prefix
                                    </SelectItem>
                                    {prefixLoading ? (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : prefixes?.length === 0 ? (
                                        <SelectItem value="empty" disabled>
                                            No prefixes available
                                        </SelectItem>
                                    ) : (
                                        prefixes?.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={String(p.id)}
                                            >
                                                {p.prefix}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
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
                                <div className="flex items-center gap-2">
                                    {selectedPrefix && (
                                        <Badge
                                            variant="secondary"
                                            className="shrink-0 font-mono"
                                        >
                                            {selectedPrefix.prefix}-
                                        </Badge>
                                    )}
                                    <Input placeholder="Job Name" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                            {selectedPrefix && field.value && (
                                <p className="text-xs text-muted-foreground">
                                    Full job name:{" "}
                                    <span className="font-medium text-foreground">
                                        {selectedPrefix.prefix}-{field.value}
                                    </span>
                                </p>
                            )}
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
