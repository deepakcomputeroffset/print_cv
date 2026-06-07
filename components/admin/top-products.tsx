"use client";

import { Package, TrendingUp } from "lucide-react";

interface TopProduct {
    id: number;
    name: string;
    sku: string;
    category: string;
    quantity: number;
}

interface TopProductsProps {
    products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
    const maxQty = Math.max(...products.map((p) => p.quantity), 1);

    return (
        <div className="divide-y" style={{ borderColor: "hsl(var(--gmail-border))" }}>
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gmail-hover transition-colors cursor-default"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gmail-surface text-gmail-text-secondary text-xs font-bold">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-gmail-text-secondary flex-shrink-0" />
                            <p className="text-sm font-medium text-gmail-text truncate">
                                {product.name}
                            </p>
                        </div>
                        <p className="text-xs text-gmail-text-secondary mt-0.5">
                            {product.category} · <span className="font-mono">{product.sku}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Mini progress bar */}
                        <div className="hidden sm:block w-20 h-1.5 bg-gmail-surface rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gmail-blue rounded-full transition-all"
                                style={{ width: `${(product.quantity / maxQty) * 100}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-gmail-text min-w-[50px] justify-end">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            {product.quantity}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
