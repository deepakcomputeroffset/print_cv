"use client";

import { useState, useTransition, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle,
    X,
    MessageSquare,
    Loader2,
    Send,
    FileText,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus, getOrderDetails, addComment } from "../actions";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { STATUS } from "@prisma/client";

interface Comment {
    id: number;
    comment: string;
    createdAt: Date;
    staff: {
        name: string;
    } | null;
}

interface OrderDetails {
    id: number;
    qty: number;
    status: STATUS;
    uploadFilesVia: string;
    customer: {
        name: string;
        businessName: string;
        email: string;
        phone: string;
        gstNumber: string | null;
    };
    productItem: {
        sku: string;
        product: {
            name: string;
            imageUrl: string[];
        };
        productAttributeOptions: Array<{
            id: number;
            productAttributeType: {
                name: string;
            };
            productAttributeValue: string;
        }>;
    };
    comments: Comment[];
    attachment?: Array<{
        id: number;
        url: string;
        type: string;
        createdAt: Date;
    }>;
}

interface OrderDetailsModalProps {
    orderId: number | null;
    isOpen: boolean;
    onClose: () => void;
    uploadType: "EMAIL" | "FILE" | "IMPROPER";
}

export function OrderDetailsModal({
    orderId,
    isOpen,
    onClose,
    uploadType,
}: OrderDetailsModalProps) {
    const [comment, setComment] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<OrderDetails | null>(null);

    useEffect(() => {
        if (isOpen && orderId) {
            setIsLoading(true);
            startTransition(async () => {
                const result = await getOrderDetails(orderId);
                if (result.success) {
                    setOrder(result.data);
                } else {
                    toast.error(result.error || "Failed to load order details");
                    onClose();
                }
                setIsLoading(false);
            });
        } else {
            setOrder(null);
            setComment("");
        }
    }, [isOpen, orderId, onClose]);

    const handleStatusUpdate = async (
        status: "FILE_UPLOADED" | "IMPROPER_ORDER" | "PLACED",
    ) => {
        if (!orderId) return;

        startTransition(async () => {
            const result = await updateOrderStatus(orderId, status);

            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.error || "Failed to update status");
            }
        });
    };

    const handleSendComment = async () => {
        if (!orderId || !comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        startTransition(async () => {
            const result = await addComment(orderId, comment.trim());

            if (result.success) {
                toast.success(result.message);
                setComment("");
                // Refresh order details to show new comment
                const updatedOrder = await getOrderDetails(orderId);
                if (updatedOrder.success) {
                    setOrder(updatedOrder.data);
                }
            } else {
                toast.error(result.error || "Failed to add comment");
            }
        });
    };

    const isAlreadyProcessed = order?.status === "IMPROPER_ORDER";
    const isImproperOrder = uploadType === "IMPROPER";

    const modalTitle =
        uploadType === "EMAIL"
            ? "Email Review"
            : uploadType === "FILE"
              ? "File Upload Review"
              : "Improper Order Review";
    const confirmButtonText = "Files Confirmed";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : order ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>
                                Order #{order.id} - {modalTitle}
                            </DialogTitle>
                            <DialogDescription>
                                Review customer details and update order status
                                based on{" "}
                                {uploadType === "EMAIL" ? "email" : "files"}{" "}
                                received from customer.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Customer Details */}
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Customer Details
                                </Label>
                                <div className="p-3 rounded-lg border bg-gray-50 space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">
                                            Name:
                                        </span>{" "}
                                        {order.customer.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Business:
                                        </span>{" "}
                                        {order.customer.businessName}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Email:
                                        </span>{" "}
                                        {order.customer.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Phone:
                                        </span>{" "}
                                        {order.customer.phone}
                                    </p>
                                    {order.customer.gstNumber && (
                                        <p>
                                            <span className="font-medium">
                                                GST:
                                            </span>{" "}
                                            {order.customer.gstNumber}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-medium">
                                            Upload Via:
                                        </span>{" "}
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {order.uploadFilesVia}
                                        </Badge>
                                    </p>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Product Details
                                </Label>
                                <div className="p-3 rounded-lg border bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Image
                                            src={
                                                order.productItem.product
                                                    .imageUrl?.[0]
                                            }
                                            alt={order.productItem.product.name}
                                            className="w-12 h-12 object-cover rounded border"
                                            width={48}
                                            height={48}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {order.productItem.product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                SKU: {order.productItem.sku}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                            Qty: {order.qty}
                                        </Badge>
                                        {order.productItem.productAttributeOptions.map(
                                            (option) => (
                                                <Badge
                                                    key={option.id}
                                                    variant="secondary"
                                                >
                                                    {
                                                        option
                                                            .productAttributeType
                                                            .name
                                                    }
                                                    :{" "}
                                                    {
                                                        option.productAttributeValue
                                                    }
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Uploaded Files - Only show for FILE upload type */}
                            {uploadType === "FILE" &&
                                order.attachment &&
                                order.attachment.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Uploaded Files (
                                            {order.attachment.length})
                                        </Label>
                                        <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                                            {order.attachment.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center justify-between p-2 border rounded bg-white hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {file.type}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Uploaded{" "}
                                                                {format(
                                                                    file.createdAt,
                                                                    "dd MMM yyyy, HH:mm",
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            window.open(
                                                                file.url,
                                                                "_blank",
                                                            )
                                                        }
                                                        className="flex items-center gap-1"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        Open
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Status Indicator */}
                            {isAlreadyProcessed && (
                                <div
                                    className={`border-2 rounded-lg p-3 ${
                                        order.status === "FILE_UPLOADED"
                                            ? "border-green-400 bg-green-50"
                                            : "border-red-400 bg-red-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {order.status === "FILE_UPLOADED" ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="font-semibold text-green-700">
                                                    {confirmButtonText}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-5 h-5 text-red-600" />
                                                <span className="font-semibold text-red-700">
                                                    Improper Order
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Previous Comments */}
                            {order.comments && order.comments.length > 0 && (
                                <div>
                                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                                        Comments ({order.comments.length})
                                    </Label>
                                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                                        {order.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="border rounded-lg p-2 bg-white"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-xs font-medium text-gray-700">
                                                            {comment.staff
                                                                ?.name ||
                                                                "Staff"}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {format(
                                                            comment.createdAt,
                                                            "dd MMM, HH:mm",
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 pl-5">
                                                    {comment.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add Comment */}
                            {!isAlreadyProcessed && (
                                <div>
                                    <Label
                                        htmlFor="comment"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Add Comment
                                    </Label>
                                    <Textarea
                                        id="comment"
                                        placeholder="e.g., All files received and verified, Missing logo, incorrect dimensions, etc."
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        className="mt-2 min-h-[80px] resize-none"
                                        disabled={isPending}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {!isAlreadyProcessed && !isImproperOrder && (
                            <div className="flex gap-3 justify-between items-center flex-wrap">
                                <Button
                                    onClick={handleSendComment}
                                    disabled={isPending || !comment.trim()}
                                    variant="outline"
                                    size="default"
                                >
                                    {isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() =>
                                            handleStatusUpdate("IMPROPER_ORDER")
                                        }
                                        disabled={isPending}
                                        variant="destructive"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <X className="w-4 h-4" />
                                                Improper Order
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleStatusUpdate("FILE_UPLOADED")
                                        }
                                        disabled={isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                {confirmButtonText}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons for Improper Orders */}
                        {isImproperOrder && (
                            <div className="flex gap-3 justify-between items-center flex-wrap">
                                <Button
                                    onClick={handleSendComment}
                                    disabled={isPending || !comment.trim()}
                                    variant="outline"
                                    size="default"
                                >
                                    {isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() =>
                                            handleStatusUpdate("PLACED")
                                        }
                                        disabled={isPending}
                                        variant="outline"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Mark as Placed
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleStatusUpdate("FILE_UPLOADED")
                                        }
                                        disabled={isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Mark as File Uploaded
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
