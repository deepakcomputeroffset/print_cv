import ProductLists from "../../../components/product/list";
import { Prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Button } from "@/components/ui/button";

export default async function ProductPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId: string }>;
}) {
    const params = await searchParams;

    if (isNaN(parseInt(params?.categoryId))) {
        redirect("/categories");
    }

    const category = await Prisma.productCategory.findUnique({
        where: { id: parseInt(params?.categoryId) },
        select: { name: true, parentCategory: { select: { name: true } } },
    });
    const products = await Prisma.product.findMany({
        where: params?.categoryId
            ? {
                  categoryId: parseInt(params?.categoryId),
                  isAvailable: true,
                  productItems: { some: {} },
              }
            : {},
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
        },
    });

    if (products.length <= 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
                <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 p-8 rounded-full shadow-md border border-primary/10">
                    <Package className="w-16 h-16 text-primary/70" />
                </div>

                <h2
                    className={cn(
                        "text-3xl font-bold mt-8 mb-3",
                        sourceSerif4.className,
                    )}
                >
                    <span>No Products</span>{" "}
                    <span className="text-primary relative inline-block">
                        Available
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                    </span>
                </h2>

                <p className="text-gray-600 mt-2 max-w-md mb-8">
                    It seems like we don&apos;t have any products listed in this
                    category right now. Please check back later or browse other
                    categories.
                </p>

                <Link href="/categories">
                    <Button className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 px-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Browse Categories
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <ProductLists products={products} category={category} />
        </div>
    );
}
