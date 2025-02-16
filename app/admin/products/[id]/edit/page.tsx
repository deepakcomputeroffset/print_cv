import { EditProductForm } from "@/components/admin/product/form/edit-product-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    try {
        const id = (await params).id;
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                productItems: {
                    include: {
                        productAttributeOptions: {
                            include: {
                                productAttributeType: true,
                            },
                        },
                    },
                },
            },
        });
        if (!product) {
            return (
                <div className="container mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <SidebarTrigger className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                    </div>
                    <div>Product not found!</div>
                </div>
            );
        }
        return (
            <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Edit Product</h1>
                </div>
                <EditProductForm product={product} />
            </div>
        );
    } catch (error) {
        return (
            <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Edit Product</h1>
                </div>
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error while fetching products
                    {error instanceof Error
                        ? error.message
                        : "An error occurred"}
                </div>
            </div>
        );
    }
}
