"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { VariantForm } from "./form/variant-form";
import { ProductVariantType } from "@/types/types";
import { z } from "zod";
import {
    productFormSchema,
    productPriceSchema,
} from "@/schemas/product.form.schema";
import { uploadGroup } from "@prisma/client";

interface ProductVariantsProps {
    variants: ProductVariantType[];
    form: UseFormReturn<z.infer<typeof productFormSchema>>;
    getAttributeNameById: (id: number) => string;
    pricing: z.infer<typeof productPriceSchema>[];
    uploadGroups: uploadGroup[];
}

export function ProductVariants({
    variants,
    form,
    getAttributeNameById,
    pricing,
    uploadGroups,
}: ProductVariantsProps) {
    const [expandedVariant, setExpandedVariant] = useState<number | null>(null);

    const toggleVariant = (idx: number) => {
        setExpandedVariant(expandedVariant === idx ? null : idx);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
            {variants?.map((variant, index) => (
                <Card key={index} className="mb-4">
                    <CardContent className="pt-6">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleVariant(index)}
                        >
                            <h3 className="text-lg font-medium">
                                Variant {index + 1}
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {variant?.productAttributeOptions.map(
                                        (combo) => (
                                            <Badge
                                                key={
                                                    combo.productAttributeTypeId
                                                }
                                                variant="outline"
                                            >
                                                {getAttributeNameById(
                                                    combo?.productAttributeTypeId,
                                                )}{" "}
                                                : {combo?.productAttributeValue}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                                {expandedVariant === index ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </div>

                        {expandedVariant === index && (
                            <VariantForm
                                form={form}
                                index={index}
                                pricing={pricing}
                                uploadGroups={uploadGroups}
                            />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
