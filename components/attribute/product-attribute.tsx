"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Loader2, PlusCircle, Trash, X } from "lucide-react";
import { AttributeCard } from "./attribute-card";
import {
    product_attribute_type,
    product_attribute_value,
} from "@prisma/client";
import { ProductAttributeTypeSchema } from "@/schemas/product-attribute-type";
import { z } from "zod";
import { toast } from "sonner";

export interface Variant {
    id: string;
    combinations: product_attribute_value[];
    product_code: string;
    min_qty: number;
    min_price: number;
    avg_price: number;
    max_price: number;
    image_url: string[];
    available: boolean;
}

interface ProductAttributesProps {
    onVariantsGenerated: (variants: Variant[]) => void;
    product_category_id: number;
    isLoading: boolean;
    avialable_product_attribute_types: product_attribute_type[];
    createProductAttribute: (
        data: z.infer<typeof ProductAttributeTypeSchema>,
    ) => Promise<void>;
    isProductAttributeCreating: boolean;
    deleteProductAttributeType: (
        product_attribute_type_id: number,
    ) => Promise<void>;
    isAttributeDeleting: boolean;
}

export function ProductAttributes({
    onVariantsGenerated,
    isLoading,
    product_category_id,
    avialable_product_attribute_types,
    createProductAttribute,
    deleteProductAttributeType,
    isAttributeDeleting,
    isProductAttributeCreating,
}: ProductAttributesProps) {
    const [selectedAttributes, setSelectedAttributes] = useState<
        product_attribute_type[]
    >([]);

    const [selectedValues, setSelectedValues] = useState<
        Record<number, string[]>
    >({});
    const [newAttribute, setNewAttribute] = useState("");
    const [newValue, setNewValue] = useState("");
    const [currentAttributeId, setCurrentAttributeId] = useState<number | null>(
        null,
    );

    const getAvailableAttributes = useCallback(() => {
        return avialable_product_attribute_types?.filter(
            (attr) =>
                !selectedAttributes.some((selected) => selected.id === attr.id),
        );
    }, [
        selectedAttributes,
        avialable_product_attribute_types,
        product_category_id,
    ]);

    const handleCreateAttribute = async () => {
        if (newAttribute.trim()) {
            await createProductAttribute({
                product_category_id: product_category_id,
                name: newAttribute.trim(),
            });
            setNewAttribute("");
            toast.success("Product product_attribute_type Created.");
        }
    };

    const selectAttributeHandler = useCallback(
        (attribute: product_attribute_type) => {
            setSelectedAttributes((prev) => [...prev, attribute]);
        },
        [],
    );

    // const getAvailableValues = useCallback(
    //     (attributeId: number) => {
    //         const allValues =
    //             avialable_product_attribute_types[attributeId] || [];
    //         const selectedValuesForAttr = selectedValues[attributeId] || [];
    //         return allValues?.filter(
    //             (value) => !selectedValuesForAttr.includes(value),
    //         );
    //     },
    //     [selectedValues],
    // );

    // const generateVariants = () => {
    //     const generateCombinations = (
    //         attributes: product_attribute_type[],
    //         values: Record<number, string[]>,
    //         current: product_attribute_value[] = [],
    //         index = 0,
    //     ): product_attribute_value[][] => {
    //         if (index === attributes.length) {
    //             return [current];
    //         }

    //         const attribute = attributes[index];
    //         const attributeValues = values[attribute.id] || [];
    //         const combinations: product_attribute_value[][] = [];

    //         for (const value of attributeValues) {
    //             combinations.push(
    //                 ...generateCombinations(
    //                     attributes,
    //                     values,
    //                     [...current, { attributeId: attribute.id, value }],
    //                     index + 1,
    //                 ),
    //             );
    //         }

    //         return combinations;
    //     };

    //     const combinations = generateCombinations(
    //         selectedAttributes,
    //         selectedValues,
    //     );
    //     const newVariants = combinations.map((combination, index) => ({
    //         id: `variant-${index}`,
    //         combinations: combination,
    //         product_code: `PROD-${index + 1}`,
    //         min_qty: 1,
    //         min_price: 0,
    //         avg_price: 0,
    //         max_price: 0,
    //         image_url: [""],
    //         available: true,
    //     }));

    //     onVariantsGenerated(newVariants);
    // };

    // const addValueToAttribute = useCallback(
    //     (attributeId: number, value: string) => {
    //         setSelectedValues((prev) => ({
    //             ...prev,
    //             [attributeId]: [...(prev[attributeId] || []), value],
    //         }));
    //     },
    //     [],
    // );

    const handleCreateValue = () => {
        if (currentAttributeId && newValue.trim()) {
            const value = newValue.trim();
            if (!avialable_product_attribute_types[currentAttributeId]) {
                avialable_product_attribute_types[currentAttributeId] = [];
            }
            avialable_product_attribute_types[currentAttributeId].push(value);
            addValueToAttribute(currentAttributeId, value);
            setNewValue("");
        }
    };

    const removeAttribute = useCallback((attributeId: number) => {
        setSelectedAttributes((prev) =>
            prev.filter((a) => a.id !== attributeId),
        );
        setSelectedValues((prev) => {
            const newValues = { ...prev };
            delete newValues[attributeId];
            return newValues;
        });
    }, []);

    const removeValue = useCallback((attributeId: number, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [attributeId]: prev[attributeId].filter((v) => v !== value),
        }));
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Attributes</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading || !product_category_id}
                        >
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Add Product Attribute
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="New attribute name"
                                    value={newAttribute}
                                    disabled={
                                        isLoading || isProductAttributeCreating
                                    }
                                    onChange={(e) =>
                                        setNewAttribute(e.target.value)
                                    }
                                />
                                <Button
                                    onClick={handleCreateAttribute}
                                    disabled={
                                        isLoading || isProductAttributeCreating
                                    }
                                >
                                    {isProductAttributeCreating ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Add"
                                    )}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {getAvailableAttributes()?.map((attribute) => (
                                    <div
                                        key={attribute.id}
                                        className="flex items-center justify-between p-2 border rounded"
                                    >
                                        <span>{attribute.name}</span>
                                        <div className="flex items-center justify-center gap-5">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    deleteProductAttributeType(
                                                        attribute?.id,
                                                    )
                                                }
                                                disabled={
                                                    isLoading ||
                                                    isAttributeDeleting
                                                }
                                            >
                                                <Trash />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    selectAttributeHandler(
                                                        attribute,
                                                    )
                                                }
                                            >
                                                <Check />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {selectedAttributes.map((attribute) => (
                    <AttributeCard
                        key={attribute.id}
                        attribute={attribute}
                        selectedValues={selectedValues[attribute.id] || []}
                        onRemoveAttribute={() => removeAttribute(attribute.id)}
                        onRemoveValue={(value) =>
                            removeValue(attribute.id, value)
                        }
                        onAddValue={(value) => {
                            setCurrentAttributeId(attribute.id);
                            // addValueToAttribute(attribute.id, value);
                        }}
                        // availableValues={getAvailableValues(attribute.id)}
                    />
                ))}
            </div>

            {selectedAttributes.length > 0 && (
                <Button
                    type="button"
                    // onClick={generateVariants}
                    className="w-full mt-4"
                >
                    Generate Variants
                </Button>
            )}
        </div>
    );
}
