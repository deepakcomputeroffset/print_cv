"use client";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC } from "react";

interface prop {
    totalPage: number;
    isLoading: boolean;
}

const Pagination: FC<prop> = ({ isLoading, totalPage }) => {
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
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                Page {page} of {totalPage}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => pageHandler("first")}
                    disabled={page <= 1 || isLoading}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => pageHandler("prev")}
                    disabled={!hasPrev || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => pageHandler("next")}
                    disabled={!hasNext || isLoading}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => pageHandler("last")}
                    disabled={page >= totalPage || isLoading}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
