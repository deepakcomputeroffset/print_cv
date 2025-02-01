"use client";

import { useState, useCallback, JSX } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/ui/dropzone";
import { SortableImage } from "@/components/ui/sortable-image";
import { Plus, Pencil, Trash2, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

interface Category {
    id: number;
    name: string;
    parent_category_id: number | null;
    sub_categories: Category[];
}

interface Product {
    id: number;
    name: string;
    description: string;
    image_url: string[];
    category_id: number;
    available: boolean;
    product_items: ProductItem[];
    category: {
        name: string;
        parent_category?: {
            name: string;
        };
    };
}

interface ProductItem {
    id: number;
    product_code: string;
    min_qty: number;
    min_price: number;
    avg_price: number;
    max_price: number;
}

export default function ProductsPage() {
    const [categories] = useState<Category[]>([
        {
            id: 1,
            name: "Business Cards",
            parent_category_id: null,
            sub_categories: [
                {
                    id: 4,
                    name: "Standard Cards",
                    parent_category_id: 1,
                    sub_categories: [],
                },
                {
                    id: 5,
                    name: "Premium Cards",
                    parent_category_id: 1,
                    sub_categories: [],
                },
            ],
        },
        {
            id: 2,
            name: "Marketing Materials",
            parent_category_id: null,
            sub_categories: [
                {
                    id: 6,
                    name: "Brochures",
                    parent_category_id: 2,
                    sub_categories: [],
                },
                {
                    id: 7,
                    name: "Flyers",
                    parent_category_id: 2,
                    sub_categories: [],
                },
            ],
        },
    ]);

    const [products] = useState<Product[]>([
        {
            id: 1,
            name: "Classic Business Card",
            description: "Standard matte finish business cards",
            image_url: [
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
            ],
            category_id: 4,
            available: true,
            category: {
                name: "Standard Cards",
                parent_category: {
                    name: "Business Cards",
                },
            },
            product_items: [
                {
                    id: 1,
                    product_code: "BC-STD-001",
                    min_qty: 100,
                    min_price: 2000,
                    avg_price: 2500,
                    max_price: 3000,
                },
            ],
        },
        {
            id: 2,
            name: "Premium Business Card",
            description: "Luxury metallic finish business cards",
            image_url: [
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
            ],
            category_id: 5,
            available: true,
            category: {
                name: "Premium Cards",
                parent_category: {
                    name: "Business Cards",
                },
            },
            product_items: [
                {
                    id: 2,
                    product_code: "BC-PRE-001",
                    min_qty: 50,
                    min_price: 3000,
                    avg_price: 3500,
                    max_price: 4000,
                },
            ],
        },
        {
            id: 3,
            name: "Tri-fold Brochure",
            description: "Professional tri-fold brochures",
            image_url: [
                "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
            ],
            category_id: 6,
            available: true,
            category: {
                name: "Brochures",
                parent_category: {
                    name: "Marketing Materials",
                },
            },
            product_items: [
                {
                    id: 3,
                    product_code: "BR-TRI-001",
                    min_qty: 250,
                    min_price: 5000,
                    avg_price: 6000,
                    max_price: 7000,
                },
            ],
        },
    ]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        availability: "all",
        priceRange: { min: "", max: "" },
        minQuantity: "",
        sortBy: "name",
        sortOrder: "asc" as "asc" | "desc",
    });

    const handleDrop = useCallback(
        async (productId: number, files: File[]) => {
            setIsUploading(true);
            try {
                const optimizedFiles = await Promise.all(
                    files.map(async (file) => {
                        // const optimized = await optimizeImage(file);
                        // const originalSize = formatFileSize(file.size);
                        // const optimizedSize = formatFileSize(optimized.size);
                        // return { file: optimized, originalSize, optimizedSize };
                    }),
                );

                console.log("Optimized files:", optimizedFiles);

                // toast({
                //     title: "Images processed successfully",
                //     description: `${files.length} images optimized and ready to upload`,
                // });
                toast("Image ");
            } catch (error) {
                // toast({
                //     title: "Error processing images",
                //     description:
                //         "There was an error optimizing the images. Please try again.",
                //     variant: "destructive",
                // });
                toast("image failed");
            } finally {
                setIsUploading(false);
            }
        },
        [toast],
    );

    const handleDragEnd = (event: DragEndEvent, productId: number) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const product = products.find((p) => p.id === productId);
            if (!product) return;

            const oldIndex = product.image_url.findIndex(
                (url) => url === active.id,
            );
            const newIndex = product.image_url.findIndex(
                (url) => url === over.id,
            );

            const newImages = arrayMove(product.image_url, oldIndex, newIndex);
            console.log("New image order:", newImages);
        }
    };

    const handleImageDelete = (productId: number, imageUrl: string) => {
        console.log(`Deleting image ${imageUrl} from product ${productId}`);
    };

    // const handleImageAdd = (productId: number, newImageUrl: string) => {
    //     console.log(`Adding image ${newImageUrl} to product ${productId}`);
    // };

    const sortProducts = (products: Product[]) => {
        return [...products].sort((a, b) => {
            const { sortBy, sortOrder } = filters;
            let comparison = 0;

            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "price":
                    comparison =
                        (a.product_items[0]?.min_price || 0) -
                        (b.product_items[0]?.min_price || 0);
                    break;
                case "category":
                    comparison = a.category.name.localeCompare(b.category.name);
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
            product.product_items[0]?.product_code
                .toLowerCase()
                .includes(filters.search.toLowerCase());

        const matchesCategory =
            filters.category === "all" ||
            product.category_id.toString() === filters.category;

        const matchesAvailability =
            filters.availability === "all" ||
            (filters.availability === "available" && product.available) ||
            (filters.availability === "unavailable" && !product.available);

        const matchesPriceRange =
            (!filters.priceRange.min ||
                product.product_items[0]?.min_price >=
                    parseInt(filters.priceRange.min)) &&
            (!filters.priceRange.max ||
                product.product_items[0]?.max_price <=
                    parseInt(filters.priceRange.max));

        const matchesQuantity =
            !filters.minQuantity ||
            product.product_items[0]?.min_qty >= parseInt(filters.minQuantity);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesAvailability &&
            matchesPriceRange &&
            matchesQuantity
        );
    });

    const sortedProducts = sortProducts(filteredProducts);

    const getAllCategories = (
        categories: Category[],
        level = 0,
    ): JSX.Element[] => {
        return categories.flatMap((category) => [
            <SelectItem key={category.id} value={category.id.toString()}>
                {"\u00A0".repeat(level * 2)}
                {category.name}
            </SelectItem>,
            ...getAllCategories(category.sub_categories, level + 1),
        ]);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products Management</h1>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card className="p-4 mb-6">
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        search: e.target.value,
                                    }))
                                }
                                className="flex-1"
                            />
                        </div>

                        <Select
                            value={filters.category}
                            onValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    category: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {getAllCategories(categories)}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.availability}
                            onValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    availability: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by availability" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="available">
                                    Available
                                </SelectItem>
                                <SelectItem value="unavailable">
                                    Unavailable
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                setShowAdvancedFilters(!showAdvancedFilters)
                            }
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Advanced Filters
                        </Button>
                    </div>

                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Min price"
                                    value={filters.priceRange.min}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            priceRange: {
                                                ...prev.priceRange,
                                                min: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full"
                                />
                                <span>-</span>
                                <Input
                                    type="number"
                                    placeholder="Max price"
                                    value={filters.priceRange.max}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            priceRange: {
                                                ...prev.priceRange,
                                                max: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <Input
                                type="number"
                                placeholder="Minimum quantity"
                                value={filters.minQuantity}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        minQuantity: e.target.value,
                                    }))
                                }
                            />

                            <div className="flex space-x-2">
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sortBy: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">
                                            Name
                                        </SelectItem>
                                        <SelectItem value="price">
                                            Price
                                        </SelectItem>
                                        <SelectItem value="category">
                                            Category
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sortOrder:
                                                prev.sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc",
                                        }))
                                    }
                                >
                                    {filters.sortOrder === "asc" ? "↑" : "↓"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Price Range</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-10 w-10">
                                        <Image
                                            src={product.image_url[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {product.name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>
                                            {
                                                product.category.parent_category
                                                    ?.name
                                            }
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {product.category.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {product.product_items[0]?.product_code}
                                </TableCell>
                                <TableCell>
                                    ₹{product.product_items[0]?.min_price} - ₹
                                    {product.product_items[0]?.max_price}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product.available
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {product.available
                                            ? "Available"
                                            : "Unavailable"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Edit Product
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="category">
                                                            Category
                                                        </Label>
                                                        <Select
                                                            defaultValue={product.category_id.toString()}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getAllCategories(
                                                                    categories,
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="name">
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            defaultValue={
                                                                product.name
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="description">
                                                            Description
                                                        </Label>
                                                        <Textarea
                                                            id="description"
                                                            defaultValue={
                                                                product.description
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>
                                                            Product Images
                                                        </Label>
                                                        <DndContext
                                                            collisionDetection={
                                                                closestCenter
                                                            }
                                                            onDragEnd={(
                                                                event,
                                                            ) =>
                                                                handleDragEnd(
                                                                    event,
                                                                    selectedProduct?.id ||
                                                                        0,
                                                                )
                                                            }
                                                        >
                                                            <SortableContext
                                                                items={
                                                                    selectedProduct?.image_url ||
                                                                    []
                                                                }
                                                                strategy={
                                                                    rectSortingStrategy
                                                                }
                                                            >
                                                                <div className="grid grid-cols-4 gap-4">
                                                                    {selectedProduct?.image_url.map(
                                                                        (
                                                                            url,
                                                                        ) => (
                                                                            <SortableImage
                                                                                key={
                                                                                    url
                                                                                }
                                                                                id={
                                                                                    url
                                                                                }
                                                                                url={
                                                                                    url
                                                                                }
                                                                                onDelete={() =>
                                                                                    handleImageDelete(
                                                                                        selectedProduct.id,
                                                                                        url,
                                                                                    )
                                                                                }
                                                                            />
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </SortableContext>
                                                        </DndContext>

                                                        <Dropzone
                                                            onDrop={(files) =>
                                                                handleDrop(
                                                                    selectedProduct?.id ||
                                                                        0,
                                                                    files,
                                                                )
                                                            }
                                                            className="mt-4"
                                                            maxFiles={5}
                                                            maxSize={5242880}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="productCode">
                                                                Product Code
                                                            </Label>
                                                            <Input
                                                                id="productCode"
                                                                defaultValue={
                                                                    product
                                                                        .product_items[0]
                                                                        ?.product_code
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="minQty">
                                                                Minimum Quantity
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                id="minQty"
                                                                defaultValue={
                                                                    product
                                                                        .product_items[0]
                                                                        ?.min_qty
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="minPrice">
                                                                Minimum Price
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                id="minPrice"
                                                                defaultValue={
                                                                    product
                                                                        .product_items[0]
                                                                        ?.min_price
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="avgPrice">
                                                                Average Price
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                id="avgPrice"
                                                                defaultValue={
                                                                    product
                                                                        .product_items[0]
                                                                        ?.avg_price
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="maxPrice">
                                                                Maximum Price
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                id="maxPrice"
                                                                defaultValue={
                                                                    product
                                                                        .product_items[0]
                                                                        ?.max_price
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit">
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog
                                            open={deleteDialogOpen}
                                            onOpenChange={setDeleteDialogOpen}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently
                                                        delete the product and
                                                        all its variants. This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

/**
 * PS C:\Users\Aditya Kumar\Codes\press> npx shadcn@latest add accordion
✔ Checking registry.
✔ Updating tailwind.config.ts
  Installing dependencies.

It looks like you are using React 19.
Some packages may fail to install due to peer dependency issues in npm (see https://ui.shadcn.com/react-19).

√ How would you like to proceed? » Use --force                                                           
✔ Installing dependencies.
✔ Created 1 file:
  - components\ui\accordion.tsx

PS C:\Users\Aditya Kumar\Codes\press> npx shadcn@latest add alert-dialog
>>
✔ Checking registry.
  Installing dependencies.

It looks like you are using React 19.
Some packages may fail to install due to peer dependency issues in npm (see https://ui.shadcn.com/react-19).

√ How would you like to proceed? » Use --force
✔ Installing dependencies.
√ The file button.tsx already exists. Would you like to overwrite? ... no
✔ Created 1 file:
  - components\ui\alert-dialog.tsx
ℹ Skipped 1 files:
  - components\ui\button.tsx

PS C:\Users\Aditya Kumar\Codes\press> npm i @dnd-kit/core

added 3 packages, and audited 511 packages in 9s

160 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\Aditya Kumar\Codes\press> @dnd-kit/sortable
At line:1 char:5
+ @dnd-kit/sortable
+     ~~~~
Unexpected token '-kit' in expression or statement.
At line:1 char:9
+ @dnd-kit/sortable
+         ~~~~~~~~~
Unexpected token '/sortable' in expression or statement.
At line:1 char:1
+ @dnd-kit/sortable
+ ~~~~
The splatting operator '@' cannot be used to reference variables in an expression. '@dnd' can be used    
only as an argument to a command. To reference variables in an expression use '$dnd'.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : UnexpectedToken

PS C:\Users\Aditya Kumar\Codes\press> npm i @dnd-kit/sortable

added 1 package, and audited 512 packages in 5s

160 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\Aditya Kumar\Codes\press> npm i react-dropzone

added 3 packages, and audited 515 packages in 4s

160 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\Aditya Kumar\Codes\press>
 */
