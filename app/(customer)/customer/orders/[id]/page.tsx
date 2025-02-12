// "use client";

// import { use, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowLeft, FileText } from "lucide-react";

// interface OrderDetailsProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

// interface Order {
//   id: string;
//   productId: string;
//   product: {
//     name: string;
//     description: string;
//     imageUrl: string[];
//   };
//   quantity: number;
//   amount: number;
//   templateUrl?: string;
//   status: OrderStatus;
//   createdAt: string;
//   user: {
//     businessName: string;
//     address: string;
//     city: string;
//     state: string;
//     pinCode: string;
//     country: string;
//   };
// }

// export default function OrderDetailsPage({ params }: OrderDetailsProps) {
//   // Dummy data matching the new schema
//   const param = use(params);
//   const [order] = useState<Order>({
//     id: param.id,
//     productId: "prod1",
//     product: {
//       name: "Business Cards",
//       description: "Premium business cards with matte finish",
//       imageUrl: [
//         "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
//       ],
//     },
//     quantity: 500,
//     amount: 149.99,
//     templateUrl: "template-url-1",
//     status: "PENDING",
//     createdAt: "2024-01-15",
//     user: {
//       businessName: "Acme Corp",
//       address: "123 Business Street",
//       city: "Tech City",
//       state: "State",
//       pinCode: "12345",
//       country: "Country",
//     },
//   });

//   const getStatusColor = (status: OrderStatus) => {
//     const colors = {
//       PENDING: "bg-yellow-100 text-yellow-800",
//       PROCESSING: "bg-blue-100 text-blue-800",
//       COMPLETED: "bg-green-100 text-green-800",
//       CANCELLED: "bg-red-100 text-red-800",
//     };
//     return colors[status];
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <Link
//         href="/orders"
//         className="flex items-center text-primary hover:underline mb-6"
//       >
//         <ArrowLeft className="h-4 w-4 mr-2" />
//         Back to Orders
//       </Link>

