import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
    IndianRupee,
    Wallet,
    Calendar,
    BarChart3,
    ShoppingBag,
    Package,
    Users,
    ArrowRight,
    ArrowUpRight,
    ArrowDownLeft,
} from "lucide-react";
import UpiQrCode from "@/components/quCode";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
    const session = await auth();

    if (!session || session.user.userType != "customer") {
        redirect("/");
    }

    const [recentTransactions, wallet, orders] = await Prisma.$transaction([
        Prisma.transaction.findMany({
            where: {
                walletId: session?.user?.customer?.wallet?.id,
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        }),
        Prisma.wallet.findUnique({
            where: {
                customerId: session?.user?.customer?.id,
            },
        }),
        Prisma.order.findMany({
            where: {
                customerId: session?.user?.customer?.id,
            },
            take: 3,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                productItem: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    // Calculate order stats
    // const pendingOrders = orders.filter(
    //     (order) => (order?.status as string) === "PENDING",
    // ).length;
    const processingOrders = orders?.filter(
        (order) => (order?.status as string) === "PROCESSING",
    ).length;
    const completedOrders = orders?.filter(
        (order) => (order?.status as string) === "COMPLETED",
    ).length;
    const totalOrders = orders.length;

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700 border-green-200";
            case "DISPATCHED":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "PROCESSING":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "PENDING":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-purple-800 pb-16">
                <div className="max-w-customHaf lg:max-w-custom mx-auto px-4 pt-10">
                    <div className="py-6">
                        <h1
                            className={cn(
                                "text-3xl font-bold text-white mb-2",
                                sourceSerif4.className,
                            )}
                        >
                            Welcome back,{" "}
                            {session.user?.customer?.name || "Customer"}
                        </h1>
                        <p className="text-blue-100 opacity-80">
                            Manage your orders, wallet and account from your
                            personalized dashboard
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-customHaf lg:max-w-custom mx-auto px-4 -mt-10">
                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Wallet Balance Card */}
                    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <div className="text-gray-500 flex items-center text-sm mb-2">
                                    <Wallet className="h-4 w-4 mr-2 text-blue-500" />
                                    Available Balance
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-800 font-semibold text-xl">
                                        ₹ {wallet?.balance.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Overview */}
                    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <div className="text-gray-500 flex items-center text-sm mb-2">
                                    <ShoppingBag className="h-4 w-4 mr-2 text-amber-500" />
                                    Total Orders
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-800 font-semibold text-xl">
                                        {totalOrders}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Orders */}
                    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <div className="text-gray-500 flex items-center text-sm mb-2">
                                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                                    Orders in progress
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-800 font-semibold text-xl">
                                        {processingOrders}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed Orders */}
                    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <div className="text-gray-500 flex items-center text-sm mb-2">
                                    <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                                    Delivered orders
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-800 font-semibold text-xl">
                                        {completedOrders}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Orders */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-gray-600" />
                                    <h2 className="text-lg font-medium text-gray-800">
                                        Recent Orders
                                    </h2>
                                </div>
                                <Link
                                    href="/customer/orders"
                                    className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                    View all{" "}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>

                            <Card className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <CardContent className="p-0">
                                    {orders.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="p-4 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center">
                                                            <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden relative mr-3 flex-shrink-0">
                                                                {order
                                                                    .productItem
                                                                    ?.product
                                                                    ?.imageUrl?.[0] && (
                                                                    <div
                                                                        className="w-full h-full bg-cover bg-center"
                                                                        style={{
                                                                            backgroundImage: `url(${order.productItem.product.imageUrl[0]})`,
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-800">
                                                                    Order #
                                                                    {order?.id}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {
                                                                        order
                                                                            ?.productItem
                                                                            ?.product
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                                                    <Calendar className="h-3 w-3 mr-1" />
                                                                    {format(
                                                                        order?.createdAt,
                                                                        "dd MMM yyyy",
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <Badge
                                                                className={cn(
                                                                    "text-xs px-2 py-1 mb-2",
                                                                    getStatusColor(
                                                                        order?.status as string,
                                                                    ),
                                                                )}
                                                            >
                                                                {order?.status}
                                                            </Badge>
                                                            <span className="font-medium text-blue-600">
                                                                ₹
                                                                {order?.total?.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p>No recent orders found</p>
                                            <Button
                                                asChild
                                                variant="link"
                                                className="mt-2 text-blue-600"
                                            >
                                                <Link href="/categories">
                                                    Browse Products
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Transactions */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <IndianRupee className="h-5 w-5 mr-2 text-gray-600" />
                                    <h2 className="text-lg font-medium text-gray-800">
                                        Recent Transactions
                                    </h2>
                                </div>
                                <Link
                                    href="/customer/wallet"
                                    className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                    View all{" "}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>

                            <Card className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <CardContent className="p-4">
                                    {recentTransactions?.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-gray-50">
                                                        <TableHead className="whitespace-nowrap">
                                                            Transaction
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Date
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Amount
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Type
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Description
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {recentTransactions?.map(
                                                        (transaction) => (
                                                            <TableRow
                                                                key={
                                                                    transaction?.id
                                                                }
                                                                className="hover:bg-gray-50/50"
                                                            >
                                                                <TableCell className="font-medium">
                                                                    #
                                                                    {
                                                                        transaction.id
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-600">
                                                                    {format(
                                                                        transaction?.createdAt,
                                                                        "dd/MM/yyyy",
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div
                                                                        className={cn(
                                                                            "flex items-center font-medium",
                                                                            transaction?.type ===
                                                                                "CREDIT"
                                                                                ? "text-green-600"
                                                                                : "text-red-600",
                                                                        )}
                                                                    >
                                                                        {transaction.type ===
                                                                        "CREDIT" ? (
                                                                            <ArrowDownLeft className="h-3.5 w-3.5 mr-1" />
                                                                        ) : (
                                                                            <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                                                                        )}
                                                                        ₹
                                                                        {transaction.amount.toFixed(
                                                                            2,
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        className={
                                                                            transaction?.type ===
                                                                            "CREDIT"
                                                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                                                : "bg-red-100 text-red-700 hover:bg-red-100"
                                                                        }
                                                                    >
                                                                        {
                                                                            transaction?.type
                                                                        }
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-600">
                                                                    {
                                                                        transaction?.description
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <IndianRupee className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p>No recent transactions</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* QR Code Card */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <IndianRupee className="h-5 w-5 mr-2 text-gray-600" />
                                <h2 className="text-lg font-medium text-gray-800">
                                    Add Money to Wallet
                                </h2>
                            </div>

                            <Card className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <CardContent className="p-4">
                                    <UpiQrCode />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Quick Actions
                                </h2>
                            </div>

                            <Card className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="justify-start h-auto py-3 border-gray-200"
                                        >
                                            <Link href="/customer/orders">
                                                <Package className="h-5 w-5 mr-3 text-blue-600" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        My Orders
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        View and track your
                                                        orders
                                                    </p>
                                                </div>
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="justify-start h-auto py-3 border-gray-200"
                                        >
                                            <Link href="/categories">
                                                <ShoppingBag className="h-5 w-5 mr-3 text-amber-600" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        Browse Products
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Explore our catalog
                                                    </p>
                                                </div>
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="justify-start h-auto py-3 border-gray-200"
                                        >
                                            <Link href="/customer/wallet">
                                                <Wallet className="h-5 w-5 mr-3 text-green-600" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        My Wallet
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        View transactions and
                                                        add funds
                                                    </p>
                                                </div>
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="justify-start h-auto py-3 border-gray-200"
                                        >
                                            <Link href="/customer/edit">
                                                <Users className="h-5 w-5 mr-3 text-blue-600" />
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        My Profile
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Update your information
                                                    </p>
                                                </div>
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
