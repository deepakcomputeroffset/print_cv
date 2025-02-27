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
import { IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const { data: wallet, refetch } = useWallet();
    const router = useRouter();

    const totalPrice = product.price * (qty / product?.minQty);

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

        if (!wallet?.balance || wallet?.balance < totalPrice) {
            toast.warning("You don't have sufficient balance.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productItemId", product.id.toString());
        formData.append("qty", qty.toString());

        const { data: res } = await createOrder(formData);
        if (res?.success) {
            toast.success("Order successfully created.");
            router.back();
            refetch();
        }
    };

    return (
        <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-xl rounded-2xl bg-white border border-gray-200">
            <CardHeader>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center">
                    Checkout
                </h2>
            </CardHeader>
            <CardContent>
                {/* Product Details Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-4">
                    <img
                        src={product?.product?.imageUrl[0]}
                        alt={product.product.name}
                        className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                    />
                    <div className="text-center md:text-left">
                        <h3 className="text-lg md:text-2xl font-semibold text-gray-800">
                            {product.product.name}
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 font-medium flex items-center justify-center md:justify-start">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {totalPrice}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                            {product.productAttributeOptions.map((option) => (
                                <Badge
                                    key={option.id}
                                    className="text-xs md:text-sm px-3 py-1 bg-gray-200 text-gray-700 hover:text-white rounded-full"
                                >
                                    {option.productAttributeValue}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                    <Button
                        onClick={handleDecrease}
                        className="px-4 py-2 text-lg bg-gray-100"
                        variant="ghost"
                    >
                        -
                    </Button>
                    <span className="text-xl md:text-2xl font-bold">{qty}</span>
                    <Button
                        onClick={handleIncrease}
                        className="px-4 py-2 text-lg bg-gray-100"
                        variant="ghost"
                    >
                        +
                    </Button>
                </div>

                {/* File Upload */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload File (Required)
                    </label>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="mt-2 border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                {/* Checkout Button */}
                <Button
                    onClick={handleCheckout}
                    className="mt-6 w-full py-4 text-lg"
                    variant="redish"
                >
                    Checkout
                </Button>
            </CardContent>
        </Card>
    );
}
