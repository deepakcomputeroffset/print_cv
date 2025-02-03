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
import { productCategorySchema } from "@/schemas/product-category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const ProductCategoryCreateForm = () => {
    const { onClose, data } = useModal();
    const form = useForm<z.infer<typeof productCategorySchema>>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            image_url: undefined,
            parent_category_id: data?.product_category?.id || null,
        },
    });
    const {
        createProductCategory: { isPending, mutateAsync },
    } = useProductCategory();

    const handleDrop = useCallback(async (files: File[]) => {
        if (files[0]) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onload = () => {
                form.setValue("image_url", fileReader.result as string);
            };
        } else {
            toast.error("Image size must be less 5mb");
        }
    }, []);
    const handleDelete = useCallback(() => {
        if (!!form.getValues("image_url")) {
            form.setValue("image_url", "");
        }
    }, []);

    const handleSubmit = async (
        values: z.infer<typeof productCategorySchema>,
    ) => {
        await mutateAsync(values);
        onClose();
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => handleSubmit(values))}
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
                    name="image_url"
                    render={() => (
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

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "create"
                    )}
                </Button>
            </form>
        </Form>
    );
};
