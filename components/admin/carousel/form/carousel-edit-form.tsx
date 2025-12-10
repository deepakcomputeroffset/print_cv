"use client";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import { getCarouselEditSchema } from "@/schemas/carousel.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateCarousel } from "@/app/admin/carousel/_actions/actions";

export const CarouselEditForm = () => {
    const { onClose, data } = useModal();
    const [imageUrl, setImageUrl] = useState<string>();
    const [isPending, startTransition] = useTransition();

    const carouselSchema = getCarouselEditSchema();
    const carousel = data?.carousel;

    const form = useForm<z.infer<typeof carouselSchema>>({
        resolver: zodResolver(carouselSchema),
        defaultValues: {
            title: carousel?.title || "",
            description: carousel?.description || "",
            linkUrl: carousel?.linkUrl || "",
            isActive: carousel?.isActive ?? true,
            order: carousel?.order ?? 0,
        },
    });

    useEffect(() => {
        if (carousel?.imageUrl) {
            setImageUrl(carousel.imageUrl);
        }
    }, [carousel]);

    const handleDrop = useCallback(
        async (files: File[]) => {
            if (files[0]) {
                form.setValue("image", files[0], { shouldDirty: true });
                if (imageUrl && imageUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(imageUrl);
                }
                setImageUrl(URL.createObjectURL(files[0]));
            } else {
                toast.error("Image size must be less than 5mb");
            }
        },
        [imageUrl],
    );

    const handleDelete = useCallback(() => {
        if (imageUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(undefined);
        form.resetField("image");
    }, [imageUrl]);

    const handleSubmit = async (values: z.infer<typeof carouselSchema>) => {
        if (!carousel?.id) return;

        startTransition(async () => {
            try {
                const dirtyFields = form.formState.dirtyFields;
                const { image, ...allData } = values;

                // Only send fields that were actually changed
                // eslint-disable-next-line
                const data: any = {};
                if (dirtyFields.title) data.title = allData.title;
                if (dirtyFields.description)
                    data.description = allData.description;
                if (dirtyFields.linkUrl) data.linkUrl = allData.linkUrl;
                if (dirtyFields.isActive !== undefined)
                    data.isActive = allData.isActive;
                if (dirtyFields.order !== undefined) data.order = allData.order;

                // Only send image if it was changed (and it's a File)
                const imageToSend =
                    dirtyFields.image && image instanceof File
                        ? image
                        : undefined;

                await updateCarousel(carousel.id, data, imageToSend);
                toast.success("Carousel updated successfully");
                onClose();
                form.reset();
                if (imageUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(imageUrl);
                }
                setImageUrl(undefined);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to update carousel",
                );
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => handleSubmit(values))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Slide title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Slide description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="linkUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link URL (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Order</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Show this slide in the carousel
                                </div>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { ...field } }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Dropzone
                                    {...field}
                                    maxSize={5 * 1024 * 1024}
                                    onDrop={handleDrop}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {imageUrl && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleDelete}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    );
};
