"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UPLOAD_TYPE,
    order,
    productItem,
    product,
    productAttributeValue,
    uploadGroup,
} from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FileText, Upload, CheckCircle, FileImage } from "lucide-react";
import Image from "next/image";

interface OrderWithDetails extends order {
    productItem: productItem & {
        productAttributeOptions: productAttributeValue[];
        product: Pick<product, "name" | "imageUrl">;
        uploadGroup: uploadGroup | null;
    };
}

export default function FileUploadPage({ order }: { order: OrderWithDetails }) {
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const router = useRouter();

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        type: UPLOAD_TYPE,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles((prevFiles) => ({
                ...prevFiles,
                [type]: file,
            }));
        }
    };

    const handleUpload = async () => {
        try {
            setIsLoading(true);
            const uploadTypes =
                order.productItem.uploadGroup?.uploadTypes || [];

            // Check all files
            const allFilesUploaded = uploadTypes.every((type) => !!files[type]);
            if (!allFilesUploaded) {
                const missing = uploadTypes.filter((t) => !files[t]);
                toast.error(`Missing: ${missing.join(", ")}`);
                return;
            }

            // Upload each file separately
            for (const type of uploadTypes) {
                const file = files[type];
                if (!file) continue;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("orderId", order.id.toString());
                formData.append("uploadType", type);

                const res = await fetch("/api/file-upload", {
                    method: "POST",
                    body: formData,
                });
                const result = await res.json();

                if (!result.success) {
                    throw new Error(result.error || `Failed to upload ${type}`);
                }
            }

            toast.success("All files uploaded successfully ✨");
            setIsUploaded(true); // enable status change button
        } catch (err) {
            console.error("Upload error:", err);
            toast.error(
                (err as { message: string }).message ||
                    "An unexpected error occurred",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatus = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/file-upload/change-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: order.id,
                    status: "FILE_UPLOADED",
                }),
            });
            const result = await res.json();

            if (result.success) {
                toast.success("Order status updated ✅");
                router.push("/customer/orders");
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (err) {
            console.error("Status update error:", err);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadTypes = order.productItem.uploadGroup?.uploadTypes || [];
    const uploadedCount = uploadTypes.filter((t) => files[t]).length;
    const progress = uploadTypes.length
        ? (uploadedCount / uploadTypes.length) * 100
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto p-6"
        >
            <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl relative backdrop-blur bg-white/90">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-purple-500"></div>

                <CardHeader className="bg-gradient-to-r from-primary via-cyan-500 to-purple-600 text-white py-8 px-10 relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Upload Files for Order #{order.id}
                        </h2>
                        <p className="text-white/80 mt-2 text-sm">
                            Please upload the required design files
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 p-6 rounded-2xl shadow-inner bg-gradient-to-br from-gray-50 to-gray-100"
                    >
                        <h3 className="text-lg font-semibold mb-4">
                            Order Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-5">
                                <Image
                                    src={
                                        order.productItem.product.imageUrl?.[0]
                                    }
                                    alt={order.productItem.product.name}
                                    className="w-20 h-20 object-cover rounded-2xl shadow-md"
                                    width={80}
                                    height={80}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {order.productItem.product.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        SKU: {order.productItem.sku}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-medium">
                                        Quantity:
                                    </span>{" "}
                                    {order.qty}
                                </p>
                                <div className="text-sm flex items-center">
                                    <span className="font-medium">Status:</span>
                                    <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md">
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <Separator className="my-6" />

                    {/* Upload Section */}
                    <div className="space-y-8">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                            Required Files
                        </Label>
                        {uploadTypes.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-2xl shadow-inner">
                                <FileText className="w-14 h-14 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">
                                    No file uploads required.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5">
                                {uploadTypes.map((type) => {
                                    const file = files[type];
                                    return (
                                        <motion.div
                                            key={type}
                                            whileHover={{ scale: 1.01 }}
                                            className={cn(
                                                "border-2 border-dashed rounded-2xl p-6 shadow-sm transition-all duration-300 bg-white",
                                                file
                                                    ? "border-green-300 bg-green-50/70"
                                                    : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <Label className="font-medium text-gray-800 capitalize">
                                                    {type
                                                        .replace("_", " ")
                                                        .toLowerCase()}
                                                </Label>
                                                {file && (
                                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    type="file"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            type,
                                                        )
                                                    }
                                                    accept=".pdf"
                                                    className="flex-1 cursor-pointer"
                                                    disabled={
                                                        isLoading || isUploaded
                                                    }
                                                />
                                                {file && (
                                                    <span className="text-sm text-green-700 font-medium">
                                                        {file.name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                <FileImage className="w-3 h-3" />
                                                Supported: PDF (Max 10MB)
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <Separator className="my-6" />

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        {!isUploaded ? (
                            <Button
                                onClick={handleUpload}
                                disabled={
                                    isLoading ||
                                    (uploadTypes.length > 0 &&
                                        uploadedCount !== uploadTypes.length)
                                }
                                className={cn(
                                    "rounded-xl shadow-md shadow-primary/30 px-6 py-2 font-semibold text-white",
                                    "bg-gradient-to-r from-primary via-cyan-500 to-purple-600 hover:opacity-90",
                                )}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Files
                                    </div>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleChangeStatus}
                                disabled={isLoading}
                                className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold shadow-md"
                            >
                                {isLoading
                                    ? "Updating..."
                                    : "Mark Files as Uploaded"}
                            </Button>
                        )}
                    </div>

                    {/* Progress */}
                    {uploadTypes.length > 0 && !isUploaded && (
                        <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-inner">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-blue-800">
                                    Upload Progress
                                </span>
                                <span className="text-sm text-blue-700">
                                    {uploadedCount} of {uploadTypes.length}{" "}
                                    files
                                </span>
                            </div>
                            <div className="w-full bg-blue-200/50 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.6 }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
