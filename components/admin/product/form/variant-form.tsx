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
import {
    productFormSchema,
    productPriceSchema,
} from "@/schemas/product.form.schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { uploadGroup } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ArrowBigRight } from "lucide-react";

interface VariantFormProps {
    form: UseFormReturn<z.infer<typeof productFormSchema>>;
    index: number;
    pricing: z.infer<typeof productPriceSchema>[];
    uploadGroups: uploadGroup[];
}

export function VariantForm({
    form,
    index,
    pricing,
    uploadGroups,
}: VariantFormProps) {
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

            {pricing.map((price, idx) => (
                <FormField
                    key={price.qty}
                    control={form.control}
                    name={`productItems.${index}.pricing.${idx}.price`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Qty:{" "}
                                {form.getValues(
                                    `productItems.${index}.pricing.${idx}.qty`,
                                )}
                            </FormLabel>
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
            ))}

            <FormField
                control={form.control}
                name={`productItems.${index}.uploadGroupId`}
                render={({ field }) => {
                    const selectedGroup = uploadGroups?.find(
                        (upg) => upg.id === field.value,
                    );

                    return (
                        <FormItem>
                            <FormLabel>Upload Group</FormLabel>
                            <Select
                                {...field}
                                value={field?.value?.toString()}
                                onValueChange={(v) => field.onChange(Number(v))}
                            >
                                <SelectTrigger>
                                    {selectedGroup ? (
                                        <div className="flex w-full items-center justify-between">
                                            <span>{selectedGroup.name}</span>
                                        </div>
                                    ) : (
                                        <SelectValue placeholder="Select Upload Group" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {uploadGroups?.map((upg) => (
                                        <SelectItem
                                            key={upg.id}
                                            value={upg.id.toString()}
                                        >
                                            <div className="mb-2 flex items-center text-base font-medium">
                                                <ArrowBigRight className="w-3 h-3" />
                                                {upg.name}
                                            </div>
                                            <div className="space-x-2">
                                                {upg.uploadTypes?.map(
                                                    (upgt) => (
                                                        <Badge
                                                            className="text-xs"
                                                            key={upgt}
                                                        >
                                                            {upgt}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}
