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
import {
    productFormSchema,
    productPriceSchema,
} from "@/schemas/product.form.schema";
import { ProductVariantType, ServerResponseType } from "@/types/types";
import { toast } from "sonner";
import { maxImageSize } from "@/lib/constants";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { useProducts } from "@/hooks/use-product";
import { productAttributeType, productAttributeValue } from "@prisma/client";
import { getAllProductCategory } from "@/lib/getCategories";
import axios from "axios";
import ProductQtyPrice from "../modal/product-qtyPrice-modal";
import { useUploadGroup } from "@/hooks/use-upload-group";

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
            isAvailable: false,
            sku: "",
            isTieredPricing: false,
        },
    });

    const { productCategories, isLoading } = useProductCategory({
        perpage: 100,
    });

    const { createProduct } = useProducts();

    const handleImageDrop = useCallback(
        async (files: File[]) => {
            try {
                setUploading(true);
                if (!files.length) {
                    toast.error("No files selected.");
                    return;
                }

                const validFiles = files?.filter(
                    (file) => file.size <= maxImageSize,
                );

                if (validFiles?.length !== files?.length) {
                    toast.error("Some files exceed the 5MB size limit.");
                }

                const formData = new FormData();
                validFiles.forEach((file) => formData.append("files", file));
                formData.append("folder", "images");

                const { data } = await axios.post<ServerResponseType<string[]>>(
                    "/api/upload",
                    formData,
                );

                if (data?.data) {
                    form.setValue(
                        "imageUrl",
                        [...form.getValues("imageUrl"), ...data?.data],
                        {
                            shouldDirty: true,
                        },
                    );
                }
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
    const [pricing, setPricing] = useState<
        z.infer<typeof productPriceSchema>[]
    >([]);
    const addQtyPriceHandler = ({
        qty,
        price,
    }: {
        qty: number;
        price: number;
    }) => {
        if (!form.getValues("isTieredPricing") && pricing.length >= 1)
            return toast.error("Cant't add more qty and price");
        if (!qty || !price) return toast.error("Invalid qty and price.");
        if (!!pricing.find((pr) => pr.qty === qty))
            return toast.error("Already qty exists");
        setPricing([...pricing, { qty, price }].sort((a, b) => a.qty - b.qty));
        toast.error("added successfully.");
    };
    const removeQtyPriceHandler = (qty: number) => {
        setPricing(pricing.filter((v) => v.qty !== qty));
    };

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
            if (index === selectedAttributes?.length) {
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
            pricing: pricing,
            uploadGroupId: -1,
            isAvailable: form?.getValues("isAvailable"),
        }));

        setVariants(newVariants);
        form.setValue("productItems", newVariants, { shouldDirty: true });
    }, [selectedAttributes, selectedOptions, pricing]);

    useEffect(() => {
        if (selectedAttributes?.length > 0 && selectedOptions?.length > 0)
            generateVariants();
        else setVariants([]);
    }, [selectedAttributes, selectedOptions]);

    const { data: uploadGroups } = useUploadGroup();

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
                                        placeholder="product name"
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
                                    placeholder="Product description"
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
                        name="isTieredPricing"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiered Price</FormLabel>
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
                                        <SelectValue placeholder="has product tiered pricing ?" />
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
                                    <Input placeholder="sku" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <ProductQtyPrice
                    pricing={pricing}
                    addQtyPriceHandler={addQtyPriceHandler}
                    removeQtyPriceHandler={removeQtyPriceHandler}
                />

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
                        pricing={pricing}
                        uploadGroups={uploadGroups}
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
