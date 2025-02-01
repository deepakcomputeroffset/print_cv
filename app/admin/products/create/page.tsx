"use client";

import { ProductForm } from "@/components/product/form/add-product-form";

export default function CreateProductPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
            <ProductForm />
        </div>
    );
}
