"use client";

import { Modal } from "@/components/modal";
import { useModal } from "@/hooks/use-modal";
import { useJobPrefix } from "@/hooks/use-job-prefix";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { jobPrefixFormSchema } from "@/schemas/job.form.schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

function ManagePrefixesContent() {
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const {
        prefixes,
        isLoading,
        createPrefix: { mutateAsync: createPrefix, isPending: creating },
        deletePrefix: { mutateAsync: deletePrefix, isPending: deleting },
    } = useJobPrefix();

    const form = useForm<z.infer<typeof jobPrefixFormSchema>>({
        resolver: zodResolver(jobPrefixFormSchema),
        defaultValues: { prefix: "" },
    });

    const handleCreate = async (
        values: z.infer<typeof jobPrefixFormSchema>,
    ) => {
        await createPrefix({ prefix: values.prefix.toUpperCase() });
        form.reset();
    };

    const handleDelete = async (id: number) => {
        await deletePrefix(id);
        setConfirmId(null);
    };

    return (
        <div className="space-y-5">
            {/* Create new prefix */}
            <div>
                <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Add new prefix
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleCreate)}
                        className="flex gap-2"
                    >
                        <FormField
                            control={form.control}
                            name="prefix"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. BSB, INV, PO"
                                            className="uppercase font-mono"
                                            maxLength={10}
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            size="default"
                            disabled={creating}
                            className="shrink-0"
                        >
                            {creating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            <span className="ml-1">Add</span>
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Prefix list */}
            <div>
                <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Existing prefixes
                </p>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                    </div>
                ) : !prefixes || prefixes.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground text-sm border rounded-md bg-muted/30">
                        <Tag className="w-8 h-8 opacity-40" />
                        <p>No prefixes yet. Add one above.</p>
                    </div>
                ) : (
                    <ul className="divide-y rounded-md border overflow-hidden">
                        {prefixes.map((p) => (
                            <li
                                key={p.id}
                                className="flex items-center justify-between px-4 py-2.5 bg-card hover:bg-muted/40 transition-colors"
                            >
                                <Badge
                                    variant="outline"
                                    className="font-mono text-sm tracking-widest"
                                >
                                    {p.prefix}
                                </Badge>

                                {confirmId === p.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            Confirm delete?
                                        </span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-7 text-xs px-2"
                                            disabled={deleting}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            {deleting ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                "Yes, delete"
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs px-2"
                                            onClick={() => setConfirmId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => setConfirmId(p.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export function ManagePrefixesModal() {
    const { isOpen, onClose, modal } = useModal();
    const open = isOpen && modal === "managePrefixes";

    return (
        <Modal title="Manage Job Prefixes" isOpen={open} onClose={onClose}>
            <ManagePrefixesContent />
        </Modal>
    );
}
