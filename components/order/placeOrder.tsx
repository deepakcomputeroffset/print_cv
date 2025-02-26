"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductItemType } from "@/types/types";
import { productAttributeValue } from "@prisma/client";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import { createOrder } from "@/lib/api/order";

export default function PlaceOrder({
    product,
}: {
    product: ProductItemType & {
        productAttributeOptions: productAttributeValue[];
        product: {
            name: string;
            categoryId: number;
            description: string;
            imageUrl: string[];
        };
        price: number;
        qty: number;
    };
}) {
    const [qty, setQty] = useState(product.qty);
    const [file, setFile] = useState<File | null>(null);
    const { data: wallet } = useWallet();
    const handleIncrease = () => setQty(qty + product.minQty);
    const handleDecrease = () => {
        if (qty > product.minQty) setQty(qty - product.minQty);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleCheckout = async () => {
        if (!file) {
            toast.warning("Please upload a required file");
            return;
        }

        if (!wallet?.balance || wallet?.balance <= product?.price) {
            toast.warning("You don't have sufficient balance.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productItemId", product.id.toString());
        formData.append("qty", qty.toString());
        const { data: res } = await createOrder(formData);
        if (res?.success) {
            toast.success("order successfully created.");
            // router.back();
        }
    };

    return (
        <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-xl bg-gray-50">
            <CardHeader>
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <img
                        src={product?.product?.imageUrl[0]}
                        alt={product.product.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {product.product.name}
                        </h3>
                        <p className="text-lg text-gray-700 font-medium">
                            ${product.price}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.productAttributeOptions.map((option) => (
                                <Badge
                                    key={option.id}
                                    className="text-sm px-3 py-1 bg-gray-200 text-gray-700"
                                >
                                    {option.productAttributeValue}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                    <Button
                        onClick={handleDecrease}
                        className="px-4 py-2 text-lg"
                        variant={"ghost"}
                    >
                        -
                    </Button>
                    <span className="text-xl font-semibold">{qty}</span>
                    <Button
                        onClick={handleIncrease}
                        variant={"ghost"}
                        className="px-4 py-2 text-lg"
                    >
                        +
                    </Button>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload File (Required)
                    </label>
                    <Input
                        type="file"
                        onChange={(e) => handleFileChange(e)}
                        accept=".pdf"
                        className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>
                <Button
                    onClick={handleCheckout}
                    className="mt-8 w-full py-3 text-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Checkout
                </Button>
            </CardContent>
        </Card>
    );
}
