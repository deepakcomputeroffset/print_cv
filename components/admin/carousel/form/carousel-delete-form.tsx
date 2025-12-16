"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCarousel } from "@/app/admin/carousel/_actions/actions";

export const CarouselDeleteForm = () => {
    const { onClose, data } = useModal();
    const carousel = data?.carousel;
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!carousel?.id) return;

        startTransition(async () => {
            try {
                await deleteCarousel(carousel.id);
                toast.success("Carousel deleted successfully");
                onClose();
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete carousel",
                );
            }
        });
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the carousel slide &quot;
                {carousel?.title}&quot;? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                </Button>
            </div>
        </div>
    );
};
