"use client";
import { Button } from "@/components/ui/button";
import { per_page_data } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC } from "react";
import { Badge } from "./ui/badge";

interface prop {
    total: number;
    isLoading: boolean;
}

const Pagination: FC<prop> = ({ total, isLoading }) => {
    const { replace } = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();

    const page = Number(searchParams?.get("page")) || 1;

    const params = new URLSearchParams(searchParams!);

    const hasPrev = per_page_data * (page - 1) > 0;
    const hasNext = per_page_data * (page - 1) + per_page_data < total;

    const pageHandler = (type: "prev" | "next") => {
        if (type === "prev") {
            params.set("page", `${page - 1}`);
        } else {
            params.set("page", `${page + 1}`);
        }
        replace(`${path}?${params}`);
    };

    return (
        (hasNext || hasPrev) && (
            <div className="flex justify-around items-center">
                <Button
                    variant={"outline"}
                    disabled={!hasPrev || isLoading}
                    onClick={() => pageHandler("prev")}
                >
                    <ArrowLeft />
                </Button>
                <Badge variant={"secondary"} className="text-xs">
                    {page}
                </Badge>
                <Button
                    variant={"outline"}
                    disabled={!hasNext || isLoading}
                    onClick={() => pageHandler("next")}
                >
                    <ArrowRight />
                </Button>
            </div>
        )
    );
};

export default Pagination;
