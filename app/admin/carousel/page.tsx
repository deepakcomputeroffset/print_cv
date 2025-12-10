import React from "react";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { carousel } from "@prisma/client";
import { MessageRow } from "@/components/message-row";
import { CarouselCreateModal } from "@/components/admin/carousel/modal/carousel-create-modal";
import { CarouselEditModal } from "@/components/admin/carousel/modal/carousel-edit-modal";
import { CarouselDeleteModal } from "@/components/admin/carousel/modal/carousel-delete-modal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { getCarousels } from "./_actions/actions";
import { CarouselActions } from "@/components/admin/carousel/carousel-actions";

export default async function CarouselPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const { data: carousels } = await getCarousels(resolvedSearchParams);

    return (
        <>
            <CarouselCreateModal />
            <CarouselEditModal />
            <CarouselDeleteModal />

            <div className="space-y-6 h-full min-h-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="w-8 h-8" />
                        <h1 className="text-2xl font-semibold">
                            Carousel Management
                        </h1>
                    </div>
                    <CarouselActions />
                </div>

                <Card className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Link URL</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carousels.length === 0 ? (
                                <MessageRow text="No carousel slides found" />
                            ) : (
                                carousels.map((carousel: carousel) => (
                                    <TableRow key={carousel.id}>
                                        <TableCell>{carousel.id}</TableCell>
                                        <TableCell>
                                            <div className="relative w-20 h-12 rounded overflow-hidden">
                                                <Image
                                                    src={carousel.imageUrl}
                                                    alt={carousel.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {carousel.title}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {carousel.description || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {carousel.linkUrl ? (
                                                <a
                                                    href={carousel.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {carousel.linkUrl}
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell>{carousel.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    carousel.isActive
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {carousel.isActive ? (
                                                    <>
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3 w-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <CarouselActions
                                                carousel={carousel}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
