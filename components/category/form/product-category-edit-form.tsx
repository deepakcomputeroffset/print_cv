import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import { useProductCategory } from "@/hooks/use-product-categories";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { productCategorySchema } from "@/schemas/product-category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const ProductCategoryEditForm = () => {
    const { onClose, data } = useModal();
    const form = useForm<z.infer<typeof productCategorySchema>>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: {
            name: data?.product_category?.name,
            description: data?.product_category?.description!,
            image_url: data?.product_category?.image_url,
            parent_category_id: data?.product_category?.id || null,
        },
    });
    const { updateProductCategory } = useProductCategory();

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;
    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );
    const handleDrop = useCallback(async (files: File[]) => {
        if (files[0]) {
            const base64 = new Promise((res) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(files[0]);
                fileReader.onload = () => {
                    toast.success("Image loaded");
                    res(fileReader.result);
                    form.setValue("image_url", fileReader.result as string, {
                        shouldDirty: true,
                    });
                };
            });

            return await base64;
        }
    }, []);
    const handleDelete = useCallback(() => {
        if (!!form.getValues("image_url")) {
            form.setValue("image_url", "", { shouldDirty: false });
        }
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => {
                    onClose();
                    updateProductCategory(
                        data?.product_category?.id!,
                        dirtyFieldsWithValues,
                    );
                    form.reset();
                })}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name Here" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description Here..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <div>
                                    {!!form?.getValues("image_url") ? (
                                        <div className="relative">
                                            <Badge
                                                variant={"destructive"}
                                                className="rounded-full py-2.5 absolute cursor-pointer top-2 right-2"
                                                onClick={() => handleDelete()}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Badge>
                                            <Image
                                                src={form.getValues(
                                                    "image_url",
                                                )}
                                                alt="Category Image"
                                                width={1000}
                                                height={1000}
                                                className="object-contain select-none rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <Dropzone
                                            onDrop={(files) =>
                                                handleDrop(files)
                                            }
                                            className="mt-4"
                                            maxFiles={1}
                                            maxSize={5242880}
                                        />
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={`w-full`}>
                    Update
                </Button>
            </form>
        </Form>
    );
};
