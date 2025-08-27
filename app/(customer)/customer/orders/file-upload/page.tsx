import FileUploadPage from "@/components/order/FileUploadPage";
import { auth } from "@/lib/auth";
import {
    order,
    productItem,
    product,
    productAttributeValue,
    uploadGroup,
    attachment,
    productAttributeType,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import Button from "./components/button";
import { UploadCloud } from "lucide-react";

interface OrderWithDetails extends order {
    productItem: productItem & {
        productAttributeOptions: (productAttributeValue & {
            productAttributeType: productAttributeType;
        })[];
        product: Pick<product, "name" | "imageUrl">;
        uploadGroup: uploadGroup | null;
    };
    attachment: Pick<attachment, "id" | "type" | "url">[];
}

export const dynamic = "force-dynamic";

export default async function UploadFilesPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId: string }>;
}) {
    try {
        const params = await searchParams;
        const session = await auth();

        // Check authentication
        if (!session?.user?.customer) {
            return redirect("/login");
        }

        // Validate order ID
        if (!params?.orderId || isNaN(parseInt(params.orderId))) {
            return redirect("/customer/orders");
        }

        const orderId = parseInt(params.orderId);

        // Fetch order details
        const orderDetails = await Prisma.order.findUnique({
            where: {
                id: orderId,
                customerId: session.user.customer.id, // Ensure order belongs to customer
            },
            include: {
                productItem: {
                    include: {
                        productAttributeOptions: {
                            include: {
                                productAttributeType: true,
                            },
                        },
                        product: {
                            select: {
                                name: true,
                                imageUrl: true,
                            },
                        },
                        uploadGroup: true,
                    },
                },
                attachment: {
                    select: {
                        id: true,
                        type: true,
                        url: true,
                    },
                },
            },
        });

        if (!orderDetails) {
            return (
                <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Order Not Found
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The order you&apos;re looking for doesn&apos;t
                                exist or you don&apos;t have permission to
                                access it.
                            </p>
                            <Button href="/customer/orders" variant="secondary">
                                Back to Orders
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        if (orderDetails?.uploadFilesVia !== "UPLOAD") {
            return (
                <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <UploadCloud className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Can&apos;t Upload
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Mail Files to our company at
                                fileupload@printvc.com.
                            </p>
                            <Button href="/customer/orders" variant="secondary">
                                Back to Orders
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        if (orderDetails.status !== "PLACED") {
            return (
                <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Files Already Uploaded
                            </h2>
                            <p className="text-gray-600 mb-6">
                                All required files have already been uploaded
                                for this order.
                            </p>
                            <div className="space-x-3">
                                <Button
                                    href="/customer/orders"
                                    variant="secondary"
                                >
                                    Back to Orders
                                </Button>
                                <Button
                                    href={`/customer/orders/${orderId}`}
                                    variant="outline"
                                >
                                    View Order Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Transform order data for the component
        const transformedOrder: OrderWithDetails = {
            ...orderDetails,
            attachment: orderDetails.attachment,
            productItem: orderDetails.productItem,
        };

        return <FileUploadPage order={transformedOrder} />;
    } catch (error) {
        console.error("Error in UploadFilesPage:", error);

        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Something Went Wrong
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error instanceof Error
                                ? error.message
                                : "An error occurred while loading the upload page."}
                        </p>
                        <Button href="/customer/orders" variant="secondary">
                            Back to Orders
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
