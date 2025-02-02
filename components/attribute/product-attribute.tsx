"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProductVariantType } from "@/types/types";
import { AddProductAttributeModal } from "./modal/add-product-attribute-modal";
import { useModal } from "@/hooks/use-modal";
import { AddProductAttributeValueModal } from "./modal/add-product-attribute-value-modal";
import { AttributeCard } from "./attribute-card";
import {
    product_attribute_type,
    product_attribute_value,
} from "@prisma/client";

interface ProductAttributesProps {
    onVariantsGenerated: (variants: ProductVariantType[]) => void;
    product_category_id: number;
    isLoading: boolean;
    selectedAttributes: product_attribute_type[];
    setSelectedAttributes: Dispatch<SetStateAction<product_attribute_type[]>>;
    selectedOptions: product_attribute_value[];
    setSelectedOptions: Dispatch<SetStateAction<product_attribute_value[]>>;
}

export function ProductAttributes({
    onVariantsGenerated,
    isLoading,
    product_category_id,
    selectedAttributes,
    selectedOptions,
    setSelectedAttributes,
    setSelectedOptions,
}: ProductAttributesProps) {
    const { onOpen } = useModal();

    const removeAttribute = useCallback((attributeId: number) => {
        setSelectedAttributes((prev) =>
            prev.filter((a) => a.id !== attributeId),
        );
    }, []);

    const handleAttributeValueSelect = (v: product_attribute_value) => {
        if (selectedOptions.includes(v)) return;
        setSelectedOptions((prev) => [...prev, v]);
    };

    const handleRemoveValue = useCallback((value: product_attribute_value) => {
        setSelectedOptions((prev) => {
            return prev.filter((v) => v.id != value?.id);
        });
    }, []);

    const generateVariants = () => {
        const generateCombinations = (
            attributes: product_attribute_type[],
            values: product_attribute_value[],
            current: product_attribute_value[] = [],
            index = 0,
        ): product_attribute_value[][] => {
            if (index === attributes.length) {
                return [current];
            }

            const attribute = attributes[index];
            const attributeValues =
                values?.filter(
                    (v) => v.product_attribute_type_id === attribute?.id,
                ) || [];

            const combinations: product_attribute_value[][] = [];

            for (const value of attributeValues) {
                combinations.push(
                    ...generateCombinations(
                        attributes,
                        values,
                        [...current, value],
                        index + 1,
                    ),
                );
            }

            return combinations;
        };

        const combinations = generateCombinations(
            selectedAttributes,
            selectedOptions,
        );

        const newVariants = combinations.map((combination, index) => ({
            id: `variant-${index}`,
            product_attribute_options: combination,
            sku: `PROD-${index + 1}`,
            min_qty: 1,
            og_price: 0,
            min_price: 0,
            avg_price: 0,
            max_price: 0,
            image_url: [],
            available: false,
        }));

        onVariantsGenerated(newVariants);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Attributes</h2>
                <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={isLoading || !product_category_id}
                    onClick={() => onOpen("addAttribute", {})}
                >
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {selectedAttributes.map((attribute) => (
                    <AttributeCard
                        selectedValue={selectedOptions?.filter(
                            (atr) =>
                                atr.product_attribute_type_id == attribute?.id,
                        )}
                        key={attribute.id}
                        attribute={attribute}
                        onRemoveAttribute={() => removeAttribute(attribute.id)}
                        onRemoveValue={handleRemoveValue}
                    />
                ))}
            </div>

            {selectedAttributes?.length > 0 && (
                <Button
                    type="button"
                    className="w-full mt-4"
                    onClick={() => generateVariants()}
                >
                    Generate Variants
                </Button>
            )}

            <AddProductAttributeModal
                product_category_id={product_category_id}
                selectedAttributes={selectedAttributes}
                setSelectedAttributes={setSelectedAttributes}
            />
            <AddProductAttributeValueModal
                selectedOptions={selectedOptions}
                onSelect={handleAttributeValueSelect}
            />
        </div>
    );
}
