import { Suspense } from "react";
import { ProductCategoryList } from "./product-category";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import RecentOrders from "../order/recentOrders";
import { auth } from "@/lib/auth";
import { Skeleton } from "../ui/skeleton";
import { Prisma } from "@/lib/prisma";
import { Footer } from "../landingPage/footer";

export default async function ProductCategoryPage({
    params,
}: {
    params?: { parentCategoryId: string };
}) {
    const session = await auth();

    const categories = await Prisma?.productCategory.findMany({
        where: {
            parentCategoryId: Number(params?.parentCategoryId) ?? null,
        },
        include: {
            _count: { select: { subCategories: true } },
            parentCategory: true,
        },
        orderBy: {
            isAvailable: "desc",
        },
    });

    if (!categories || categories?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <div className="bg-white p-6 rounded-full shadow-lg">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                    No Product Categories Found
                </h2>
                <p className="text-gray-600 mt-2 max-w-md">
                    It looks like there are no categories available at the
                    moment. Please check back later or explore other sections of
                    our store.
                </p>

                <Link
                    href={"/"}
                    className="mt-6 bg-dominant-color-2 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <Suspense
            fallback={
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-3 w-full h-full mx-auto py-10">
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
                <div className="mx-auto px-[5vw] space-y-7">
                    <ProductCategoryList categories={categories} />
                    {session?.user?.userType === "customer" && (
                        <RecentOrders session={session} />
                    )}
                </div>

                <Footer />
            </div>
        </Suspense>
    );
}
