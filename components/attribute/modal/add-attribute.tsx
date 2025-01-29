import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { ProductAttributeTypeSchema } from "@/schemas/product-attribute-type";
import { product_attribute_type } from "@prisma/client";
import { useState } from "react";
import { z } from "zod";

export const AddAttributeModal = ({
    product_attribute_types,
    add_product_attribute_type,
    product_category_id,
}: {
    product_attribute_types: product_attribute_type[];
    product_category_id: number;
    add_product_attribute_type: (
        data: z.infer<typeof ProductAttributeTypeSchema>,
    ) => void;
}) => {
    const { isOpen, onClose, modal } = useModal();
    const isModalOpen = modal === "addAttribute" && isOpen;
    const [newAttribute, setNewAttribute] = useState("");

    const handleCreateAttribute = () => {
        if (newAttribute.trim()) {
            const newId = Math.max(...tempAttributes.map((a) => a.id), 0) + 1;
            const attribute = { id: newId, name: newAttribute.trim() };
            tempAttributes.push(attribute);
            addAttribute(attribute);
            setNewAttribute("");
        }
    };

    const handleCreateValue = () => {
        if (currentAttributeId && newValue.trim()) {
            const value = newValue.trim();
            if (!tempAttributeValues[currentAttributeId]) {
                tempAttributeValues[currentAttributeId] = [];
            }
            tempAttributeValues[currentAttributeId].push(value);
            addValueToAttribute(currentAttributeId, value);
            setNewValue("");
        }
    };

    return (
        <Modal title="Add Attribute" isOpen={isModalOpen} onClose={onClose}>
            <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="New attribute name"
                        value={newAttribute}
                        onChange={(e) => setNewAttribute(e.target.value)}
                    />
                    <Button
                        onClick={() =>
                            add_product_attribute_type({
                                name: newAttribute,
                                product_category_id,
                            })
                        }
                    >
                        Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {product_attribute_types.map((attribute) => (
                        <div
                            key={attribute.id}
                            className="flex items-center justify-between p-2 border rounded"
                        >
                            <span>{attribute.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addAttribute(attribute)}
                            >
                                Select
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
