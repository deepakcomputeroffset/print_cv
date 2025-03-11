"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskSchema, TaskFormValues } from "@/schemas/task.form.schema";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createTask } from "@/lib/api/job";
import { useRouter } from "next/navigation";

export function TaskForm({
    jobId,
    taskTypes,
    staffMembers,
    existingTasks,
}: {
    jobId: number;
    taskTypes: { id: number; name: string }[];
    staffMembers: { id: number; name: string }[];
    existingTasks: { taskTypeId: number }[]; // New prop
    onSuccess?: () => void;
}) {
    const router = useRouter();
    // Filter out already used task types
    const usedTaskTypeIds = existingTasks.map((task) => task.taskTypeId);
    const availableTaskTypes = taskTypes.filter(
        (taskType) => !usedTaskTypeIds.includes(taskType.id),
    );

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            jobId,
            taskTypeId: undefined,
            assignedStaffId: undefined,
        },
    });

    async function onSubmit(values: TaskFormValues) {
        try {
            const { data } = await createTask(jobId, values);

            if (!data.success) {
                // Handle duplicate error specifically
                if (data.status === 409) {
                    toast.error(
                        data.message ||
                            "This task type already exists in the job",
                    );
                    return;
                }
                toast.error(data?.message || "Failed to create task");
                return;
            }

            toast.success(data.message || "Task created successfully");
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred",
            );
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...form.register("jobId")} />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="taskTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task Type</FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    value={field.value?.toString()}
                                    disabled={availableTaskTypes.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    availableTaskTypes.length ===
                                                    0
                                                        ? "No available task types"
                                                        : "Select task type"
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableTaskTypes.map((taskType) => (
                                            <SelectItem
                                                key={taskType.id}
                                                value={taskType.id.toString()}
                                            >
                                                {taskType.name}
                                            </SelectItem>
                                        ))}
                                        {availableTaskTypes.length === 0 && (
                                            <div className="text-muted-foreground px-2 py-1.5 text-sm">
                                                All task types already assigned
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="assignedStaffId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assign Staff</FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value ? Number(value) : null,
                                        )
                                    }
                                    value={field.value?.toString() || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff (optional)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {staffMembers.map((staff) => (
                                            <SelectItem
                                                key={staff.id}
                                                value={staff.id.toString()}
                                            >
                                                {staff.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={
                        form.formState.isSubmitting ||
                        availableTaskTypes.length === 0
                    }
                >
                    {form.formState.isSubmitting
                        ? "Creating..."
                        : "Create Task"}
                </Button>
            </form>
        </Form>
    );
}
