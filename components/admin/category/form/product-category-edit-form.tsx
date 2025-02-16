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
import { useProductCategory } from "@/hooks/useProductCategory";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { productCategorySchema } from "@/schemas/product.category.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
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
            name: data?.productCategory?.name,
            description: data?.productCategory?.description || "",
            imageUrl: data?.productCategory?.imageUrl,
            parentCategoryId: data?.productCategory?.id || null,
        },
    });
    const {
        updateProductCategory: { mutateAsync, isPending },
    } = useProductCategory();

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
                    form.setValue("imageUrl", fileReader.result as string, {
                        shouldDirty: true,
                    });
                };
            });

            return await base64;
        }
    }, []);

    const handleDelete = useCallback(() => {
        if (!!form.getValues("imageUrl")) {
            form.setValue("imageUrl", "", { shouldDirty: false });
        }
    }, []);

    const handleSubmit = async () => {
        if (data?.productCategory?.id) {
            await mutateAsync({
                id: data?.productCategory?.id,
                data: dirtyFieldsWithValues,
            });
            onClose();
            form.reset();
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => handleSubmit())}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} />
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
                                <Textarea placeholder="Abc" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={() => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <div>
                                    {!!form?.getValues("imageUrl") ? (
                                        <div className="relative">
                                            <Badge
                                                variant={"destructive"}
                                                className="rounded-full py-2.5 absolute cursor-pointer top-2 right-2"
                                                onClick={() => handleDelete()}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Badge>
                                            <Image
                                                src={form.getValues("imageUrl")}
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

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "update"
                    )}
                </Button>
            </form>
        </Form>
    );
};
