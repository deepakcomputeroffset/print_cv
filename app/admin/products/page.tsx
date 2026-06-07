import { Plus } from "lucide-react";
import Link from "next/link";

import { QueryParams } from "@/types/types";
import { ProductFilter } from "@/components/admin/product/product-filter";
import { ProductLists } from "@/components/admin/product/product-lists";
import React from "react";

export default function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    return (
        <div className="space-y-6 h-full">
            <div className="gmail-page-header">
                <h1 className="gmail-page-title">Products</h1>
                <Link
                    href={"/admin/products/create"}
                    className="flex items-center px-2 border py-2 rounded-md"
                >
                    <Plus className="h-4 w-4" />
                </Link>
            </div>

            <ProductFilter filters={filters} />

            <ProductLists filters={filters} />
        </div>
    );
}
