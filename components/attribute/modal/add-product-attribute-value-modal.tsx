"use client";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { useProductAttributeValue } from "@/hooks/use-product-attribute-value";
import { product_attribute_value } from "@prisma/client";
import { Check, Loader2, Trash } from "lucide-react";
import { useCallback, useState } from "react";

export const AddProductAttributeValueModal = ({
    onSelect,
    selectedOptions,
}: {
    selectedOptions: product_attribute_value[];
    onSelect: (value: product_attribute_value) => void;
}) => {
    const { modal, isOpen, onClose, data } = useModal();
    const isModalOpen = modal === "addAttributeValue" && isOpen;
    const [newAttributeValue, setNewAttributeValue] = useState("");

    const {
        ProductAttributeValues,
        isLoading,
        createProductAttributeValue,
        deleteProductAttributeValue,
    } = useProductAttributeValue(data?.productAttribute?.id);

    const getAvailableAttributeValues = useCallback(() => {
        return ProductAttributeValues?.filter(
            (v) => !selectedOptions?.includes(v),
        );
    }, [selectedOptions, ProductAttributeValues]);

    const handleCreateValue = () => {
        createProductAttributeValue.mutate({
            product_attribute_type_id: data?.productAttribute?.id as number,
            product_attribute_value: newAttributeValue,
        });

        setNewAttributeValue("");
    };

    return (
        <Modal
            title={`Add Value for ${data?.productAttribute?.name}`}
            isOpen={isModalOpen}
            onClose={onClose}
        >
            <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="New value"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                        disabled={createProductAttributeValue.isPending}
                    />
                    <Button onClick={() => handleCreateValue()}>
                        {createProductAttributeValue.isPending ? (
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
                        getAvailableAttributeValues()?.map((value) => (
                            <div
                                key={value?.id}
                                className="flex items-center justify-between p-2 border rounded"
                            >
                                <span>{value?.product_attribute_value}</span>
                                <div className="flex items-center gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            deleteProductAttributeValue.mutate(
                                                value?.id,
                                            )
                                        }
                                    >
                                        {deleteProductAttributeValue?.isPending ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <Trash />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onSelect(value)}
                                    >
                                        <Check />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};
