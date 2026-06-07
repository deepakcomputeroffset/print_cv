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
    CheckCircle2,
    Clock,
    ListTodo,
    Briefcase,
    BarChart2,
    Star,
    ShoppingBag,
    Calendar,
} from "lucide-react";
import { SalesChart } from "@/components/admin/sales-chart";
import { TopProducts } from "@/components/admin/top-products";
import { order } from "@prisma/client";

interface AdminStats {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalStaff: number;
    recentOrders: (order & {
        customer: {
            name: string;
            phone: string;
        };
        productItem: {
            product: {
                name: string;
            };
        };
    })[];
    monthlyOrders: {
        createdAt: Date;
        _sum: {
            total: number | null;
        };
    }[];
    monthlyRevenue: { _sum: { total: number | null } };
    dailyRevenue: { _sum: { total: number | null } };
    availableProducts: number;
    customerCategories: {
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
                availableProducts,
                customerCategories,
                bannedCustomers,
                topProducts,
            };
        }

        return (
            <div className="space-y-6">
                {/* Welcome + Date */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="gmail-page-title">
                            Welcome back, {session.user.staff.name}
                        </h1>
                        <p className="text-sm text-gmail-text-secondary mt-0.5">
                            Here&apos;s what&apos;s happening today
                        </p>
                    </div>
                    <div className="text-sm text-gmail-text-secondary px-3 py-1.5 rounded-full bg-gmail-surface">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Task Stats — Flat metric tiles */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatTile
                        label="Completed"
                        value={completedTasks}
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        iconColor="text-green-500"
                        iconBg="bg-green-50"
                    />
                    <StatTile
                        label="In Progress"
                        value={inProgressTasks}
                        icon={<Clock className="w-5 h-5" />}
                        iconColor="text-blue-500"
                        iconBg="bg-blue-50"
                    />
                    <StatTile
                        label="Pending"
                        value={pendingTasks}
                        icon={<ListTodo className="w-5 h-5" />}
                        iconColor="text-yellow-600"
                        iconBg="bg-yellow-50"
                    />
                    <StatTile
                        label="Today"
                        value={todayTasks}
                        icon={<Calendar className="w-5 h-5" />}
                        iconColor="text-purple-500"
                        iconBg="bg-purple-50"
                    />
                </div>

                {/* Recent Tasks */}
                <div className="gmail-section">
                    <div className="gmail-section-header">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gmail-text-secondary" />
                            <span className="gmail-section-title">Recent Tasks</span>
                        </div>
                    </div>
                    <div className="gmail-section-body">
                        <RecentTasks tasks={recentTasks} />
                    </div>
                </div>

                {/* Admin Dashboard Section */}
                {isAdmin && adminStats && (
                    <>
                        {/* Business Overview Stats */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatTile
                                label="Total Orders"
                                value={adminStats.totalOrders}
                                icon={<ShoppingCart className="w-5 h-5" />}
                                iconColor="text-blue-500"
                                iconBg="bg-blue-50"
                            />
                            <StatTile
                                label="Products"
                                value={adminStats.totalProducts}
                                icon={<Package className="w-5 h-5" />}
                                iconColor="text-green-500"
                                iconBg="bg-green-50"
                            />
                            <StatTile
                                label="Customers"
                                value={adminStats.totalCustomers}
                                icon={<Users className="w-5 h-5" />}
                                iconColor="text-indigo-500"
                                iconBg="bg-indigo-50"
                            />
                            <StatTile
                                label="Staff"
                                value={adminStats.totalStaff}
                                icon={<User className="w-5 h-5" />}
                                iconColor="text-orange-500"
                                iconBg="bg-orange-50"
                            />
                        </div>

                        {/* Revenue Row */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="gmail-stat-card">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gmail-text-secondary">
                                        Yearly Revenue
                                    </span>
                                    <DollarSign className="w-4 h-4 text-gmail-text-secondary" />
                                </div>
                                <div className="text-2xl font-semibold text-gmail-text">
                                    ₹{adminStats.monthlyRevenue._sum?.total?.toLocaleString() || 0}
                                </div>
                                <p className="text-xs text-gmail-text-secondary mt-1">
                                    Total revenue this year
                                </p>
                            </div>
                            <div className="gmail-stat-card">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gmail-text-secondary">
                                        Today&apos;s Revenue
                                    </span>
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="text-2xl font-semibold text-gmail-text">
                                    ₹{adminStats.dailyRevenue._sum?.total?.toLocaleString() || 0}
                                </div>
                                <p className="text-xs text-gmail-text-secondary mt-1">
                                    Revenue earned today
                                </p>
                            </div>
                        </div>

                        {/* Analytics — Orders + Chart side by side */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="gmail-section">
                                <div className="gmail-section-header">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4 text-gmail-text-secondary" />
                                        <span className="gmail-section-title">Recent Orders</span>
                                    </div>
                                </div>
                                <div className="gmail-section-body">
                                    <RecentOrders
                                        orders={adminStats.recentOrders}
                                    />
                                </div>
                            </div>
                            <div className="gmail-section">
                                <div className="gmail-section-header">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-gmail-text-secondary" />
                                        <span className="gmail-section-title">Sales Analytics</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <SalesChart
                                        data={processMonthlyData(
                                            adminStats.monthlyOrders,
                                            currentYear,
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product & Customer Analytics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <StatTile
                                label="Available Products"
                                value={adminStats.availableProducts}
                                icon={<ShoppingBag className="w-5 h-5" />}
                                iconColor="text-green-500"
                                iconBg="bg-green-50"
                            />
                            <StatTile
                                label="Banned Customers"
                                value={adminStats.bannedCustomers}
                                icon={<User className="w-5 h-5" />}
                                iconColor="text-red-500"
                                iconBg="bg-red-50"
                            />
                        </div>

                        {/* Top Products */}
                        <div className="gmail-section">
                            <div className="gmail-section-header">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gmail-text-secondary" />
                                    <span className="gmail-section-title">Top Products</span>
                                </div>
                            </div>
                            <div className="gmail-section-body">
                                <TopProducts
                                    products={adminStats.topProducts}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-lg font-medium text-gmail-text mb-1">
                        Error loading dashboard
                    </h2>
                    <p className="text-sm text-gmail-text-secondary">
                        Please try refreshing the page
                    </p>
                </div>
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

// Gmail-style flat stat tile component
interface StatTileProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
}

const StatTile = ({ label, value, icon, iconColor, iconBg }: StatTileProps) => (
    <div className="gmail-stat-card">
        <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg} ${iconColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-semibold text-gmail-text">{value.toLocaleString()}</p>
                <p className="text-xs font-medium text-gmail-text-secondary mt-0.5">{label}</p>
            </div>
        </div>
    </div>
);
