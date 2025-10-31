import { product } from "@prisma/client";
import { UPLOADVIA } from "@prisma/client";
import {
    productAttributeWithOptions,
    ProductItemTypeWithAttribute,
} from "@/types/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProductOptionsProps {
    distinctAttributeWithOptions: productAttributeWithOptions[];
    selectedAttributes: Record<number, number>;
    onAttributeChange: (typeId: number, valueId: number) => void;
    product: product & {
        productItems: ProductItemTypeWithAttribute[];
    };
    qty: number | null;
    onQtyChange: (qty: number | null) => void;
    selectedVariant: ProductItemTypeWithAttribute | null;
    fileOption: UPLOADVIA;
    onFileOptionChange: (option: UPLOADVIA) => void;
}

export default function ProductOptions({
    distinctAttributeWithOptions,
    selectedAttributes,
    onAttributeChange,
    product,
    qty,
    onQtyChange,
    selectedVariant,
    fileOption,
    onFileOptionChange,
}: ProductOptionsProps) {
    const handleQtyChange = (value: string) => {
        if (value === "") {
            onQtyChange(null);
            return;
        }

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            onQtyChange(numValue);
        }
    };

    const handleQtyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = parseInt(e.target.value);
        const minQty = selectedVariant?.pricing?.[0]?.qty || 1;

        if (e.target.value === "" || inputValue < minQty) {
            onQtyChange(minQty);
            toast.message(`Minimum quantity is ${minQty}`);
        } else {
            const validQty = Math.round(inputValue / minQty) * minQty;
            if (validQty !== inputValue) {
                onQtyChange(validQty);
                toast.message(
                    `Quantity adjusted to nearest multiple: ${validQty}`,
                );
            }
        }
    };

    // Determine if a given option is available given the current selections
    // const isOptionAvailable = (typeId: number, optionId: number) => {
    //     // Find any productItem that contains this option and matches all other selected attributes
    //     return product.productItems.some((item) => {
    //         // Item must include the candidate option for the current type
    //         const hasCandidateOption = item.productAttributeOptions.some(
    //             (opt) =>
    //                 opt.productAttributeType.id === typeId &&
    //                 opt.id === optionId,
    //         );

    //         if (!hasCandidateOption) return false;

    //         // And it must match all other selected attributes
    //         return Object.entries(selectedAttributes).every(([tId, vId]) => {
    //             const tid = parseInt(tId);
    //             if (tid === typeId) return true; // skip current type
    //             return item.productAttributeOptions.some(
    //                 (opt) =>
    //                     opt.productAttributeType.id === tid && opt.id === vId,
    //             );
    //         });
    //     });
    // };

    return (
        <>
            {distinctAttributeWithOptions?.map((type) => (
                <div key={type.id}>
                    <label className="text-xs font-medium mb-1 block text-gray-700">
                        {type.name}
                    </label>
                    <Select
                        value={selectedAttributes[type.id]?.toString()}
                        onValueChange={(value) =>
                            onAttributeChange(type.id, parseInt(value))
                        }
                    >
                        <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9">
                            <SelectValue placeholder={`Select ${type.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {type?.productAttributeOptions?.map((opt) => (
                                <SelectItem
                                    key={opt.id}
                                    value={opt?.id?.toString()}
                                    // disabled={!isOptionAvailable(type.id, opt.id)}
                                >
                                    {opt?.productAttributeValue}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}

            <div>
                <label className="text-xs font-medium mb-1 block text-gray-700">
                    Quantity
                </label>
                {product?.isTieredPricing ? (
                    <div className="flex items-center gap-2">
                        <Select
                            value={qty?.toString() ?? ""}
                            onValueChange={(value) =>
                                onQtyChange(Number(value))
                            }
                        >
                            <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9">
                                <SelectValue placeholder={`Select Qty`} />
                            </SelectTrigger>
                            <SelectContent>
                                {product?.productItems?.[0]?.pricing?.map(
                                    (pricing) => (
                                        <SelectItem
                                            key={pricing.id}
                                            value={pricing?.qty?.toString()}
                                        >
                                            {pricing?.qty}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min={selectedVariant?.pricing?.[0]?.qty}
                            value={qty ?? ""}
                            step={selectedVariant?.pricing?.[0]?.qty}
                            placeholder="0"
                            onChange={(e) => handleQtyChange(e.target.value)}
                            onBlur={handleQtyBlur}
                            className="w-24 border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9 text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            Min: {selectedVariant?.pricing?.[0]?.qty} (in
                            multiples of {selectedVariant?.pricing?.[0]?.qty})
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label className="text-xs font-medium mb-1 block text-gray-700">
                    File Option
                </label>
                <RadioGroup
                    defaultValue="UPLOAD"
                    className="flex"
                    value={fileOption}
                    onValueChange={(e) => onFileOptionChange(e as UPLOADVIA)}
                >
                    <div className="inline-flex items-center gap-3">
                        <RadioGroupItem value="UPLOAD" id="upload" />
                        <Label htmlFor="upload" className="cursor-pointer">
                            Upload
                        </Label>
                    </div>
                    <div className="inline-flex items-center gap-3">
                        <RadioGroupItem value="EMAIL" id="email" />
                        <Label htmlFor="email" className="cursor-pointer">
                            Email
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </>
    );
}
