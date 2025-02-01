"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { productAttributeWithOptions } from "@/types/types";
import { useModal } from "@/hooks/use-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { product_attribute_value } from "@prisma/client";

interface AttributeCardProps {
    attribute: productAttributeWithOptions;
    onRemoveAttribute: () => void;
    selectedValue: product_attribute_value[];
    onRemoveValue: (v: product_attribute_value) => void;
}

export function AttributeCard({
    attribute,
    onRemoveAttribute,
    selectedValue,
    onRemoveValue,
}: AttributeCardProps) {
    const { onOpen } = useModal();

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{attribute.name}</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemoveAttribute}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {selectedValue?.map((value) => (
                            <Badge
                                key={value.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                                onClick={() => onRemoveValue(value)}
                            >
                                {value?.product_attribute_value}
                                <X className="h-3 w-3 cursor-pointer" />
                            </Badge>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onOpen("addAttributeValue", {
                                productAttribute: attribute,
                            })
                        }
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Value
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
