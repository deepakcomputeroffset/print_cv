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
import { useModal } from "@/hooks/use-modal";
import { customerCategorySchema } from "@/schemas/customer.category.form.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCustomerCategory } from "@/hooks/use-customer-category";

export const CustomerCategoryAddForm = () => {
    const { onClose } = useModal();
    const { createCustomerCategory } = useCustomerCategory();
    const router = useRouter();

    const form = useForm<z.infer<typeof customerCategorySchema>>({
        resolver: zodResolver(customerCategorySchema),
        defaultValues: {
            name: "",
            discount: 0,
            level: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof customerCategorySchema>) => {
        await createCustomerCategory.mutateAsync(values);
        toast("Category created successfully.");
        onClose();
        router.refresh();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="level"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Level</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                    }
                                    type="number"
                                    placeholder="ex: 1"
                                    min={0}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                    }
                                    min={0}
                                    type="number"
                                    placeholder="ex: 5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    Create
                </Button>
            </form>
        </Form>
    );
};
