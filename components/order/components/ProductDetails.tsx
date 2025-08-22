import Image from "next/image";
import Link from "next/link";
import { FileText, ExternalLink, ReceiptText, Package } from "lucide-react";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import {
    attachment,
    order,
    pricing,
    product,
    productItem,
} from "@prisma/client";
import { InvoiceButton } from "../../InvoiceButton";
import { addressType } from "@/types/types";

interface ProductDetailsProps {
    order: order & {
        productItem: productItem & {
            pricing: pricing[];
            product: product;
        };
        customer: {
            address?: addressType;
            businessName: string;
            name: string;
            phone: string;
        };
        attachment?: attachment[];
    };
}

export function ProductDetails({ order }: ProductDetailsProps) {
    return (
        <div className="space-y-4 text-sm">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2
                        className={cn(
                            "text-base font-semibold flex items-center text-gray-800",
                            sourceSerif4.className,
                        )}
                    >
                        <Package className="h-4 w-4 mr-2 text-primary/70" />
                        Product Details
                    </h2>
                    {order.status === "DISPATCHED" && (
                        <InvoiceButton order={order} />
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg overflow-hidden p-3">
                    <div className="relative h-40 mb-3 rounded-md overflow-hidden shadow-sm border border-gray-100 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image
                            src={order?.productItem?.product?.imageUrl[0]}
                            alt={order?.productItem?.product?.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                    </div>

                    <h3
                        className={cn(
                            "font-medium text-base mb-3 text-gray-800",
                            sourceSerif4.className,
                        )}
                    >
                        {order?.productItem?.product?.name}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-medium">
                                {order?.qty} units
                            </span>
                        </div>

                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                            <span className="text-gray-600">SKU</span>
                            <span className="font-medium text-gray-800">
                                {order?.productItem?.sku}
                            </span>
                        </div>

                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                            <span className="text-gray-600">Base Price</span>
                            <span className="font-medium text-gray-800">
                                ₹{order?.price}
                            </span>
                        </div>

                        <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                            <span className="text-gray-600">IGST (18%)</span>
                            <span className="font-medium text-gray-800">
                                ₹{(order?.price * order?.igst).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center pb-1">
                            <span className="text-gray-600">Upload Charge</span>
                            <span className="font-medium text-gray-800">
                                ₹{order?.uploadCharge}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-base font-semibold text-primary">
                                ₹{order?.total}
                            </span>
                        </div>
                    </div>
                </div>

                {order?.attachment && order?.attachment?.length > 0 && (
                    <div className="mt-4 bg-blue-50/50 p-3 rounded-md border border-blue-100">
                        <h4 className="font-medium mb-2 text-gray-800 flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            Attached Files
                        </h4>
                        <div className="space-y-1.5">
                            {order?.attachment?.map((u, idx) => (
                                <Link
                                    key={idx}
                                    href={u.url}
                                    target="_blank"
                                    className="flex items-center p-2 bg-white rounded-md hover:bg-blue-50 transition-colors text-primary group text-sm"
                                >
                                    <ReceiptText className="h-4 w-4 mr-2" />
                                    <span className="flex-1 text-gray-700">
                                        {u.type}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
