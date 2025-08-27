import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import { STATUS } from "@prisma/client";
import { format } from "date-fns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IndianRupee, FileText, ExternalLink, Upload, Calendar, User, Package, MapPin } from "lucide-react";
import { ImproperOrderModal } from "../modal/ImproperOrderModal";
import Image from "next/image";
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
                omit: {
                    password: true,
                },
            },
            productItem: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                    productAttributeOptions: {
                        include: {
                            productAttributeType: true,
                        },
                    },
                },
            },
            attachment: true,
            job: true,
            comments: {
                include: {
                    staff: true,
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
        return redirect(
            "/admin/orders?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        );
    }

    // Format the full address
    // const address = order.customer.address;
    const fullAddress = address
        ? `${address.line}, ${address.city.name}, ${address.city.state.name}, ${address.city.state.country.name} - ${address.pinCode}`
        : "No address provided";

    // Helper function to get status badge variant and color
    const getStatusBadgeProps = (status: STATUS) => {
        switch (status) {
            case STATUS.PLACED:
                return { variant: "secondary" as const, className: "bg-blue-100 text-blue-800 border-blue-200" };
            case STATUS.FILE_UPLOADED:
                return { variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" };
            case STATUS.PROCESSING:
                return { variant: "default" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            case STATUS.DISPATCHED:
                return { variant: "default" as const, className: "bg-purple-100 text-purple-800 border-purple-200" };
            case STATUS.CANCELLED:
                return { variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" };
            case STATUS.IMPROPER_ORDER:
                return { variant: "destructive" as const, className: "bg-orange-100 text-orange-800 border-orange-200" };
            default:
                return { variant: "outline" as const, className: "" };
        }
    };

    const statusProps = getStatusBadgeProps(order.status);

    return (
        <div className="space-y-6 h-full min-h-full p-6 bg-gray-50/50">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="w-8 h-8" />
                    <div className="flex items-center gap-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Order #{order.id}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Created {format(new Date(order.createdAt), "PPP")}
                            </p>
                        </div>
                    </div>
                    <Badge 
                        variant={statusProps.variant}
                        className={`${statusProps.className} px-3 py-1 text-sm font-medium`}
                    >
                        {order.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
                <BackButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details - Takes 2 columns on large screens */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Order Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Order ID
                                    </p>
                                    <p className="font-semibold text-lg">#{order.id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Date & Time
                                    </p>
                                    <p className="font-medium text-sm">
                                        {format(new Date(order.createdAt), "PPP")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(order.createdAt), "p")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Quantity
                                    </p>
                                    <p className="font-semibold text-lg">{order.qty}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Pricing Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3 text-gray-900">Pricing Breakdown</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Unit Price</span>
                                        <span className="font-medium flex items-center">
                                            <IndianRupee className="h-3 w-3 mr-1" />
                                            {order.price.toFixed(NUMBER_PRECISION)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">IGST ({(order.igst * 100).toFixed(1)}%)</span>
                                        <span className="font-medium flex items-center">
                                            <IndianRupee className="h-3 w-3 mr-1" />
                                            {(order.igst * order.price).toFixed(NUMBER_PRECISION)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Upload Charge</span>
                                        <span className="font-medium flex items-center">
                                            <IndianRupee className="h-3 w-3 mr-1" />
                                            {order.uploadCharge.toFixed(NUMBER_PRECISION)}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold text-lg">Total Amount</span>
                                        <span className="font-bold text-xl flex items-center text-green-700">
                                            <IndianRupee className="h-4 w-4 mr-1" />
                                            {order.total.toFixed(NUMBER_PRECISION)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Information */}
                            {order.jobId && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium text-blue-900">Associated Job</p>
                                    </div>
                                    <Link
                                        href={`/admin/job/${order.jobId}`}
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        {order.job?.name || `Job #${order.jobId}`}
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}

                            {/* Upload Method */}
                            {order.uploadFilesVia && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-purple-600" />
                                        <p className="text-sm font-medium text-purple-900">Upload Method</p>
                                        <Badge variant="outline" className="ml-auto bg-white">
                                            {order.uploadFilesVia}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Attachments */}
                            {order.attachment && order.attachment.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Attachments ({order.attachment.length})
                                    </h4>
                                    <div className="grid gap-3">
                                        {order.attachment.map((att) => (
                                            <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded border">
                                                        <FileText className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{att.type}</p>
                                                        <p className="text-xs text-muted-foreground">Attachment file</p>
                                                    </div>
                                                </div>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={att.url} target="_blank" className="flex items-center gap-2">
                                                        View File
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Comments Card */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Order Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.comments && order.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {order.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {comment.staff?.name || "System"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(comment.createdAt), "PPP p")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {comment.commentType}
                                                </Badge>
                                            </div>
                                            <p className="text-sm leading-relaxed bg-gray-50 p-3 rounded border-l-4 border-l-blue-500">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="font-medium">No comments yet</p>
                                    <p className="text-sm">Comments will appear here when added</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Product Details */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Product Image */}
                            {order.productItem.product.imageUrl &&
                                order.productItem.product.imageUrl.length > 0 && (
                                    <div className="flex justify-center mb-4">
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border shadow-sm">
                                            <Image
                                                fill
                                                src={order.productItem.product.imageUrl[0]}
                                                alt={order.productItem.product.name}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                        Product Name
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {order.productItem.product.name}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">SKU</p>
                                        <p className="font-medium text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                            {order.productItem.sku}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Category</p>
                                        <Badge variant="secondary" className="text-xs">
                                            {order.productItem.product.category.name}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Product Attributes */}
                                {order.productItem.productAttributeOptions.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                            Product Attributes
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.productItem.productAttributeOptions.map((option) => (
                                                <Badge
                                                    key={option.id}
                                                    variant="outline"
                                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {option.productAttributeType.name}: {option.productAttributeValue}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Details */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                        Customer Name
                                    </p>
                                    <p className="font-semibold">{order.customer.name}</p>
                                </div>
                                
                                {order.customer.businessName && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                            Business Name
                                        </p>
                                        <p className="font-medium">{order.customer.businessName}</p>
                                    </div>
                                )}
                                
                                <div className="grid gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                            Email
                                        </p>
                                        <p className="font-medium text-sm break-all">{order.customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                            Phone
                                        </p>
                                        <p className="font-medium font-mono">{order.customer.phone}</p>
                                    </div>
                                </div>
                                
                                {order.customer.gstNumber && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                            GST Number
                                        </p>
                                        <p className="font-medium font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {order.customer.gstNumber}
                                        </p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Address
                                    </p>
                                    <p className="font-medium text-sm leading-relaxed bg-gray-50 p-3 rounded border">
                                        {fullAddress}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 bg-white p-4 rounded-lg border shadow-sm">
                {order.status === STATUS.FILE_UPLOADED && (
                    <ImproperOrderButton order={{ id: order.id }} />
                )}
                {/* Add more action buttons as needed */}
            </div>
            
            <ImproperOrderModal />
        </div>
    );
}
