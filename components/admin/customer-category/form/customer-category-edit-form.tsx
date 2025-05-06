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
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { customerCategorySchema } from "@/schemas/customer.category.form.schema";
import { useCustomerCategory } from "@/hooks/use-customer-category";

export const CustomerCategoryEditForm = () => {
    const { data, onClose } = useModal();
    const { updateCustomerCategory } = useCustomerCategory();
    const customerCategoryFormSchemaUpdated = customerCategorySchema?.partial();

    const form = useForm<z.infer<typeof customerCategoryFormSchemaUpdated>>({
        resolver: zodResolver(customerCategoryFormSchemaUpdated),
        defaultValues: {
            name: data?.customerCategory?.name,
            discount: data?.customerCategory?.discount,
            level: data?.customerCategory?.level,
        },
    });

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;

    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );

    const onSubmit = async () => {
        if (
            Object.keys(dirtyFieldsWithValues).length > 0 &&
            data?.customerCategory?.id
        ) {
            await updateCustomerCategory.mutateAsync({
                id: data?.customerCategory?.id,
                data: dirtyFieldsWithValues,
            });
            onClose();
        }
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
                                    min={0}
                                    placeholder="ex: 1"
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

                <Button type="submit" className="w-full">
                    Upated
                </Button>
            </form>
        </Form>
    );
};
