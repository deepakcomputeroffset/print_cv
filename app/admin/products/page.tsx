"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    category: Category;
}

export default function ProductsPage() {
    // const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    // const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products");
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");

            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Error deleting product");
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products</h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button>Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedProduct
                                    ? "Edit Product"
                                    : "Add Product"}
                            </DialogTitle>
                        </DialogHeader>
                        <ProductForm
                            product={selectedProduct}
                            onSuccess={() => {
                                setOpenDialog(false);
                                setSelectedProduct(null);
                                fetchProducts();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>
                                    ${product.price.toFixed(2)}
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                    {product.description}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
