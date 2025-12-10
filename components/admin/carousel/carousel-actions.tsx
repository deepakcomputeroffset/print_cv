"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { carousel } from "@prisma/client";

export function CarouselActions({ carousel }: { carousel?: carousel }) {
    const { onOpen } = useModal();

    if (carousel) {
        return (
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpen("editCarousel", { carousel })}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpen("deleteCarousel", { carousel })}
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
            onClick={() => onOpen("createCarousel", {})}
        >
            <Plus className="h-4 w-4" />
        </Button>
    );
}
