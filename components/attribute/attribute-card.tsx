"use client";

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
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { product_attribute_type } from "@prisma/client";

interface AttributeCardProps {
    attribute: product_attribute_type;
    selectedValues: string[];
    onRemoveAttribute: () => void;
    onRemoveValue: (value: string) => void;
    onAddValue: (value: string) => void;
    availableValues?: string[];
}

export function AttributeCard({
    attribute,
    selectedValues,
    onRemoveAttribute,
    onRemoveValue,
    onAddValue,
    availableValues,
}: AttributeCardProps) {
    const [newValue, setNewValue] = useState("");

    const handleCreateValue = () => {
        if (newValue.trim()) {
            onAddValue(newValue.trim());
            setNewValue("");
        }
    };

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
                        {selectedValues.map((value) => (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {value}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => onRemoveValue(value)}
                                />
                            </Badge>
                        ))}
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Value
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add Value for {attribute.name}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="New value"
                                        value={newValue}
                                        onChange={(e) =>
                                            setNewValue(e.target.value)
                                        }
                                    />
                                    <Button onClick={handleCreateValue}>
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {availableValues?.map((value) => (
                                        <div
                                            key={value}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <span>{value}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onAddValue(value)
                                                }
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
