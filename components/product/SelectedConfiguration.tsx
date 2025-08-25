import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ProductItemTypeWithAttribute } from "@/types/types";

interface SelectedConfigurationProps {
    selectedVariant: ProductItemTypeWithAttribute;
    qty: number | null;
}

export default function SelectedConfiguration({
    selectedVariant,
    qty,
}: SelectedConfigurationProps) {
    return (
        <Card className="bg-white shadow-md border-0 rounded-xl overflow-hidden">
            <div className="p-4">
                <h3 className="font-semibold mb-3 flex items-center text-gray-800 text-sm">
                    <Check className="w-4 h-4 mr-2 text-primary" />
                    Selected Configuration
                </h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {selectedVariant.productAttributeOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-primary"></div>
                            <span className="text-gray-500 capitalize text-xs">
                                {opt.productAttributeType.name}:
                            </span>
                            <span className="font-medium text-xs text-gray-800">
                                {opt.productAttributeValue}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-1">
                        <div className="h-1 w-1 rounded-full bg-primary"></div>
                        <span className="text-gray-500 text-xs">SKU:</span>
                        <span className="font-medium text-xs text-gray-800">
                            {selectedVariant.sku}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-1 w-1 rounded-full bg-primary"></div>
                        <span className="text-gray-500 text-xs">Quantity:</span>
                        <span className="font-medium text-xs text-gray-800">
                            {qty} units
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
