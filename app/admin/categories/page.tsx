"use client";

import { useState } from "react";
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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";

interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

export default function CategoriesPage() {
    // const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    // const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories");
        } finally {
            // setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete category");

            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Error deleting category");
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button>Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedCategory
                                    ? "Edit Category"
                                    : "Add Category"}
                            </DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            category={selectedCategory}
                            onSuccess={() => {
                                setOpenDialog(false);
                                setSelectedCategory(null);
                                fetchCategories();
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
                            <TableHead>Description</TableHead>
                            <TableHead>Image URL</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {category.imageUrl}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
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
