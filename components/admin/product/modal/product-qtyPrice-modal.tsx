import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

export default function ProductQtyPrice({
    addQtyPriceHandler,
    removeQtyPriceHandler,
    pricing,
}: {
    addQtyPriceHandler: ({
        qty,
        price,
    }: {
        qty: number;
        price: number;
    }) => void;
    removeQtyPriceHandler: (qty: number) => void;
    pricing: {
        qty: number;
        price: number;
    }[];
}) {
    const [qtyPrice, setQtyPrice] = useState<{ qty: number; price: number }>({
        qty: 0,
        price: 0,
    });

    return (
        <div>
            <Dialog onOpenChange={() => setQtyPrice({ qty: 0, price: 0 })}>
                <DialogTrigger className="w-full" asChild>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Product Price And Quantity
                        </h2>
                        <Button variant="outline" size="sm" type="button">
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Quantity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-8">
                        <div>
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                value={qtyPrice.qty}
                                onChange={(e) =>
                                    setQtyPrice({
                                        ...qtyPrice,
                                        qty: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                value={qtyPrice.price}
                                onChange={(e) =>
                                    setQtyPrice({
                                        ...qtyPrice,
                                        price: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <Button
                            onClick={() => addQtyPriceHandler(qtyPrice)}
                            className="w-full"
                        >
                            Add
                        </Button>
                    </div>
                    <DialogDescription>
                        Add quantity with pricing
                    </DialogDescription>
                </DialogContent>
            </Dialog>
            <div className="flex flex-wrap gap-2">
                {pricing?.map((value) => (
                    <Badge
                        key={value?.qty}
                        variant="secondary"
                        className="flex items-center gap-1"
                        onClick={() => removeQtyPriceHandler(value.qty)}
                    >
                        {value?.qty}: {value?.price}
                        <X className="h-3 w-3 cursor-pointer" />
                    </Badge>
                ))}
            </div>
        </div>
    );
}
