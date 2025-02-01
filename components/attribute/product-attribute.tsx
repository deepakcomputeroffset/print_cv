"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AttributeCard } from "./product-attribute-card";
import { productAttributeWithOptions, ProductVariantType } from "@/types/types";
import { AddProductAttributeModal } from "./modal/add-product-attribute-modal";
import { useModal } from "@/hooks/use-modal";

interface ProductAttributesProps {
    onVariantsGenerated: (variants: ProductVariantType[]) => void;
    product_category_id: number;
    isLoading: boolean;
}

export function ProductAttributes({
    onVariantsGenerated,
    isLoading,
    product_category_id,
}: ProductAttributesProps) {
    const [selectedAttributes, setSelectedAttributes] = useState<
        productAttributeWithOptions[]
    >([]);

    const removeAttribute = useCallback((attributeId: number) => {
        setSelectedAttributes((prev) =>
            prev.filter((a) => a.id !== attributeId),
        );
    }, []);

    const { onOpen } = useModal();
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Attributes</h2>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || !product_category_id}
                    onClick={() => onOpen("addAttribute", {})}
                >
                    <PlusCircle className="h-4 w-4" />
                </Button>
                <AddProductAttributeModal
                    product_category_id={product_category_id}
                    selectedAttributes={selectedAttributes}
                    setSelectedAttributes={setSelectedAttributes}
                />
            </div>

            <div className="space-y-4">
                {selectedAttributes.map((attribute) => (
                    <AttributeCard
                        key={attribute.id}
                        attribute={attribute}
                        onRemoveAttribute={() => removeAttribute(attribute.id)}
                    />
                ))}
            </div>

            {selectedAttributes.length > 0 && (
                <Button type="button" className="w-full mt-4">
                    Generate Variants
                </Button>
            )}
        </div>
    );
}
