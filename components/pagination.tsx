"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, HTMLAttributes } from "react";

interface prop extends HTMLAttributes<HTMLDivElement> {
    totalPage: number;
    isLoading: boolean;
}

const Pagination: FC<prop> = ({
    isLoading,
    totalPage,
    className,
    ...props
}) => {
    const { replace } = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams!);

    const page = Number(searchParams?.get("page")) || 1;
    const hasPrev = page > 1;
    const hasNext = page < totalPage;

    const pageHandler = (type: "prev" | "next" | "first" | "last") => {
        if (type === "first") {
            params.set("page", "1");
        } else if (type === "last") {
            params.set("page", `${totalPage}`);
        } else if (type === "prev") {
            params.set("page", `${page - 1}`);
        } else if (type === "next") {
            params.set("page", `${page + 1}`);
        }
        replace(`${path}?${params}`);
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between mt-4 gap-4",
                className,
            )}
            {...props}
        >
            <div className="text-sm text-muted-foreground">
                Page {page} of {totalPage}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    onClick={() => pageHandler("first")}
                    disabled={page <= 1 || isLoading}
                    className="hidden h-8 w-8 p-0 lg:flex"
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    onClick={() => pageHandler("prev")}
                    disabled={!hasPrev || isLoading}
                    className="hidden h-8 w-8 p-0 lg:flex"
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => pageHandler("next")}
                    disabled={!hasNext || isLoading}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => pageHandler("last")}
                    disabled={page >= totalPage || isLoading}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