//       <div className="grid gap-6">
//         <Card className="p-6">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Order {order.id}</h1>
//               <p className="text-muted-foreground">
//                 Placed on {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <Badge className={getStatusColor(order.status)}>
//               {order.status}
//             </Badge>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="font-semibold mb-4">Product Details</h2>
//               <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
//                 <Image
//                   src={order.product.imageUrl[0]}
//                   alt={order.product.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h3 className="font-medium text-lg">{order.product.name}</h3>
//               <p className="text-muted-foreground">
//                 {order.product.description}
//               </p>
//               <div className="mt-4 space-y-2">
//                 <p>
//                   <span className="font-medium">Quantity:</span>{" "}
//                   {order.quantity}
//                 </p>
//                 <p>
//                   <span className="font-medium">Amount:</span> ${order.amount}
//                 </p>
//                 {order.templateUrl && (
//                   <div className="flex items-center">
//                     <FileText className="h-4 w-4 mr-2" />
//                     <Link
//                       href={order.templateUrl}
//                       className="text-primary hover:underline"
//                     >
//                       View Template
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h2 className="font-semibold mb-4">Delivery Details</h2>
//               <div className="space-y-2">
//                 <p>
//                   <span className="font-medium">Business Name:</span>{" "}
//                   {order.user.businessName}
//                 </p>
//                 <p>
//                   <span className="font-medium">Address:</span>{" "}
//                   {order.user.address}
//                 </p>
//                 <p>
//                   <span className="font-medium">City:</span> {order.user.city}
//                 </p>
//                 <p>
//                   <span className="font-medium">State:</span> {order.user.state}
//                 </p>
//                 <p>
//                   <span className="font-medium">PIN Code:</span>{" "}
//                   {order.user.pinCode}
//                 </p>
//                 <p>
//                   <span className="font-medium">Country:</span>{" "}
//                   {order.user.country}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h2 className="font-semibold mb-4">Order Timeline</h2>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
//                 <Badge variant="secondary">✓</Badge>
//               </div>
//               <div className="ml-4">
//                 <p className="font-medium">Order Placed</p>
//                 <p className="text-sm text-muted-foreground">
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//             {order.status !== "PENDING" && (
//               <div className="flex items-center">
//                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                   <Badge variant="secondary">✓</Badge>
//                 </div>
//                 <div className="ml-4">
//                   <p className="font-medium">Processing</p>
//                   <p className="text-sm text-muted-foreground">
//                     Order is being processed
//                   </p>
//                 </div>
//               </div>
//             )}
//             {order.status === "COMPLETED" && (
//               <div className="flex items-center">
//                 <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
//                   <Badge variant="secondary">✓</Badge>
//                 </div>
//                 <div className="ml-4">
//                   <p className="font-medium">Completed</p>
//                   <p className="text-sm text-muted-foreground">
//                     Order has been completed
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { use, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   FileText,
//   CheckCircle2,
//   Clock,
//   Printer,
//   Package,
//   Truck,
// } from "lucide-react";

// interface OrderDetailsProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

// interface TimelineEvent {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   date: string;
//   status: "completed" | "current" | "upcoming";
// }

// interface Order {
//   id: string;
//   productId: string;
//   product: {
//     name: string;
//     description: string;
//     imageUrl: string[];
//   };
//   quantity: number;
//   amount: number;
//   templateUrl?: string;
//   status: OrderStatus;
//   createdAt: string;
//   user: {
//     businessName: string;
//     address: string;
//     city: string;
//     state: string;
//     pinCode: string;
//     country: string;
//   };
// }

// export default function OrderDetailsPage({ params }: OrderDetailsProps) {
//   // Dummy data matching the new schema
//   const [order] = useState<Order>({
//     id: use(params).id,
//     productId: "prod1",
//     product: {
//       name: "Business Cards",
//       description: "Premium business cards with matte finish",
//       imageUrl: [
//         "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
//       ],
//     },
//     quantity: 500,
//     amount: 149.99,
//     templateUrl: "template-url-1",
//     status: "COMPLETED",
//     createdAt: "2024-01-15",
//     user: {
//       businessName: "Acme Corp",
//       address: "123 Business Street",
//       city: "Tech City",
//       state: "State",
//       pinCode: "12345",
//       country: "Country",
//     },
//   });

//   const getStatusColor = (status: OrderStatus) => {
//     const colors = {
//       PENDING: "bg-yellow-100 text-yellow-800",
//       PROCESSING: "bg-blue-100 text-blue-800",
//       COMPLETED: "bg-green-100 text-green-800",
//       CANCELLED: "bg-red-100 text-red-800",
//     };
//     return colors[status];
//   };

//   const getTimelineEvents = (order: Order): TimelineEvent[] => {
//     const baseDate = new Date(order.createdAt);
//     const events: TimelineEvent[] = [
//       {
//         icon: <CheckCircle2 className="h-6 w-6" />,
//         title: "Order Placed",
//         description: "Your order has been confirmed",
//         date: baseDate.toLocaleDateString(),
//         status: "completed",
//       },
//       {
//         icon: <Clock className="h-6 w-6" />,
//         title: "Order Processing",
//         description: "We're preparing your order",
//         date: new Date(
//           baseDate.getTime() + 1 * 24 * 60 * 60 * 1000
//         ).toLocaleDateString(),
//         status: order.status === "PENDING" ? "upcoming" : "completed",
//       },
//       {
//         icon: <Printer className="h-6 w-6" />,
//         title: "Printing Started",
//         description: "Your items are being printed",
//         date: new Date(
//           baseDate.getTime() + 2 * 24 * 60 * 60 * 1000
//         ).toLocaleDateString(),
//         status:
//           order.status === "PENDING" || order.status === "PROCESSING"
//             ? "upcoming"
//             : "completed",
//       },
//       {
//         icon: <Package className="h-6 w-6" />,
//         title: "Quality Check",
//         description: "Final quality inspection",
//         date: new Date(
//           baseDate.getTime() + 3 * 24 * 60 * 60 * 1000
//         ).toLocaleDateString(),
//         status: order.status !== "COMPLETED" ? "upcoming" : "completed",
//       },
//       {
//         icon: <Truck className="h-6 w-6" />,
//         title: "Order Completed",
//         description: "Your order has been completed and ready for pickup",
//         date: new Date(
//           baseDate.getTime() + 4 * 24 * 60 * 60 * 1000
//         ).toLocaleDateString(),
//         status: order.status !== "COMPLETED" ? "upcoming" : "completed",
//       },
//     ];

//     return events;
//   };

//   const timelineEvents = getTimelineEvents(order);

//   return (
//     <div className="container mx-auto py-8">
//       <Link
//         href="/orders"
//         className="flex items-center text-primary hover:underline mb-6"
//       >
//         <ArrowLeft className="h-4 w-4 mr-2" />
//         Back to Orders
//       </Link>

//       <div className="grid gap-6">
//         <Card className="p-6">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Order {order.id}</h1>
//               <p className="text-muted-foreground">
//                 Placed on {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <Badge className={getStatusColor(order.status)}>
//               {order.status}
//             </Badge>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="font-semibold mb-4">Product Details</h2>
//               <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
//                 <Image
//                   src={order.product.imageUrl[0]}
//                   alt={order.product.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h3 className="font-medium text-lg">{order.product.name}</h3>
//               <p className="text-muted-foreground">
//                 {order.product.description}
//               </p>
//               <div className="mt-4 space-y-2">
//                 <p>
//                   <span className="font-medium">Quantity:</span>{" "}
//                   {order.quantity}
//                 </p>
//                 <p>
//                   <span className="font-medium">Amount:</span> ${order.amount}
//                 </p>
//                 {order.templateUrl && (
//                   <div className="flex items-center">
//                     <FileText className="h-4 w-4 mr-2" />
//                     <Link
//                       href={order.templateUrl}
//                       className="text-primary hover:underline"
//                     >
//                       View Template
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h2 className="font-semibold mb-4">Delivery Details</h2>
//               <div className="space-y-2">
//                 <p>
//                   <span className="font-medium">Business Name:</span>{" "}
//                   {order.user.businessName}
//                 </p>
//                 <p>
//                   <span className="font-medium">Address:</span>{" "}
//                   {order.user.address}
//                 </p>
//                 <p>
//                   <span className="font-medium">City:</span> {order.user.city}
//                 </p>
//                 <p>
//                   <span className="font-medium">State:</span> {order.user.state}
//                 </p>
//                 <p>
//                   <span className="font-medium">PIN Code:</span>{" "}
//                   {order.user.pinCode}
//                 </p>
//                 <p>
//                   <span className="font-medium">Country:</span>{" "}
//                   {order.user.country}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h2 className="font-semibold mb-6">Order Timeline</h2>
//           <div className="relative">
//             {timelineEvents.map((event, index) => (
//               <div key={index} className="flex items-start mb-8 last:mb-0">
//                 <div
//                   className={`
//                   w-12 h-12 rounded-full flex items-center justify-center
//                   ${
//                     event.status === "completed"
//                       ? "bg-green-100 text-green-600"
//                       : event.status === "current"
//                       ? "bg-blue-100 text-blue-600"
//                       : "bg-gray-100 text-gray-400"
//                   }
//                 `}
//                 >
//                   {event.icon}
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-medium">{event.title}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         {event.description}
//                       </p>
//                     </div>
//                     <span className="text-sm text-muted-foreground">
//                       {event.date}
//                     </span>
//                   </div>
//                   {index < timelineEvents.length - 1 && (
//                     <div className="absolute left-6 ml-[-1px] w-0.5 h-16 bg-gray-200" />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    Clock,
    Printer,
    Package,
    Truck,
    XCircle,
    // AlertCircle,
} from "lucide-react";

