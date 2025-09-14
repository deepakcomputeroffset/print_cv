import { product } from "@prisma/client";
import { motion } from "motion/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

interface ProductHeaderProps {
    product: product;
    isCompact?: boolean;
    isProductPage?: boolean;
}

export default function ProductHeader({
    product,
    isCompact = false,
    isProductPage = true,
}: ProductHeaderProps) {
    if (isCompact) {
        return (
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        Premium Product
                    </span>
                </div>

                <h1
                    className={cn(
                        "text-xl md:text-2xl font-bold mb-3 ml leading-tight",
                        sourceSerif4.className,
                    )}
                >
                    <span className="text-gray-800">{product.name}</span>
                </h1>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            <Breadcrumb className="mb-3">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/"
                            className="cursor-pointer text-gray-600 hover:text-primary"
                        >
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href="/categories"
                            className="cursor-pointer text-gray-600 hover:text-primary"
                        >
                            Categories
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {isProductPage && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={`/products?categoryId=${product.categoryId}`}
                                    className="cursor-pointer text-gray-600 hover:text-primary"
                                >
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary font-medium">
                            {product.name}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </motion.div>
    );
}
