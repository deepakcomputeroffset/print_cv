import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecentOrders } from "@/components/admin/recent-orders";
import { RecentTasks } from "@/components/admin/recent-tasks";
import {
    Package,
    Users,
    ShoppingCart,
    User,
    TrendingUp,
    DollarSign,
    Calendar,
    CheckCircle2,
    Clock,
    ListTodo,
    Briefcase,
    BarChart2,
    Star,
    ShoppingBag,
    // UserPlus,
    // Activity,
} from "lucide-react";
import { SalesChart } from "@/components/admin/sales-chart";
import { TopProducts } from "@/components/admin/top-products";

interface AdminStats {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalStaff: number;
    recentOrders: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status:
            | "PENDING"
            | "PROCESSING"
            | "PROCESSED"
            | "DISPATCHED"
            | "CANCELLED"
            | "IMPROPER_ORDER";
        jobId: number | null;
        customerId: number;
        productItemId: number;
        qty: number;
        igst: number;
        uploadCharge: number;
        price: number;
        total: number;
        customer: {
            name: string;
            phone: string;
        };
        productItem: {
            product: {
                name: string;
            };
        };
    }[];
    monthlyOrders: {
        createdAt: Date;
        _sum: {
            total: number | null;
        };
    }[];
    monthlyRevenue: { _sum: { total: number | null } };
    dailyRevenue: { _sum: { total: number | null } };
    // productPriceStats: {
    //     _avg: {
    //         price: number | null;
    //     };
    // };
    availableProducts: number;
    customerCategories: {
        // customerCategory: string;
        _count: { _all: number };
    }[];
    bannedCustomers: number;
    topProducts: {
        id: number;
        name: string;
        sku: string;
        category: string;
        quantity: number;
    }[];
}

