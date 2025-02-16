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
import { useCallback, useEffect, useState } from "react";
import { ProductAttributes } from "../../attribute/product-attribute";
import { ProductVariants } from "../product-variants";
import { useProductCategory } from "@/hooks/useProductCategory";
import { productFormSchema } from "@/schemas/product.form.schema";
import { ProductVariantType } from "@/types/types";
import { toast } from "sonner";
import { maxImageSize } from "@/lib/constants";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { useProducts } from "@/hooks/use-product";
import { productAttributeType, productAttributeValue } from "@prisma/client";
import { getAllProductCategory } from "@/lib/get.categories";
import axios from "axios";
import { UploadApiResponse } from "cloudinary";

export function ProductForm() {
    const [uploading, setUploading] = useState(false);
    const [variants, setVariants] = useState<ProductVariantType[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<
        productAttributeType[]
    >([]);
    const [selectedOptions, setSelectedOptions] = useState<
        productAttributeValue[]
    >([]);

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            description: "",
            imageUrl: [],
            categoryId: "0",
            productItems: [],
            avgPrice: 0,
            isAvailable: false,
            maxPrice: 0,
            minPrice: 0,
            minQty: 0,
            ogPrice: 0,
            sku: "",
        },
    });

    const { productCategories, isLoading } = useProductCategory();

    const { createProduct } = useProducts();

    const handleImageDrop = useCallback(
        async (files: File[]) => {
            try {
                setUploading(true);
                if (!files.length) {
                    toast.error("No files selected.");
                    return;
                }

                const validFiles = files.filter(
                    (file) => file.size <= maxImageSize,
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
                        fileReader.onerror = () =>
                            reject("Error reading file.");
                    });
                });
                const images = await Promise.all(fileReaders);
                const { data } = await axios.post<UploadApiResponse[]>(
                    "/api/upload",
                    {
                        files: images,
                    },
                );

                form.setValue(
                    "imageUrl",
                    [
                        ...form.getValues("imageUrl"),
                        ...data?.map((url) => url?.secure_url),
                    ],
                    {
                        shouldDirty: true,
                    },
                );
            } catch (error) {
                console.log(error);
                toast.error("Error processing files.");
            } finally {
                setUploading(false);
            }
        },
        [form],
    );

    const handleImageRemove = useCallback((idx: number) => {
        if (idx == undefined || idx == null) return;
        if (!!form.getValues("imageUrl")) {
            axios.delete(`/api/upload?url=${form.getValues("imageUrl")[idx]}`);
            form.setValue(
                "imageUrl",
                form.getValues("imageUrl").filter((v, i) => i != idx),
                { shouldDirty: true },
            );
        }
    }, []);

    async function onSubmit(data: z.infer<typeof productFormSchema>) {
        try {
            await createProduct.mutateAsync(data);
            form.reset();
            setVariants([]);
            setSelectedAttributes([]);
            setSelectedOptions([]);
        } catch (error) {
            toast.error("Error While creating product.");
            console.log("Error creating product:", error);
        }
    }

    const getAttributeNameById = useCallback(
        (id: number): string => {
            let name = "";
            selectedAttributes?.forEach((attr) => {
                if (attr?.id === id) {
                    name = attr.name;
                    return;
                }
            });
            return name;
        },
        [selectedAttributes],
    );

    const generateVariants = useCallback(() => {
        const generateCombinations = (
            selectedAttributes: productAttributeType[],
            selectedOptions: productAttributeValue[],
            current: productAttributeValue[] = [],
            index = 0,
        ): productAttributeValue[][] => {
            if (index === selectedAttributes.length) {
                return [current];
            }

            const attribute = selectedAttributes[index];
            const attributeValues =
                selectedOptions?.filter(
                    (v) => v.productAttributeTypeId === attribute?.id,
                ) || [];

            const combinations: productAttributeValue[][] = [];

            for (const value of attributeValues) {
                combinations.push(
                    ...generateCombinations(
                        selectedAttributes,
                        selectedOptions,
                        [...current, value],
                        index + 1,
                    ),
                );
            }

            return combinations;
        };

        const combinations = generateCombinations(
            selectedAttributes,
            selectedOptions,
        );

        const newVariants = combinations.map((combination, index) => ({
            productAttributeOptions: combination,
            sku: `${form.getValues("sku")}-${index + 1}`,
            minQty: form?.getValues("minQty"),
            ogPrice: form?.getValues("ogPrice"),
            minPrice: form?.getValues("minPrice"),
            avgPrice: form?.getValues("avgPrice"),
            maxPrice: form?.getValues("maxPrice"),
            imageUrl: [],
            isAvailable: false,
        }));

        setVariants(newVariants);
        form.setValue("productItems", newVariants);
    }, [selectedAttributes, selectedOptions]);

    useEffect(() => {
        if (selectedAttributes?.length > 0 && selectedOptions?.length > 0)
            generateVariants();
        else setVariants([]);
    }, [selectedAttributes, selectedOptions]);

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
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    {...field}
                                    onValueChange={(v) => {
                                        field.onChange(v);
                                        setSelectedAttributes([]);
                                        setSelectedOptions([]);
                                        setVariants([]);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0" disabled>
                                            Select Category
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
                    name="imageUrl"
                    render={() => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <div>
                                    {uploading && (
                                        <div className="text-center flex items-center justify-center w-full">
                                            <span>Uploading...</span>
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                                        {!!form?.getValues("imageUrl").length &&
                                            form
                                                ?.getValues("imageUrl")
                                                .map((url, idx) => (
                                                    <div
                                                        className="relative group"
                                                        key={idx}
                                                    >
                                                        <div className="relative h-24 lg:h-32 w-full">
                                                            <Image
                                                                src={url}
                                                                alt="Product image"
                                                                fill
                                                                className="object-cover rounded"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                type="button"
                                                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() =>
                                                                    handleImageRemove(
                                                                        idx,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                    </div>
                                    <Dropzone
                                        onDrop={handleImageDrop}
                                        className="mt-4"
                                        maxFiles={5}
                                        maxSize={5242880}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available</FormLabel>
                                <Select
                                    {...field}
                                    onValueChange={(v) =>
                                        field.onChange(
                                            v === "true" ? true : false,
                                        )
                                    }
                                    value={
                                        field.value === true ? "true" : "false"
                                    }
                                    defaultValue="false"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Is product avialable to sell?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"false"}>
                                            No
                                        </SelectItem>
                                        <SelectItem value={"true"}>
                                            Yes
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Code</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter Product Code"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minQty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Minimum Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter Minimum Quantity"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Minimum Price</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter Minimum Price"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="avgPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Average Price</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter Average Price"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maxPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Price</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter Maximum Price"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ogPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Original Price</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter Original Price"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <ProductAttributes
                    isLoading={isLoading}
                    productCategoryId={Number(form?.watch().categoryId)}
                    selectedAttributes={selectedAttributes}
                    setSelectedAttributes={setSelectedAttributes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />

                {variants?.length > 0 && (
                    <ProductVariants
                        variants={variants}
                        form={form}
                        getAttributeNameById={getAttributeNameById}
                    />
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || createProduct?.isPending}
                >
                    {createProduct?.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Create Product"
                    )}
                </Button>
            </form>
        </Form>
    );
}
