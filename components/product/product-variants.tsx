"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { VariantForm } from "./variant-form";
import { ProductVariantType } from "@/types/types";
import { z } from "zod";
import { productFormSchema } from "@/schemas/product-schema";

interface ProductVariantsProps {
    variants: ProductVariantType[];
    form: UseFormReturn<z.infer<typeof productFormSchema>>;
    getAttributeNameById: (id: number) => string;
}

export function ProductVariants({
    variants,
    form,
    getAttributeNameById,
}: ProductVariantsProps) {
    const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

    const toggleVariant = (variantId: string) => {
        setExpandedVariant(expandedVariant === variantId ? null : variantId);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
            {variants?.map((variant, index) => (
                <Card key={variant.id} className="mb-4">
                    <CardContent className="pt-6">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleVariant(variant.id)}
                        >
                            <h3 className="text-lg font-medium">
                                ProductVariantType {index + 1}
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {variant?.product_attribute_options.map(
                                        (combo) => (
                                            <Badge
                                                key={
                                                    combo.product_attribute_type_id
                                                }
                                                variant="outline"
                                            >
                                                {getAttributeNameById(
                                                    combo?.product_attribute_type_id,
                                                )}{" "}
                                                :{" "}
                                                {combo?.product_attribute_value}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                                {expandedVariant === variant.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </div>

                        {expandedVariant === variant.id && (
                            <VariantForm form={form} index={index} />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
