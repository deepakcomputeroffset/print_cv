"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { JSX, useCallback, useState } from "react";
import { ProductAttributes } from "../../attribute/product-attribute";
import { ProductVariants } from "../product-variants";
import { useProductCategory } from "@/hooks/use-product-categories";
import { productFormSchema } from "@/schemas/product-schema";
import {
    productCategoryWithSubCategory,
    ProductVariantType,
} from "@/types/types";
import { toast } from "sonner";
import { max_image_size } from "@/lib/constants";
import Image from "next/image";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/ui/dropzone";
import { useProducts } from "@/hooks/use-product";

export function ProductForm() {
    const [selectProductCategory, setProductCategory] = useState<number>(0);

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            description: "",
            image_url: [],
            product_items: [],
        },
    });

    const { productCategories, isLoading } = useProductCategory();

    const {
        createProduct: {
            mutateAsync: createProduct,
            isPending: isProductCreating,
        },
    } = useProducts();

    const handleDrop = useCallback(
        async (files: File[]) => {
            if (!files.length) {
                toast.error("No files selected.");
                return;
            }

            const validFiles = files.filter(
                (file) => file.size <= max_image_size,
            );

            if (validFiles.length !== files.length) {
                toast.error("Some files exceed the 5MB size limit.");
            }

            const fileReaders = validFiles.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = () =>
                        resolve(fileReader.result as string);
                    fileReader.onerror = () => reject("Error reading file.");
                });
            });

            try {
                const images = await Promise.all(fileReaders);
                form.setValue("image_url", [
                    ...form.getValues("image_url"),
                    ...images,
                ]);
            } catch (error) {
                console.log(error);
                toast.error("Error processing files.");
            }
        },
        [form],
    );

    const handleDelete = useCallback((idx: number) => {
        if (!idx) return;
        if (!!form.getValues("image_url")) {
            form.setValue(
                "image_url",
                form.getValues("image_url").filter((v, i) => i != idx),
            );
        }
    }, []);

    async function onSubmit(data: z.infer<typeof productFormSchema>) {
        try {
            await createProduct(data);
            form.reset();
            setVariants([]);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    const [variants, setVariants] = useState<ProductVariantType[]>([]);

    const handleVariantsGenerated = (newVariants: ProductVariantType[]) => {
        setVariants(newVariants);
        form.setValue("product_items", newVariants);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="product_category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    {...field}
                                    onValueChange={(v) => {
                                        field.onChange(v);
                                        setProductCategory(Number(v));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {getAllProductCategory(
                                            productCategories,
                                            0,
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter product description"
                                    {...field}
                                    rows={4}
                                />
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
                                    <Dropzone
                                        onDrop={handleDrop}
                                        className="mb-4"
                                        maxFiles={5}
                                        maxSize={5242880}
                                    />
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {!!form?.getValues("image_url")
                                            .length &&
                                            form
                                                ?.getValues("image_url")
                                                .map((url, idx) => (
                                                    <div
                                                        className="relative"
                                                        key={idx}
                                                    >
                                                        <Badge
                                                            variant={
                                                                "destructive"
                                                            }
                                                            className="rounded-full py-2.5 absolute cursor-pointer top-2 right-2"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    idx,
                                                                )
                                                            }
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Badge>
                                                        <Image
                                                            src={url}
                                                            alt="Category Image"
                                                            width={1000}
                                                            height={1000}
                                                            className="object-contain select-none rounded-md"
                                                        />
                                                    </div>
                                                ))}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_avialable"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Available</FormLabel>
                            <Select
                                {...field}
                                onValueChange={(v) =>
                                    field.onChange(v === "true" ? true : false)
                                }
                                value={field.value === true ? "true" : "false"}
                                defaultValue="false"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Is product avialable to sell?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"false"}>No</SelectItem>
                                    <SelectItem value={"true"}>Yes</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ProductAttributes
                    isLoading={isLoading}
                    product_category_id={selectProductCategory}
                    onVariantsGenerated={handleVariantsGenerated}
                />

                {variants.length > 0 && (
                    <ProductVariants variants={variants} form={form} />
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isProductCreating}
                >
                    {isProductCreating ? "Creating..." : "Create Product"}
                </Button>
            </form>
        </Form>
    );
}

const getAllProductCategory = (
    productCategory: productCategoryWithSubCategory[] = [],
    level = 0,
): JSX.Element[] => {
    if (!productCategory?.length) return [];
    return productCategory.flatMap((category) => [
        <SelectItem key={category.id} value={category.id.toString()}>
            {"\u00A0".repeat(level * 2)}
            {category.name}
        </SelectItem>,
        ...getAllProductCategory(
            (category.sub_categories as productCategoryWithSubCategory[]) ?? [],
            level + 1,
        ),
    ]);
};
