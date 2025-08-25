import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import { STATUS } from "@prisma/client";
import { format } from "date-fns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IndianRupee } from "lucide-react";
import { ImproperOrderModal } from "../modal/ImproperOrderModal";
import Image from "next/image";
import { ViewFilesButton } from "@/components/ViewFilesButton";
import { ImproperOrderButton } from "../components/ImproperButton";
import { BackButton } from "@/components/backButton";
import { NUMBER_PRECISION } from "@/lib/constants";

export default async function OrderDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType != "staff" ||
        (session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    ) {
        return redirect("/");
    }

    const { id } = await params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
        return redirect("/admin/orders");
    }

    // Fetch order with all related data
    const order = await Prisma.order.findUnique({
        where: { id: orderId },
        include: {
            customer: {
                // include: {
                //     address: {
                //         include: {
                //             city: {
                //                 include: {
                //                     state: {
                //                         include: {
                //                             country: true,
                //                         },
                //                     },
                //                 },
                //             },
                //         },
                //     },
                // },
            },
            productItem: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
            attachment: true,
            job: true,
            comments: {
                include: {
                    staff: true,
                    customer: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const address = await Prisma.address.findFirst({
        where: {
            ownerId: order?.customerId,
            ownerType: "CUSTOMER",
        },
        include: {
            city: {
                include: {
                    state: {
                        include: {
                            country: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        return redirect("/admin/orders");
    }

    // Format the full address
    // const address = order.customer.address;
    const fullAddress = address
        ? `${address.line}, ${address.city.name}, ${address.city.state.name}, ${address.city.state.country.name} - ${address.pinCode}`
        : "No address provided";

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">
                        Order #{order.id}
                    </h1>
                    <Badge
                        variant={
                            order.status === STATUS.PENDING
                                ? "secondary"
                                : order.status === STATUS.PROCESSING
                                  ? "default"
                                  : order.status === STATUS.DISPATCHED
                                    ? "default"
                                    : order.status === STATUS.CANCELLED
                                      ? "destructive"
                                      : "outline"
                        }
                    >
                        {order.status}
                    </Badge>
                </div>
                <BackButton />
                {/* <Link href="/admin/orders">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Button>
                </Link> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Order ID
                                </p>
                                <p className="font-medium">#{order.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        order.status === STATUS.PENDING
                                            ? "secondary"
                                            : order.status === STATUS.PROCESSING
                                              ? "default"
                                              : order.status ===
                                                  STATUS.DISPATCHED
                                                ? "default"
                                                : order.status ===
                                                    STATUS.CANCELLED
                                                  ? "destructive"
                                                  : "outline"
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Date
                                </p>
                                <p className="font-medium">
                                    {format(new Date(order.createdAt), "PPP p")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Quantity
                                </p>
                                <p className="font-medium">{order.qty}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Price
                                </p>
                                <p className="font-medium flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {order.price.toFixed(NUMBER_PRECISION)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>
                                <p className="font-medium flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {order.total.toFixed(NUMBER_PRECISION)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    IGST ({order.igst * 100}%)
                                </p>
                                <p className="font-medium flex items-center">
                                    {(order.igst * order.price).toFixed(
                                        NUMBER_PRECISION,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Upload Charge
                                </p>
                                <p className="font-medium flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    {order.uploadCharge.toFixed(
                                        NUMBER_PRECISION,
                                    )}
                                </p>
                            </div>
                        </div>

                        {order.jobId && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Job
                                </p>
                                <p className="font-medium">
                                    <Link
                                        href={`/admin/job/${order.jobId}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {order.job?.name ||
                                            `Job #${order.jobId}`}
                                    </Link>
                                </p>
                            </div>
                        )}

                        {order.attachment &&
                            order.attachment.urls &&
                            order.attachment.urls.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Attachments
                                    </p>
                                    <ViewFilesButton
                                        order={{
                                            id: order.id,
                                            attachment: order.attachment.urls,
                                        }}
                                    />
                                </div>
                            )}
                    </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Product Name
                            </p>
                            <p className="font-medium">
                                {order.productItem.product.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">SKU</p>
                            <p className="font-medium">
                                {order.productItem.sku}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Category
                            </p>
                            <p className="font-medium">
                                {order.productItem.product.category.name}
                            </p>
                        </div>
                        {order.productItem.product.imageUrl &&
                            order.productItem.product.imageUrl.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Product Image
                                    </p>
                                    <div className="rounded-md overflow-hidden w-32 h-32">
                                        <Image
                                            fill
                                            src={
                                                order.productItem.product
                                                    .imageUrl[0]
                                            }
                                            alt={order.productItem.product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                            )}
                    </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Name
                            </p>
                            <p className="font-medium">{order.customer.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Business Name
                            </p>
                            <p className="font-medium">
                                {order.customer.businessName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email
                            </p>
                            <p className="font-medium">
                                {order.customer.email}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Phone
                            </p>
                            <p className="font-medium">
                                {order.customer.phone}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                GST Number
                            </p>
                            <p className="font-medium">
                                {order.customer.gstNumber || "Not provided"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Address
                            </p>
                            <p className="font-medium">{fullAddress}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments/Notes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order Comments</CardTitle>
                        {/* Here you could add a button to add new comments if needed */}
                    </CardHeader>
                    <CardContent>
                        {order.comments && order.comments.length > 0 ? (
                            <div className="space-y-4">
                                {order.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="border p-3 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">
                                                    {comment.staff
                                                        ? comment.staff.name
                                                        : comment.customer
                                                              ?.name ||
                                                          "System"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            comment.createdAt,
                                                        ),
                                                        "PPP p",
                                                    )}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {comment.commentType}
                                            </Badge>
                                        </div>
                                        <p className="text-sm">
                                            {comment.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                No comments for this order
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                {order.status === STATUS.PENDING && (
                    <ImproperOrderButton order={{ id: order.id }} />
                )}
                {/* Add more action buttons as needed */}
            </div>
            <ImproperOrderModal />
        </div>
    );
}
