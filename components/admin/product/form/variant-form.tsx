"use client";

import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { productFormSchema } from "@/schemas/product.form.schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface VariantFormProps {
    form: UseFormReturn<z.infer<typeof productFormSchema>>;
    index: number;
}

export function VariantForm({ form, index }: VariantFormProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <FormField
                control={form.control}
                name={`productItems.${index}.sku`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Code</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`productItems.${index}.minQty`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Quantity</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`productItems.${index}.ogPrice`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Original Price</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`productItems.${index}.price`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`productItems.${index}.isAvailable`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Available</FormLabel>
                        <Select
                            {...field}
                            onValueChange={(v) =>
                                field.onChange(v === "true" ? true : false)
                            }
                            value={field.value === true ? "true" : "false"}
                            defaultValue="false"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Is product avialable to sell?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"false"}>No</SelectItem>
                                <SelectItem value={"true"}>Yes</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
