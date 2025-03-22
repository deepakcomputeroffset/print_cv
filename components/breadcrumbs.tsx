"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export const CategoryBreadcrumb = ({
    breadcrumbs,
    handleBreadcrumbClick,
}: {
    breadcrumbs: { id: number; name: string }[];
    handleBreadcrumbClick: (index: number) => void;
}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        onClick={() => handleBreadcrumbClick(-1)}
                        className="cursor-pointer"
                    >
                        All Category
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs?.map((crumb) => (
                    <React.Fragment key={crumb.id}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
