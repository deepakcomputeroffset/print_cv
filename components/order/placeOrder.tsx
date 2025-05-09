"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    product,
    productAttributeValue,
    productItem,
    UPLOADVIA,
} from "@prisma/client";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import { createOrder } from "@/lib/api/order";
import {
    IndianRupee,
    Loader2,
    FileText,
    Mail,
    ArrowRight,
    Check,
    Shield,
    Calendar,
    Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
    FILE_UPLOAD_EMAIL_CHARGE,
    IGST_TAX_IN_PERCENTAGE,
} from "@/lib/constants";
import Image from "next/image";

export default function PlaceOrder({
    product,
}: {
    product: Omit<productItem, "ogPrice"> & {
        productAttributeOptions: productAttributeValue[];
        product: Pick<
            product,
            "categoryId" | "name" | "description" | "imageUrl"
        >;
        qty: number;
    };
}) {
    const [uploadType, setUploadType] = useState<UPLOADVIA>("UPLOAD");
    const [qty, setQty] = useState(product.qty);
    const [files, setFiles] = useState<File[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { refetch } = useWallet();
    const router = useRouter();

    // Price calculations with taxes
    const basePrice = product.price * (qty / product?.minQty);
    const emailUploadCharge =
        uploadType === "EMAIL" ? FILE_UPLOAD_EMAIL_CHARGE : 0;
    const igstAmount = basePrice * IGST_TAX_IN_PERCENTAGE;
    const totalPrice = basePrice + emailUploadCharge + igstAmount;

    const handleIncrease = () => setQty(qty + product.minQty);
    const handleDecrease = () => {
        if (qty > product.minQty) setQty(qty - product.minQty);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...e.target.files]);
        }
    };

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            if (uploadType === "UPLOAD") {
                if (!files) {
                    toast.warning("Please upload a required file");
                    return;
                }
                files.forEach((file) => {
                    formData.append("file", file);
                });
                formData.delete("uploadType");
                formData.append("uploadType", "UPLOAD");
            } else {
                formData.delete("uploadType");
                formData.append("uploadType", "EMAIL");
            }

            formData.append("productItemId", product.id.toString());
            formData.append("qty", qty.toString());

            const { data: res } = await createOrder(formData);
            if (res?.success) {
                toast.success(res?.message);
                router.back();
                refetch();
            } else {
                toast.warning(res.message);
            }
        } catch (error) {
            toast.warning(
                error instanceof AxiosError
                    ? error.response?.data?.error
                    : "Order not placed.",
            );
            console.log(
                error instanceof AxiosError
                    ? error.response?.data?.error
                    : "Order not placed.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <Card className="overflow-hidden border-0 shadow-xl rounded-2xl relative">
                {/* Premium accent line at top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary"></div>

                {/* Subtle pattern overlay for texture */}
                <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.02] mix-blend-overlay z-0 pointer-events-none"></div>

                <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white py-6 px-8 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full translate-y-20 -translate-x-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold">
                                Premium Checkout
                            </h2>
                            <p className="text-white/80 mt-1">
                                Complete your order details below
                            </p>
                        </motion.div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                        {/* Left column - Product details */}
                        <div className="md:col-span-2 p-6 md:p-8 relative">
                            {/* Product details section with image */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col md:flex-row gap-6 pb-6"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500 group-hover:duration-200"></div>
                                    <div className="relative">
                                        <Image
                                            src={product?.product?.imageUrl[0]}
                                            alt={product.product.name}
                                            className="w-full md:w-40 h-40 object-cover rounded-xl shadow-md border border-gray-100 transition-transform duration-500 group-hover:scale-[1.02]"
                                            width={160}
                                            height={160}
                                        />
                                        <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-primary to-primary/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                                            Premium
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                                        {product?.product?.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        sku: {product?.sku}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product?.productAttributeOptions?.map(
                                            (option) => (
                                                <Badge
                                                    key={option?.id}
                                                    variant="outline"
                                                    className="bg-primary/5 text-primary border-primary/20"
                                                >
                                                    {
                                                        option?.productAttributeValue
                                                    }
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <Separator className="my-6" />

                            {/* Order benefits */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                            >
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300 group">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Truck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Fast Shipping
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Delivered to your doorstep
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300 group">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Quality Guarantee
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Premium printing quality
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300 group">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            On-time Delivery
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Meet your deadlines
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300 group">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Check className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Satisfaction
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            100% customer satisfaction
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quantity selection */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="space-y-4 mb-6"
                            >
                                <Label className="text-lg font-semibold text-gray-800 flex items-center">
                                    <div className="h-1 w-5 mr-2 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                    Quantity
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={handleDecrease}
                                        className={cn(
                                            "h-12 w-12 rounded-xl border-2",
                                            qty <= product.minQty
                                                ? "border-gray-200 text-gray-400"
                                                : "border-primary/20 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10",
                                        )}
                                        variant="outline"
                                        disabled={
                                            isLoading || qty <= product.minQty
                                        }
                                    >
                                        -
                                    </Button>
                                    <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                                        {qty}
                                    </span>
                                    <Button
                                        onClick={handleIncrease}
                                        className="h-12 w-12 rounded-xl border-2 border-primary/20 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10"
                                        variant="outline"
                                        disabled={isLoading}
                                    >
                                        +
                                    </Button>
                                    <span className="text-sm text-gray-500 ml-2">
                                        Min: {product.minQty} units
                                    </span>
                                </div>
                            </motion.div>

                            {/* Upload Method */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="space-y-4"
                            >
                                <Label className="text-lg font-semibold text-gray-800 flex items-center">
                                    <div className="h-1 w-5 mr-2 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                    Upload Method
                                </Label>
                                <RadioGroup
                                    defaultValue="UPLOAD"
                                    className="space-y-3"
                                    value={uploadType}
                                    onValueChange={(v) =>
                                        setUploadType(v as UPLOADVIA)
                                    }
                                >
                                    <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-300 border border-gray-200 group">
                                        <RadioGroupItem
                                            value="UPLOAD"
                                            id="upload"
                                            className="text-primary"
                                        />
                                        <Label
                                            htmlFor="upload"
                                            className="flex items-center gap-2 cursor-pointer w-full"
                                        >
                                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Upload File
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Upload your design in PDF
                                                    format
                                                </p>
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-300 border border-gray-200 group">
                                        <RadioGroupItem
                                            value="EMAIL"
                                            id="email"
                                            className="text-primary"
                                        />
                                        <Label
                                            htmlFor="email"
                                            className="flex items-center gap-2 cursor-pointer w-full"
                                        >
                                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Email Files Later
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    Additional charge of ₹20
                                                </p>
                                            </div>
                                            <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-100">
                                                +₹20
                                            </Badge>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </motion.div>

                            {/* File Upload */}
                            {uploadType === "UPLOAD" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6"
                                >
                                    <Label className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <div className="h-1 w-5 mr-2 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                        Upload Your File
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 group hover:border-primary/20">
                                        <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                            <FileText className="w-8 h-8 text-primary" />
                                        </div>

                                        {files &&
                                            files?.map((file, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-sm text-gray-600 mb-4"
                                                >
                                                    {file.name}
                                                </p>
                                            ))}
                                        {files?.length === 0 && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                Drag and drop your file here or
                                                click to browse
                                            </p>
                                        )}

                                        <Input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                            multiple
                                            className="cursor-pointer bg-white hover:bg-gray-100 transition-colors"
                                            disabled={isLoading}
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            Supported formats: PDF (Max size:
                                            10MB)
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right column - Order summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200 relative"
                        >
                            {/* Accent corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rotate-45 transform origin-top-right"></div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <div className="h-1 w-5 mr-2 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Base Price</span>
                                    <span className="flex items-center">
                                        <IndianRupee className="w-3.5 h-3.5 mr-1" />
                                        {basePrice.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>IGST (18%)</span>
                                    <span className="flex items-center">
                                        <IndianRupee className="w-3.5 h-3.5 mr-1" />
                                        {igstAmount.toFixed(2)}
                                    </span>
                                </div>
                                {emailUploadCharge > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Email Upload Charge</span>
                                        <span className="flex items-center">
                                            <IndianRupee className="w-3.5 h-3.5 mr-1" />
                                            {emailUploadCharge.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                    <span>Total Amount</span>
                                    <span className="flex items-center">
                                        <IndianRupee className="w-4 h-4 mr-1" />
                                        {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Order benefits summary */}
                            <div className="bg-white p-4 rounded-xl mb-6 border border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                    Order includes:
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-gray-600">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        Premium quality printing
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        Professional packaging
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        Doorstep delivery
                                    </li>
                                </ul>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                className={cn(
                                    "w-full h-14 text-lg mt-6 relative overflow-hidden group",
                                    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                                )}
                                disabled={
                                    isLoading ||
                                    (uploadType === "UPLOAD" &&
                                        files?.length === 0)
                                }
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute -inset-[400%] animate-[spin_10s_linear_infinite] bg-white/10 h-[50%] aspect-square rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                    </div>
                                </div>

                                <div className="relative">
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Place Order</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </div>
                            </Button>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    By placing this order, you agree to our
                                    <button className="text-primary hover:underline ml-1">
                                        Terms & Conditions
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
