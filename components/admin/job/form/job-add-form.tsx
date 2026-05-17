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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { jobFormSchema } from "@/schemas/job.form.schema";
import { useModal } from "@/hooks/use-modal";
import { useJob } from "@/hooks/use-job";
import { useJobPrefix } from "@/hooks/use-job-prefix";
import { Loader2, Plus, Settings2, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Inline manage-prefixes dialog so it doesn't replace the parent add-job modal
function ManagePrefixesDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [newPrefix, setNewPrefix] = useState("");

    const {
        prefixes,
        isLoading,
        createPrefix: { mutateAsync: createPrefix, isPending: creating },
        deletePrefix: { mutateAsync: deletePrefix, isPending: deleting },
    } = useJobPrefix();

    const handleCreate = async () => {
        const val = newPrefix.trim().toUpperCase();
        if (!val) return;
        await createPrefix({ prefix: val });
        setNewPrefix("");
    };

    const handleDelete = async (id: number) => {
        await deletePrefix(id);
        setConfirmId(null);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Manage Job Prefixes
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Create */}
                    <div className="flex gap-2">
                        <Input
                            value={newPrefix}
                            onChange={(e) =>
                                setNewPrefix(e.target.value.toUpperCase())
                            }
                            placeholder="New prefix (e.g. BSB)"
                            className="uppercase font-mono"
                            maxLength={10}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCreate();
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={handleCreate}
                            disabled={!newPrefix.trim() || creating}
                            className="shrink-0"
                        >
                            {creating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            <span className="ml-1">Add</span>
                        </Button>
                    </div>

                    {/* List */}
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                        </div>
                    ) : !prefixes || prefixes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No prefixes yet.
                        </p>
                    ) : (
                        <ul className="divide-y rounded-md border max-h-52 overflow-y-auto">
                            {prefixes.map((p) => (
                                <li
                                    key={p.id}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors"
                                >
                                    <Badge
                                        variant="outline"
                                        className="font-mono tracking-widest"
                                    >
                                        {p.prefix}
                                    </Badge>
                                    {confirmId === p.id ? (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-muted-foreground">
                                                Confirm?
                                            </span>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="h-6 text-xs px-2"
                                                disabled={deleting}
                                                onClick={() =>
                                                    handleDelete(p.id)
                                                }
                                            >
                                                {deleting ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    "Yes"
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs px-2"
                                                onClick={() =>
                                                    setConfirmId(null)
                                                }
                                            >
                                                No
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => setConfirmId(p.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export const AddJobForm = () => {
    const { onClose } = useModal();
    const [showManage, setShowManage] = useState(false);
    const [quickPrefix, setQuickPrefix] = useState("");
    const [showQuickCreate, setShowQuickCreate] = useState(false);

    const form = useForm<z.infer<typeof jobFormSchema>>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            name: "",
            prefixId: null,
        },
    });

    const {
        createJob: { mutateAsync, isPending },
    } = useJob();

    const {
        prefixes,
        isLoading: prefixLoading,
        createPrefix: { mutateAsync: createPrefix, isPending: creatingPrefix },
    } = useJobPrefix();

    const selectedPrefixId = form.watch("prefixId");
    const selectedPrefix = prefixes?.find((p) => p.id === selectedPrefixId);

    const handleSubmit = async (values: z.infer<typeof jobFormSchema>) => {
        await mutateAsync(values);
        onClose();
        form.reset();
    };

    const handleQuickCreate = async () => {
        const val = quickPrefix.trim().toUpperCase();
        if (!val) return;
        const result = await createPrefix({ prefix: val });
        if (result?.data?.data) {
            form.setValue("prefixId", result.data.data.id);
            setQuickPrefix("");
            setShowQuickCreate(false);
        }
    };

    return (
        <>
            <ManagePrefixesDialog
                open={showManage}
                onClose={() => setShowManage(false)}
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    {/* Prefix Field */}
                    <FormField
                        control={form.control}
                        name="prefixId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        Prefix
                                    </span>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => setShowManage(true)}
                                    >
                                        <Settings2 className="w-3 h-3" />
                                        Manage
                                    </button>
                                </FormLabel>
                                <Select
                                    onValueChange={(val) =>
                                        field.onChange(
                                            val === "none"
                                                ? null
                                                : parseInt(val),
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
                                            <SelectItem
                                                value="loading"
                                                disabled
                                            >
                                                Loading...
                                            </SelectItem>
                                        ) : !prefixes ||
                                          prefixes.length === 0 ? (
                                            <SelectItem value="empty" disabled>
                                                No prefixes — create one below
                                            </SelectItem>
                                        ) : (
                                            prefixes.map((p) => (
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

                                {/* Quick create */}
                                {!showQuickCreate ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickCreate(true)}
                                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Create new prefix
                                    </button>
                                ) : (
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            value={quickPrefix}
                                            onChange={(e) =>
                                                setQuickPrefix(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder="e.g. BSB"
                                            className="h-8 text-xs uppercase"
                                            maxLength={10}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleQuickCreate();
                                                }
                                                if (e.key === "Escape")
                                                    setShowQuickCreate(false);
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="h-8 text-xs px-3"
                                            disabled={
                                                !quickPrefix.trim() ||
                                                creatingPrefix
                                            }
                                            onClick={handleQuickCreate}
                                        >
                                            {creatingPrefix ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                "Add"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs px-2"
                                            onClick={() => {
                                                setShowQuickCreate(false);
                                                setQuickPrefix("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Name / Number</FormLabel>
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
                                        <Input
                                            placeholder={
                                                selectedPrefix
                                                    ? "e.g. 1, 2, 3..."
                                                    : "Job name"
                                            }
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                                {selectedPrefix && field.value && (
                                    <p className="text-xs text-muted-foreground">
                                        Full job name:{" "}
                                        <span className="font-medium text-foreground font-mono">
                                            {selectedPrefix.prefix}-
                                            {field.value}
                                        </span>
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Create Job"
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
};
