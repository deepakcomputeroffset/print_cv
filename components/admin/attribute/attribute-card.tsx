"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productAttributeType, productAttributeValue } from "@prisma/client";

interface AttributeCardProps {
    attribute: productAttributeType;
    onRemoveAttribute: () => void;
    selectedValue: productAttributeValue[];
    onRemoveValue: (v: productAttributeValue) => void;
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
                        type="button"
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
                                {value?.productAttributeValue}
                                <X className="h-3 w-3 cursor-pointer" />
                            </Badge>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
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
