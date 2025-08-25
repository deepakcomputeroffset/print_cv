import { Suspense } from "react";
import { List } from "@/components/category/list";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Prisma } from "@/lib/prisma";
import RecentOrderList from "@/components/order/recentOrderList";
import { unstable_cache } from "next/cache";

export default async function ProductCategoryPage({
    params,
}: {
    params: Promise<{ parentCategoryId: string }>;
}) {
    const session = await auth();

    const { parentCategoryId } = await params;

    async function getData() {
        return await Promise.all([
            Prisma?.productCategory.findMany({
                where: {
                    parentCategoryId: Number(parentCategoryId) ?? null,
                },
                include: {
                    _count: { select: { subCategories: true } },
                    parentCategory: true,
                },
                orderBy: {
                    id: "asc",
                },
            }),

            Prisma?.order.findMany({
                where: {
                    customerId: session?.user?.customer?.id,
                },
                include: {
                    productItem: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 10,
            }),
        ]);
    }
    const cachedData = unstable_cache(getData, ["categories-orders"], {
        revalidate: 60 * 60,
        // revalidate: 1,
        tags: ["categories-orders"],
    });

    const [categories, orders] = await cachedData();
    const sortedCategories = categories.sort((a, b) => {
        if (a.isAvailable !== b.isAvailable) {
            return a.isAvailable ? -1 : 1;
        }
        return a.id - b.id;
    });
    if (!sortedCategories || sortedCategories?.length === 0) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                    <div className="bg-white p-6 rounded-full shadow-lg">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                        No Product Categories Found
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-md">
                        It looks like there are no categories available at the
                        moment. Please check back later or explore other
                        sections of our store.
                    </p>

                    <Link
                        href={"/"}
                        className="mt-6 bg-dominant-color-2 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
                {session?.user?.userType === "customer" && (
                    <RecentOrderList orders={orders} />
                )}
            </div>
        );
    }
    return (
        <Suspense
            fallback={
                <div className="container grid grid-cols-3 lg:grid-cols-5 gap-4 px-3 w-full h-full mx-auto py-10">
                    {Array.from({ length: 15 })
                        .fill(null)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full h-full min-h-36 min-w-36 rounded-lg"
                            />
                        ))}
                </div>
            }
        >
            <div>
                <div className="mx-auto px-[5vw] container space-y-7">
                    <List categories={sortedCategories} />
                    {session?.user?.userType === "customer" && (
                        <RecentOrderList orders={orders} />
                    )}
                </div>
            </div>
        </Suspense>
    );
}
