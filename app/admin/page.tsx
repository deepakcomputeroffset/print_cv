import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/admin/overview";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecentOrders } from "@/components/admin/recent-orders";

export default async function AdminDashboard() {
    const session = await auth();
    if (!session || session.user.userType !== "staff") {
        return redirect("/");
    }

    const currentYear = new Date().getFullYear();
    const [
        totalOrders,
        totalProducts,
        totalCustomers,
        totalStaff,
        recentOrders,
        orders,
    ] = await Prisma.$transaction([
        Prisma.order.count(),
        Prisma.product.count(),
        Prisma.customer.count(),
        Prisma.staff.count(),
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
            },
        }),
        Prisma.order.groupBy({
            by: ["createdAt"],
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01T00:00:00.000Z`), // From Jan 1st of current year
                    lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`), // Before Jan 1st of next year
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        }),
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        name: new Date(currentYear, index, 1).toLocaleString("en-US", {
            month: "short",
        }), // Convert index to month name
        total: orders
            .filter((o) => new Date(o.createdAt).getMonth() === index)
            .reduce((sum, o) => sum + (o._sum?.amount || 0), 0),
    }));

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <InfoCard name="Total Orders" count={totalOrders} />
                <InfoCard name="Total Products" count={totalProducts} />
                <InfoCard name="Total Customers" count={totalCustomers} />
                <InfoCard name="Total Staff" count={totalStaff} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={monthlyData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentOrders orders={recentOrders} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const InfoCard = ({ name, count }: { name: string; count: number }) => {
    return (
        <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
            </CardContent>
        </Card>
    );
};
