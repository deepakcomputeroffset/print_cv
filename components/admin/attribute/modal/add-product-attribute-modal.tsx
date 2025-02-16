"use client";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { useProductAttributeType } from "@/hooks/use-product-attribute";
import { productAttributeType } from "@prisma/client";
import { Check, Loader2, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface propsType {
    productCategoryId: number;
    selectedAttributes: productAttributeType[];
    setSelectedAttributes: Dispatch<SetStateAction<productAttributeType[]>>;
}

export const AddProductAttributeModal = ({
    productCategoryId,
    selectedAttributes,
    setSelectedAttributes,
}: propsType) => {
    const { isOpen, modal, onClose } = useModal();
    const isModalOpen = modal === "addAttribute" && isOpen;
    const [newAttribute, setNewAttribute] = useState("");

    const { ProductAttributeTypes, createProductAttributeType, isLoading } =
        useProductAttributeType(productCategoryId);

    const getAvailableAttributes = useCallback(() => {
        return ProductAttributeTypes?.filter(
            (attr) =>
                !selectedAttributes.some((selected) => selected.id === attr.id),
        );
    }, [selectedAttributes, ProductAttributeTypes, productCategoryId]);

    const handleCreateAttribute = async () => {
        if (newAttribute.trim()) {
            await createProductAttributeType.mutateAsync({
                productCategoryId: productCategoryId,
                name: newAttribute.trim(),
            });
            setNewAttribute("");
        }
    };

    const selectAttributeHandler = useCallback(
        (attribute: productAttributeType) => {
            setSelectedAttributes((prev) => [...prev, attribute]);
        },
        [],
    );

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onClose}
            title="Add Product Attribute"
        >
            <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="New attribute name"
                        value={newAttribute}
                        disabled={createProductAttributeType.isPending}
                        onChange={(e) => setNewAttribute(e.target.value)}
                    />
                    <Button
                        onClick={handleCreateAttribute}
                        disabled={createProductAttributeType.isPending}
                    >
                        {createProductAttributeType.isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Add"
                        )}
                    </Button>
                </div>
                <div className="space-y-2">
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        getAvailableAttributes()?.map((attribute) => (
                            <ProductAttribute
                                key={attribute.id}
                                productAttribute={attribute}
                                productCategoryId={productCategoryId}
                                selectHandler={selectAttributeHandler}
                            />
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};

const ProductAttribute = ({
    productAttribute,
    productCategoryId,
    selectHandler,
}: {
    productAttribute: productAttributeType;
    productCategoryId: number;
    selectHandler: (value: productAttributeType) => void;
}) => {
    const { deleteProductAttributeType } =
        useProductAttributeType(productCategoryId);
    return (
        <div
            key={productAttribute.id}
            className="flex items-center justify-between p-2 border rounded"
        >
            <span>{productAttribute.name}</span>
            <div className="flex items-center justify-center gap-5">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        deleteProductAttributeType.mutate(productAttribute?.id)
                    }
                    disabled={deleteProductAttributeType?.isPending}
                >
                    <Trash />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => selectHandler(productAttribute)}
                >
                    <Check />
                </Button>
            </div>
        </div>
    );
};
