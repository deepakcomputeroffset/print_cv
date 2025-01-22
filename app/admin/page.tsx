import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/admin/overview";
import { RecentOrders } from "@/components/admin/recent-orders";

export default async function AdminDashboard() {
    const datas = [
        {
            name: "total orders",
            count: 43554,
        },
        {
            name: "total products",
            count: 43554,
        },
        {
            name: "total customers",
            count: 43554,
        },
        {
            name: "recent orders",
            count: 43554,
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                {datas?.map((data) => (
                    <Card key={data.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {data?.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.count}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentOrders
                            orders={[
                                {
                                    id: "order1",
                                    user: {
                                        name: "John Doe",
                                        email: "john@example.com",
                                    },
                                    items: [
                                        {
                                            id: "item1",
                                            product: {
                                                name: "Premium Business Cards",
                                                price: 49.99,
                                            },
                                            quantity: 2,
                                            price: 99.98,
                                        },
                                    ],
                                    status: "COMPLETED",
                                    totalAmount: 99.98,
                                    createdAt: "2024-03-01T10:00:00Z",
                                },
                                {
                                    id: "order2",
                                    user: {
                                        name: "Jane Smith",
                                        email: "jane@example.com",
                                    },
                                    items: [
                                        {
                                            id: "item2",
                                            product: {
                                                name: "Vinyl Banner",
                                                price: 79.99,
                                            },
                                            quantity: 1,
                                            price: 79.99,
                                        },
                                    ],
                                    status: "PENDING",
                                    totalAmount: 79.99,
                                    createdAt: "2024-03-10T15:30:00Z",
                                },
                                {
                                    id: "order3",
                                    user: {
                                        name: "Mike Johnson",
                                        email: "mike@example.com",
                                    },
                                    items: [
                                        {
                                            id: "item3",
                                            product: {
                                                name: "Tri-fold Brochure",
                                                price: 199.99,
                                            },
                                            quantity: 3,
                                            price: 599.97,
                                        },
                                    ],
                                    status: "PROCESSING",
                                    totalAmount: 599.97,
                                    createdAt: "2024-03-15T09:45:00Z",
                                },
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
