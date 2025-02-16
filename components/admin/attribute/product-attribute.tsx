"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddProductAttributeModal } from "./modal/add-product-attribute-modal";
import { useModal } from "@/hooks/use-modal";
import { AddProductAttributeValueModal } from "./modal/add-product-attribute-value-modal";
import { AttributeCard } from "./attribute-card";
import { productAttributeType, productAttributeValue } from "@prisma/client";

interface ProductAttributesProps {
    productCategoryId: number;
    isLoading: boolean;
    selectedAttributes: productAttributeType[];
    setSelectedAttributes: Dispatch<SetStateAction<productAttributeType[]>>;
    selectedOptions: productAttributeValue[];
    setSelectedOptions: Dispatch<SetStateAction<productAttributeValue[]>>;
}

export function ProductAttributes({
    isLoading,
    productCategoryId,
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
        setSelectedOptions((prev) => {
            return prev.filter((v) => v.productAttributeTypeId !== attributeId);
        });
    }, []);

    const handleAttributeValueSelect = (v: productAttributeValue) => {
        if (selectedOptions.includes(v)) return;
        setSelectedOptions((prev) => [...prev, v]);
    };

    const handleRemoveValue = useCallback((value: productAttributeValue) => {
        setSelectedOptions((prev) => {
            return prev.filter((v) => v.id != value?.id);
        });
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Attributes</h2>
                <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={isLoading || !productCategoryId}
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
                                atr.productAttributeTypeId == attribute?.id,
                        )}
                        key={attribute.id}
                        attribute={attribute}
                        onRemoveAttribute={() => removeAttribute(attribute.id)}
                        onRemoveValue={handleRemoveValue}
                    />
                ))}
            </div>

            <AddProductAttributeModal
                productCategoryId={productCategoryId}
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