export default async function AdminDashboard() {
    const session = await auth();
    if (
        !session ||
        session.user.userType !== "staff" ||
        !session.user.staff?.id
    ) {
        return redirect("/");
    }

    const isAdmin = session.user.staff.role === "ADMIN";
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    try {
        // Get task statistics for the logged-in staff member
        const [completedTasks, inProgressTasks, pendingTasks, todayTasks] =
            await Promise.all([
                Prisma.task.count({
                    where: {
                        assignedStaffId: session.user.staff.id,
                        status: "COMPLETED",
                    },
                }),
                Prisma.task.count({
                    where: {
                        assignedStaffId: session.user.staff.id,
                        status: "IN_PROGRESS",
                    },
                }),
                Prisma.task.count({
                    where: {
                        assignedStaffId: session.user.staff.id,
                        status: "PENDING",
                    },
                }),
                Prisma.task.count({
                    where: {
                        assignedStaffId: session.user.staff.id,
                        createdAt: {
                            gte: startOfToday,
                        },
                    },
                }),
            ]);

        // Get recent tasks for the logged-in staff member
        const recentTasks = await Prisma.task.findMany({
            where: {
                assignedStaffId: session.user.staff.id,
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                job: {
                    select: {
                        name: true,
                    },
                },
                taskType: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        let adminStats: AdminStats | null = null;
        if (isAdmin) {
            // Fetch admin-only statistics using Promise.all for parallel execution
            const [
                totalOrders,
                totalProducts,
                totalCustomers,
                totalStaff,
                recentOrders,
                monthlyOrders,
                monthlyRevenue,
                dailyRevenue,
                // productPriceStats,
                availableProducts,
                customerCategories,
                bannedCustomers,
                topProductItems,
            ] = await Promise.all([
                // Total Orders
                Prisma.order.count(),
                // Total Products
                Prisma.product.count(),
                // Total Customers
                Prisma.customer.count(),
                // Total Staff
                Prisma.staff.count(),
                // Recent Orders
                Prisma.order.findMany({
                    take: 10,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        customer: {
                            select: {
                                name: true,
                                phone: true,
                            },
                        },
                        productItem: {
                            select: {
                                product: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                // Monthly Orders with Total
                Prisma.order.groupBy({
                    by: ["createdAt"],
                    where: {
                        createdAt: {
                            gte: startOfYear,
                            lt: endOfYear,
                        },
                    },
                    _sum: {
                        total: true,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                }),
                // Monthly Revenue
                Prisma.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfYear,
                            lt: endOfYear,
                        },
                    },
                    _sum: {
                        total: true,
                    },
                }),
                // Daily Revenue
                Prisma.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfToday,
                        },
                    },
                    _sum: {
                        total: true,
                    },
                }),
                // Product Price Statistics
                // Prisma.product.aggregate({
                //     _avg: {
                //         price: true,
                //     },
                // }),
                // Available Products Count
                Prisma.product.count({
                    where: {
                        isAvailable: true,
                    },
                }),
                // Customer Categories
                Prisma.customer.groupBy({
                    by: ["customerCategoryId"],
                    _count: {
                        _all: true,
                    },
                }),
                // Banned Customers
                Prisma.customer.count({
                    where: {
                        isBanned: true,
                    },
                }),
                // Top Products by Orders
                Prisma.order.groupBy({
                    by: ["productItemId"],
                    _sum: {
                        qty: true,
                    },
                    orderBy: {
                        _sum: {
                            qty: "desc",
                        },
                    },
                    take: 5,
                }),
            ]);

            // Get product details for top products
            const productDetails = await Promise.all(
                topProductItems.map(async (item) => {
                    const productItem = await Prisma.productItem.findUnique({
                        where: { id: item.productItemId },
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true,
                                    category: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    });

                    return {
                        id: productItem?.product.id || 0,
                        name: productItem?.product.name || "Unknown Product",
                        sku: productItem?.product.sku || "N/A",
                        category:
                            productItem?.product.category?.name ||
                            "Uncategorized",
                        quantity: item._sum.qty || 0,
                    };
                }),
            );

            // Remove duplicates and sort
            const topProducts = productDetails
                .reduce(
                    (acc, current) => {
                        const x = acc.find((item) => item.id === current.id);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            x.quantity += current.quantity;
                            return acc;
                        }
                    },
                    [] as typeof productDetails,
                )
                .sort((a, b) => b.quantity - a.quantity);

            adminStats = {
                totalOrders,
                totalProducts,
                totalCustomers,
                totalStaff,
                recentOrders,
                monthlyOrders,
                monthlyRevenue,
                dailyRevenue,
                // productPriceStats,
                availableProducts,
                customerCategories,
                bannedCustomers,
                topProducts,
            };
        }

        return (
            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="w-8 h-8" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Task Overview Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                        Task Overview
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Completed Tasks
                                </CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">
                                    {completedTasks}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tasks completed successfully
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    In Progress
                                </CardTitle>
                                <Clock className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">
                                    {inProgressTasks}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Currently working on
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Pending Tasks
                                </CardTitle>
                                <ListTodo className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">
                                    {pendingTasks}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Waiting to be started
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Today&apos;s Tasks
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">
                                    {todayTasks}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tasks assigned today
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Recent Tasks Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-gray-500" />
                        Recent Tasks
                    </h2>
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <RecentTasks tasks={recentTasks} />
                        </CardContent>
                    </Card>
                </section>

                {/* Admin Dashboard Section */}
                {isAdmin && adminStats && (
                    <>
                        {/* Business Overview Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-gray-500" />
                                Business Overview
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <InfoCard
                                    name="Total Orders"
                                    count={adminStats.totalOrders}
                                    icon={
                                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                                    }
                                    color="blue"
                                    description="Total orders received"
                                />
                                <InfoCard
                                    name="Total Products"
                                    count={adminStats.totalProducts}
                                    icon={
                                        <Package className="h-4 w-4 text-green-500" />
                                    }
                                    color="green"
                                    description="Products in inventory"
                                />
                                <InfoCard
                                    name="Total Customers"
                                    count={adminStats.totalCustomers}
                                    icon={
                                        <Users className="h-4 w-4 text-purple-500" />
                                    }
                                    color="purple"
                                    description="Registered customers"
                                />
                                <InfoCard
                                    name="Total Staff"
                                    count={adminStats.totalStaff}
                                    icon={
                                        <User className="h-4 w-4 text-orange-500" />
                                    }
                                    color="orange"
                                    description="Active staff members"
                                />
                            </div>
                        </section>

                        {/* Revenue Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-gray-500" />
                                Revenue Overview
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-semibold">
                                                Monthly Revenue
                                            </CardTitle>
                                            <Calendar className="h-5 w-5 text-gray-500" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            ₹
                                            {adminStats.monthlyRevenue._sum?.total?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Total revenue this month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-semibold">
                                                Daily Revenue
                                            </CardTitle>
                                            <TrendingUp className="h-5 w-5 text-gray-500" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            ₹
                                            {adminStats.dailyRevenue._sum?.total?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Revenue today
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Analytics Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-gray-500" />
                                Analytics
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">
                                            Recent Orders
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentOrders
                                            orders={adminStats.recentOrders}
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">
                                            Sales Analytics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <SalesChart
                                            data={processMonthlyData(
                                                adminStats.monthlyOrders,
                                                currentYear,
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Product Analytics Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5 text-gray-500" />
                                Product Analytics
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* <Card className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Average Price
                                        </CardTitle>
                                        <Tag className="h-4 w-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            ₹
                                            {adminStats.productPriceStats._avg?.price?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Average product price
                                        </p>
                                    </CardContent>
                                </Card> */}

                                <Card className="bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Available Products
                                        </CardTitle>
                                        <ShoppingBag className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {adminStats.availableProducts}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Products in stock
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* <Card className="bg-purple-50 hover:bg-purple-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Min Price
                                        </CardTitle>
                                        <Tag className="h-4 w-4 text-purple-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            ₹
                                            {adminStats.productPriceStats._avg?.minPrice?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Minimum product price
                                        </p>
                                    </CardContent>
                                </Card> */}

                                {/* <Card className="bg-orange-50 hover:bg-orange-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Max Price
                                        </CardTitle>
                                        <Tag className="h-4 w-4 text-orange-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            ₹
                                            {adminStats.productPriceStats._avg?.maxPrice?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maximum product price
                                        </p>
                                    </CardContent>
                                </Card> */}
                            </div>
                        </section>

                        {/* Customer Analytics Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                Customer Analytics
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* <Card className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            High Value
                                        </CardTitle>
                                        <Star className="h-4 w-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {adminStats.customerCategories.find(
                                                (c) =>
                                                    c.customerCategory ===
                                                    "HIGH",
                                            )?._count?._all || 0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            High value customers
                                        </p>
                                    </CardContent>
                                </Card> */}

                                {/* <Card className="bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Medium Value
                                        </CardTitle>
                                        <UserPlus className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {adminStats.customerCategories.find(
                                                (c) =>
                                                    c.customerCategory ===
                                                    "MEDIUM",
                                            )?._count?._all || 0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Medium value customers
                                        </p>
                                    </CardContent>
                                </Card> */}

                                {/* <Card className="bg-purple-50 hover:bg-purple-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Low Value
                                        </CardTitle>
                                        <Activity className="h-4 w-4 text-purple-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {adminStats.customerCategories.find(
                                                (c) =>
                                                    c.customerCategory ===
                                                    "LOW",
                                            )?._count?._all || 0}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Low value customers
                                        </p>
                                    </CardContent>
                                </Card> */}

                                <Card className="bg-red-50 hover:bg-red-100 transition-all duration-300 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Banned
                                        </CardTitle>
                                        <User className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {adminStats.bannedCustomers}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Banned customers
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Top Products Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Star className="h-5 w-5 text-gray-500" />
                                Top Products
                            </h2>
                            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <TopProducts
                                        products={adminStats.topProducts}
                                    />
                                </CardContent>
                            </Card>
                        </section>
                    </>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-red-600">
                    Error loading dashboard
                </h1>
                <p className="text-gray-600">Please try refreshing the page</p>
            </div>
        );
    }
}

// Helper function to process monthly data
function processMonthlyData(
    monthlyOrders: AdminStats["monthlyOrders"],
    currentYear: number,
) {
    return Array.from({ length: 12 }, (_, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 0);

        const monthOrders = monthlyOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= monthStart && orderDate <= monthEnd;
        });

        return {
            name: monthStart.toLocaleString("en-US", { month: "short" }),
            total: monthOrders.reduce(
                (sum, order) => sum + (order._sum?.total || 0),
                0,
            ),
        };
    });
}

interface InfoCardProps {
    name: string;
    count: number;
    icon: React.ReactNode;
    color: "blue" | "green" | "purple" | "orange";
    description: string;
}

const InfoCard = ({ name, count, icon, color, description }: InfoCardProps) => {
    const colorClasses = {
        blue: "bg-blue-50 hover:bg-blue-100",
        green: "bg-green-50 hover:bg-green-100",
        purple: "bg-purple-50 hover:bg-purple-100",
        orange: "bg-orange-50 hover:bg-orange-100",
    };

    return (
        <Card
            className={`${colorClasses[color]} transition-all duration-300 hover:shadow-lg`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {name}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    );
};
