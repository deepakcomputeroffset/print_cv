"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Loader, Loader2, PlusCircle, Trash, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { productFormSchema } from "@/schemas/product-schema";
import { useProductCategory } from "@/hooks/use-product-categories";
import { product_category } from "@prisma/client";
import { productCategoryWithSubCategory } from "@/types/types";
import { toast } from "sonner";
import { Dropzone } from "@/components/ui/dropzone";
import Image from "next/image";
import { max_image_size } from "@/lib/constants";
import { useProductAttributeType } from "@/hooks/use-product-attribute";
import { useModal } from "@/hooks/use-modal";
import { AddAttributeModal } from "@/components/attribute/modal/add-attribute";

// Temporary data storage
const tempAttributes = [
    { id: 1, name: "Size" },
    { id: 2, name: "Color" },
];

const tempAttributeValues = {
    1: ["S", "M", "L", "XL"],
    2: ["Red", "Blue", "Green"],
};

interface Attribute {
    id: number;
    name: string;
}

interface AttributeValue {
    attributeId: number;
    value: string;
}

interface Variant {
    id: string;
    combinations: AttributeValue[];
    product_code: string;
    min_qty: number;
    min_price: number;
    avg_price: number;
    max_price: number;
    image_url: string[];
    available: boolean;
}

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function CreateProductPage() {
    const [loading, setLoading] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>(
        [],
    );
    const [selectedValues, setSelectedValues] = useState<
        Record<number, string[]>
    >({});
    const [newAttribute, setNewAttribute] = useState("");
    const [newValue, setNewValue] = useState("");
    const [currentAttributeId, setCurrentAttributeId] = useState<number | null>(
        null,
    );
    const [variants, setVariants] = useState<Variant[]>([]);

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            image_url: [],
        },
    });

    const generateVariants = () => {
        const generateCombinations = (
            attributes: Attribute[],
            values: Record<number, string[]>,
            current: AttributeValue[] = [],
            index = 0,
        ): AttributeValue[][] => {
            if (index === attributes.length) {
                return [current];
            }

            const attribute = attributes[index];
            const attributeValues = values[attribute.id] || [];
            const combinations: AttributeValue[][] = [];

            for (const value of attributeValues) {
                combinations.push(
                    ...generateCombinations(
                        attributes,
                        values,
                        [...current, { attributeId: attribute.id, value }],
                        index + 1,
                    ),
                );
            }

            return combinations;
        };

        const combinations = generateCombinations(
            selectedAttributes,
            selectedValues,
        );

        const newVariants = combinations.map((combination, index) => ({
            id: `variant-${index}`,
            combinations: combination,
            product_code: `PROD-${index + 1}`,
            min_qty: 1,
            min_price: 0,
            avg_price: 0,
            max_price: 0,
            image_url: [""],
            available: true,
        }));

        setVariants(newVariants);
        form.setValue("product_items", newVariants);
    };

    const addAttribute = (attribute: Attribute) => {
        setSelectedAttributes((prev) => [...prev, attribute]);
    };

    const addValueToAttribute = (attributeId: number, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [attributeId]: [...(prev[attributeId] || []), value],
        }));
    };

    const handleCreateAttribute = () => {
        if (newAttribute.trim()) {
            const newId = Math.max(...tempAttributes.map((a) => a.id), 0) + 1;
            const attribute = { id: newId, name: newAttribute.trim() };
            tempAttributes.push(attribute);
            addAttribute(attribute);
            setNewAttribute("");
        }
    };

    const handleCreateValue = () => {
        if (currentAttributeId && newValue.trim()) {
            const value = newValue.trim();
            if (!tempAttributeValues[currentAttributeId]) {
                tempAttributeValues[currentAttributeId] = [];
            }
            tempAttributeValues[currentAttributeId].push(value);
            addValueToAttribute(currentAttributeId, value);
            setNewValue("");
        }
    };

    const removeAttribute = (attributeId: number) => {
        setSelectedAttributes((prev) =>
            prev.filter((a) => a.id !== attributeId),
        );
        const newSelectedValues = { ...selectedValues };
        delete newSelectedValues[attributeId];
        setSelectedValues(newSelectedValues);
    };

    const removeValue = (attributeId: number, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [attributeId]: prev[attributeId].filter((v) => v !== value),
        }));
    };

    async function onSubmit(data: ProductFormValues) {
        setLoading(true);
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }

            form.reset();
            setSelectedAttributes([]);
            setSelectedValues({});
            setVariants([]);
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setLoading(false);
        }
    }
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
    const { onOpen } = useModal();
    const { productCategories } = useProductCategory();
    const isLoading = false;
    const {
        ProductAttributeTypes,
        createProductAttributeType: { mutateAsync },
    } = useProductAttributeType(Number(form?.getValues("product_category_id")));

    console.log(ProductAttributeTypes);
    console.log(form.watch());
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter product name"
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
                                        onValueChange={(v) => field.onChange(v)}
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

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Product Attributes
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    !form.getValues("product_category_id")
                                }
                                onClick={() =>
                                    onOpen("addAttribute", {
                                        product_category_id: Number(
                                            form?.getValues(
                                                "product_category_id",
                                            ),
                                        ),
                                    })
                                }
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Attribute
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {selectedAttributes.map((attribute) => (
                                <Card key={attribute.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">
                                                {attribute.name}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeAttribute(
                                                        attribute.id,
                                                    )
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {(
                                                    selectedValues[
                                                        attribute.id
                                                    ] || []
                                                ).map((value) => (
                                                    <Badge
                                                        key={value}
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        {value}
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() =>
                                                                removeValue(
                                                                    attribute.id,
                                                                    value,
                                                                )
                                                            }
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <PlusCircle className="h-4 w-4 mr-2" />
                                                        Add Value
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Add Value for{" "}
                                                            {attribute.name}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 pt-4">
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="New value"
                                                                value={newValue}
                                                                onChange={(e) =>
                                                                    setNewValue(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                onClick={() => {
                                                                    setCurrentAttributeId(
                                                                        attribute.id,
                                                                    );
                                                                    handleCreateValue();
                                                                }}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {(
                                                                tempAttributeValues[
                                                                    attribute.id
                                                                ] || []
                                                            ).map((value) => (
                                                                <div
                                                                    key={value}
                                                                    className="flex items-center justify-between p-2 border rounded"
                                                                >
                                                                    <span>
                                                                        {value}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            addValueToAttribute(
                                                                                attribute.id,
                                                                                value,
                                                                            )
                                                                        }
                                                                    >
                                                                        Select
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {selectedAttributes.length > 0 && (
                            <Button
                                type="button"
                                onClick={generateVariants}
                                className="w-full mt-4"
                            >
                                Generate Variants
                            </Button>
                        )}
                    </div>

                    {variants.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Product Variants
                            </h2>
                            {variants.map((variant, index) => (
                                <Card key={variant.id} className="mb-4">
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between mb-4">
                                            <h3 className="text-lg font-medium">
                                                Variant {index + 1}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {variant.combinations.map(
                                                    (combo) => (
                                                        <Badge
                                                            key={
                                                                combo.attributeId
                                                            }
                                                            variant="outline"
                                                        >
                                                            {
                                                                selectedAttributes.find(
                                                                    (a) =>
                                                                        a.id ===
                                                                        combo.attributeId,
                                                                )?.name
                                                            }
                                                            : {combo.value}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`product_items.${index}.product_code`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Product Code
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`product_items.${index}.min_qty`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Minimum Quantity
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
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
                                                name={`product_items.${index}.min_price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Minimum Price
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
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
                                                name={`product_items.${index}.avg_price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Average Price
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
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
                                                name={`product_items.${index}.max_price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Maximum Price
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Create Product"
                        )}
                    </Button>
                </form>
            </Form>

            <AddAttributeModal
                product_attribute_types={ProductAttributeTypes}
                add_product_attribute_type={mutateAsync}
                product_category_id={Number(
                    form.getValues("product_category_id"),
                )}
            />
        </div>
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
