"use client";

import { ProductForm } from "@/components/admin/product/form/add-product-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function CreateProductPage() {
    return (
        <div className="container mx-auto overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Create New Product</h1>
            </div>
            <ProductForm />
        </div>
    );
}
