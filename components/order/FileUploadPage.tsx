"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    UPLOAD_TYPE,
    order,
    productItem,
    product,
    productAttributeValue,
    uploadGroup,
    attachment,
} from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
    Upload,
    CheckCircle,
    FileImage,
    Trash2,
    ExternalLink,
} from "lucide-react";
import axios, { isAxiosError } from "axios";

interface OrderWithDetails extends order {
    productItem: productItem & {
        productAttributeOptions: productAttributeValue[];
        product: Pick<product, "name" | "imageUrl">;
        uploadGroup: uploadGroup | null;
    };
    attachment: Pick<attachment, "id" | "type" | "url">[];
}

export default function FileUploadPage({ order }: { order: OrderWithDetails }) {
    const [files, setFiles] = useState<Record<UPLOAD_TYPE, File | null>>(
        // eslint-disable-next-line
        {} as any,
    );
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const attachments = useMemo(() => {
        // eslint-disable-next-line
        const map: Record<UPLOAD_TYPE, { id: number; url: string }> = {} as any;
        order.attachment.forEach((att) => {
            map[att.type as UPLOAD_TYPE] = { id: att.id, url: att.url };
        });
        return map;
    }, [order.attachment]);

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        type: UPLOAD_TYPE,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles((prev) => ({ ...prev, [type]: file }));
        }
    };

    const handleUpload = async () => {
        try {
            setIsLoading(true);
            const uploadTypes =
                order.productItem.uploadGroup?.uploadTypes || [];

            const missing = uploadTypes.filter(
                (t) => !files[t] && !attachments[t],
            );
            if (missing.length > 0) {
                toast.error(`Missing: ${missing.join(", ")}`);
                return;
            }

            for (const type of uploadTypes) {
                const file = files[type];
                if (!file) continue; // already uploaded

                const formData = new FormData();
                formData.append("file", file);
                formData.append("orderId", order.id.toString());
                formData.append("uploadType", type);

                const { data } = await axios.post("/api/file-upload", formData);
                if (!data.success)
                    throw new Error(data.error || `Failed to upload ${type}`);
            }

            toast.success("Files uploaded successfully ✨");
            router.refresh();
        } catch (err) {
            console.error("Upload error:", err);
            if (isAxiosError(err)) {
                toast.error(
                    err.response?.data.message ||
                        "An unexpected error occurred",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (type: UPLOAD_TYPE) => {
        try {
            setIsLoading(true);
            const attachment = attachments[type];
            if (!attachment) return;
            console.log(attachment);
            const { data } = await axios.delete("/api/file-upload", {
                data: {
                    orderId: order.id,
                    attachmentId: attachment.id,
                },
            });

            if (!data.success) throw new Error(data.error || "Delete failed");

            toast.success(`Deleted file for ${type}`);
            router.refresh();
        } catch (err) {
            console.error("Delete error:", err);
            if (isAxiosError(err)) {
                toast.error(
                    err.response?.data.message ||
                        "An error occurred while deleting",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatus = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                "/api/file-upload/change-status",
                {
                    orderId: order.id,
                    status: "FILE_UPLOADED",
                },
            );

            if (data.success) {
                toast.success("Order status updated ✅");
                router.push(
                    "/customer/orders?search=&sortorder=desc&perpage=100",
                );
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (err) {
            console.error("Status update error:", err);
            if (isAxiosError(err)) {
                toast.error(
                    err.response?.data.message ||
                        "An unexpected error occurred",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const uploadTypes = order.productItem.uploadGroup?.uploadTypes || [];
    const uploadedCount = uploadTypes.filter((t) => attachments[t]).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto p-6"
        >
            <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl relative backdrop-blur bg-white/90">
                <CardHeader className="bg-gradient-to-r from-primary via-cyan-500 to-purple-600 text-white py-8 px-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Upload Files for Order #{order.id}
                    </h2>
                    <p className="text-white/80 mt-2 text-sm">
                        Please upload the required design files
                    </p>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="space-y-8">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                            Required Files
                        </Label>

                        <div className="grid gap-5">
                            {uploadTypes.map((type) => {
                                const att = attachments[type];
                                const newFile = files[type];

                                return (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.01 }}
                                        className={cn(
                                            "border-2 border-dashed rounded-2xl p-6 shadow-sm transition-all duration-300 bg-white",
                                            att
                                                ? "border-green-400 bg-green-50/70"
                                                : newFile
                                                  ? "border-blue-300 bg-blue-50/70"
                                                  : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="font-medium text-gray-800 capitalize">
                                                {type
                                                    .replace("_", " ")
                                                    .toLowerCase()}
                                            </Label>
                                            {att && (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            )}
                                        </div>

                                        {att ? (
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm text-green-700 font-medium">
                                                    Uploaded
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                att.url,
                                                                "_blank",
                                                            )
                                                        }
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(type)
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
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
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    <FileImage className="w-3 h-3" />
                                                    Supported: PDF (Max 10MB)
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-end mt-6">
                        <Button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className={cn(
                                "rounded-xl shadow-md shadow-primary/30 px-6 py-2 font-semibold text-white",
                                "bg-gradient-to-r from-primary via-cyan-500 to-purple-600 hover:opacity-90",
                                uploadTypes.length === uploadedCount &&
                                    "hidden",
                            )}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload Files
                                </div>
                            )}
                        </Button>

                        <Button
                            onClick={handleChangeStatus}
                            disabled={
                                isLoading ||
                                uploadedCount !== uploadTypes.length
                            }
                            className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold shadow-md"
                        >
                            Mark Files as Uploaded
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