interface OrderDetailsProps {
    params: Promise<{
        id: string;
    }>;
}

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

interface TimelineEvent {
    icon: React.ReactNode;
    title: string;
    description: string;
    date: string;
    status: "completed" | "current" | "upcoming" | "cancelled";
}

interface Order {
    id: string;
    productId: string;
    product: {
        name: string;
        description: string;
        imageUrl: string[];
    };
    quantity: number;
    amount: number;
    templateUrl?: string;
    status: OrderStatus;
    createdAt: string;
    user: {
        businessName: string;
        address: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
}

// Dummy orders data
const dummyOrders: Record<string, Order> = {
    ORD001: {
        id: "ORD001",
        productId: "prod1",
        product: {
            name: "Business Cards",
            description: "Premium business cards with matte finish",
            imageUrl: [
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
            ],
        },
        quantity: 500,
        amount: 149.99,
        templateUrl: "template-url-1",
        status: "PENDING",
        createdAt: "2024-01-15",
        user: {
            businessName: "Acme Corp",
            address: "123 Business Street",
            city: "Tech City",
            state: "State",
            pinCode: "12345",
            country: "Country",
        },
    },
    ORD002: {
        id: "ORD002",
        productId: "prod2",
        product: {
            name: "Large Format Banner",
            description: "High-quality vinyl banner for outdoor use",
            imageUrl: [
                "https://images.unsplash.com/photo-1589384267710-7a170981ca78",
            ],
        },
        quantity: 2,
        amount: 299.99,
        templateUrl: "template-url-2",
        status: "COMPLETED",
        createdAt: "2024-01-10",
        user: {
            businessName: "Event Masters",
            address: "456 Event Avenue",
            city: "Event City",
            state: "State",
            pinCode: "67890",
            country: "Country",
        },
    },
    ORD003: {
        id: "ORD003",
        productId: "prod3",
        product: {
            name: "Product Brochures",
            description: "Full-color tri-fold brochures",
            imageUrl: [
                "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
            ],
        },
        quantity: 1000,
        amount: 599.99,
        templateUrl: "template-url-3",
        status: "PROCESSING",
        createdAt: "2024-01-14",
        user: {
            businessName: "Marketing Pro",
            address: "789 Marketing Blvd",
            city: "Marketing City",
            state: "State",
            pinCode: "13579",
            country: "Country",
        },
    },
    ORD004: {
        id: "ORD004",
        productId: "prod4",
        product: {
            name: "Event Flyers",
            description: "Double-sided event flyers",
            imageUrl: [
                "https://images.unsplash.com/photo-1572025442646-866d16c84a54",
            ],
        },
        quantity: 2500,
        amount: 399.99,
        templateUrl: "template-url-4",
        status: "CANCELLED",
        createdAt: "2024-01-08",
        user: {
            businessName: "Event Planners Inc",
            address: "321 Event Street",
            city: "Event City",
            state: "State",
            pinCode: "24680",
            country: "Country",
        },
    },
};

export default function OrderDetailsPage({ params }: OrderDetailsProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const param = use(params);
    useEffect(() => {
        // Simulate API call with dummy data
        setOrder(dummyOrders[param.id] || dummyOrders["ORD001"]);
    }, [param.id]);

    if (!order) return null;

    const getStatusColor = (status: OrderStatus) => {
        const colors = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return colors[status];
    };

    const getTimelineEvents = (order: Order): TimelineEvent[] => {
        const baseDate = new Date(order.createdAt);
        const events: TimelineEvent[] = [
            {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Order Placed",
                description: "Your order has been confirmed",
                date: baseDate.toLocaleDateString(),
                status: "completed",
            },
        ];

        if (order.status === "CANCELLED") {
            events.push({
                icon: <XCircle className="h-6 w-6" />,
                title: "Order Cancelled",
                description: "This order has been cancelled",
                date: new Date(
                    baseDate.getTime() + 1 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString(),
                status: "cancelled",
            });
        } else {
            events.push(
                {
                    icon: <Clock className="h-6 w-6" />,
                    title: "Order Processing",
                    description: "We're preparing your order",
                    date: new Date(
                        baseDate.getTime() + 1 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status:
                        order.status === "PENDING"
                            ? "current"
                            : order.status === "PROCESSING" ||
                                order.status === "COMPLETED"
                              ? "completed"
                              : "upcoming",
                },
                {
                    icon: <Printer className="h-6 w-6" />,
                    title: "Printing Started",
                    description: "Your items are being printed",
                    date: new Date(
                        baseDate.getTime() + 2 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status:
                        order.status === "PROCESSING"
                            ? "current"
                            : order.status === "COMPLETED"
                              ? "completed"
                              : "upcoming",
                },
                {
                    icon: <Package className="h-6 w-6" />,
                    title: "Quality Check",
                    description: "Final quality inspection",
                    date: new Date(
                        baseDate.getTime() + 3 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status:
                        order.status === "COMPLETED" ? "completed" : "upcoming",
                },
                {
                    icon: <Truck className="h-6 w-6" />,
                    title: "Order Completed",
                    description:
                        "Your order has been completed and ready for pickup",
                    date: new Date(
                        baseDate.getTime() + 4 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status:
                        order.status === "COMPLETED" ? "completed" : "upcoming",
                },
            );
        }

        return events;
    };

    const timelineEvents = getTimelineEvents(order);

    return (
        <div className="container mx-auto py-8">
            <Link
                href="/orders"
                className="flex items-center text-primary hover:underline mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
            </Link>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Order {order.id}
                            </h1>
                            <p className="text-muted-foreground">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                            {order.status}
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="font-semibold mb-4">
                                Product Details
                            </h2>
                            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                <Image
                                    src={order.product.imageUrl[0]}
                                    alt={order.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-medium text-lg">
                                {order.product.name}
                            </h3>
                            <p className="text-muted-foreground">
                                {order.product.description}
                            </p>
                            <div className="mt-4 space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Quantity:
                                    </span>{" "}
                                    {order.quantity}
                                </p>
                                <p>
                                    <span className="font-medium">Amount:</span>{" "}
                                    ${order.amount.toFixed(2)}
                                </p>
                                {order.templateUrl && (
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        <Link
                                            href={order.templateUrl}
                                            className="text-primary hover:underline"
                                        >
                                            View Template
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-semibold mb-4">
                                Delivery Details
                            </h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Business Name:
                                    </span>{" "}
                                    {order.user.businessName}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Address:
                                    </span>{" "}
                                    {order.user.address}
                                </p>
                                <p>
                                    <span className="font-medium">City:</span>{" "}
                                    {order.user.city}
                                </p>
                                <p>
                                    <span className="font-medium">State:</span>{" "}
                                    {order.user.state}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        PIN Code:
                                    </span>{" "}
                                    {order.user.pinCode}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Country:
                                    </span>{" "}
                                    {order.user.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="font-semibold mb-6">Order Timeline</h2>
                    <div className="relative">
                        {timelineEvents.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-start mb-8 last:mb-0"
                            >
                                <div
                                    className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                      event.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : event.status === "current"
                            ? "bg-blue-100 text-blue-600"
                            : event.status === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400"
                  }
                `}
                                >
                                    {event.icon}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {event.description}
                                            </p>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {event.date}
                                        </span>
                                    </div>
                                    {index < timelineEvents.length - 1 && (
                                        <div className="absolute left-6 ml-[-1px] w-0.5 h-16 bg-gray-200" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
