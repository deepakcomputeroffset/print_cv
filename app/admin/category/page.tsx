// "use client";

// import { useState } from "react";
// // import { useRouter } from "next/navigation";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { Pencil, Trash } from "lucide-react";
// import { CategoryForm } from "@/components/admin/forms/category-form";

// interface Category {
//     id: string;
//     name: string;
//     description: string;
//     imageUrl: string;
// }

// export default function CategoriesPage() {
//     // const router = useRouter();
//     const [categories, setCategories] = useState<Category[]>([]);
//     // const [loading, setLoading] = useState(true);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//         null,
//     );

//     const fetchCategories = async () => {
//         try {
//             const response = await fetch("/api/categories");
//             const data = await response.json();
//             setCategories(data);
//         } catch (error) {
//             console.error(error);
//             toast.error("Failed to fetch categories");
//         } finally {
//             // setLoading(false);
//         }
//     };

//     const handleDelete = async (id: string) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;

//         try {
//             const response = await fetch(`/api/categories/${id}`, {
//                 method: "DELETE",
//             });

//             if (!response.ok) throw new Error("Failed to delete category");

//             toast.success("Category deleted successfully");
//             fetchCategories();
//         } catch (error) {
//             console.error(error);
//             toast.error("Error deleting category");
//         }
//     };

//     const handleEdit = (category: Category) => {
//         setSelectedCategory(category);
//         setOpenDialog(true);
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold">Categories</h1>
//                 <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//                     <DialogTrigger asChild>
//                         <Button>Add Category</Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>
//                                 {selectedCategory
//                                     ? "Edit Category"
//                                     : "Add Category"}
//                             </DialogTitle>
//                         </DialogHeader>
//                         <CategoryForm
//                             category={selectedCategory}
//                             onSuccess={() => {
//                                 setOpenDialog(false);
//                                 setSelectedCategory(null);
//                                 fetchCategories();
//                             }}
//                         />
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Description</TableHead>
//                             <TableHead>Image URL</TableHead>
//                             <TableHead className="text-right">
//                                 Actions
//                             </TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {categories.map((category) => (
//                             <TableRow key={category.id}>
//                                 <TableCell>{category.name}</TableCell>
//                                 <TableCell>{category.description}</TableCell>
//                                 <TableCell className="max-w-[200px] truncate">
//                                     {category.imageUrl}
//                                 </TableCell>
//                                 <TableCell className="text-right space-x-2">
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => handleEdit(category)}
//                                     >
//                                         <Pencil className="h-4 w-4" />
//                                     </Button>
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() =>
//                                             handleDelete(category.id)
//                                         }
//                                     >
//                                         <Trash className="h-4 w-4" />
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Category {
    id: number;
    name: string;
    description: string | null;
    image_url: string[];
    parent_category_id: number | null;
    sub_categories: Category[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([
        {
            id: 1,
            name: "Business Cards",
            description: "Professional business cards for all needs",
            image_url: [
                "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
            ],
            parent_category_id: null,
            sub_categories: [
                {
                    id: 4,
                    name: "Standard Cards",
                    description: "Classic business cards",
                    image_url: [
                        "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
                    ],
                    parent_category_id: 1,
                    sub_categories: [ {
                        id: 2,
                        name: "Marketing Materials",
                        description: "Promotional materials for businesses",
                        image_url: [
                            "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
                        ],
                        parent_category_id: null,
                        sub_categories: [
                            {
                                id: 6,
                                name: "Brochures",
                                description: "Professional brochures",
                                image_url: [
                                    "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
                                ],
                                parent_category_id: 2,
                                sub_categories: [],
                            },
                            {
                                id: 7,
                                name: "Flyers",
                                description: "Marketing flyers",
                                image_url: [
                                    "https://images.unsplash.com/photo-1572025442646-866d16c84a54",
                                ],
                                parent_category_id: 2,
                                sub_categories: [],
                            },
                        ],
                    },],
                },
                {
                    id: 5,
                    name: "Premium Cards",
                    description: "Luxury business cards",
                    image_url: [
                        "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
                    ],
                    parent_category_id: 1,
                    sub_categories: [],
                },
            ],
        },
        {
            id: 2,
            name: "Marketing Materials",
            description: "Promotional materials for businesses",
            image_url: [
                "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
            ],
            parent_category_id: null,
            sub_categories: [
                {
                    id: 6,
                    name: "Brochures",
                    description: "Professional brochures",
                    image_url: [
                        "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
                    ],
                    parent_category_id: 2,
                    sub_categories: [],
                },
                {
                    id: 7,
                    name: "Flyers",
                    description: "Marketing flyers",
                    image_url: [
                        "https://images.unsplash.com/photo-1572025442646-866d16c84a54",
                    ],
                    parent_category_id: 2,
                    sub_categories: [],
                },
            ],
        },
        {
            id: 3,
            name: "Large Format",
            description: "Large format printing solutions",
            image_url: [
                "https://images.unsplash.com/photo-1589384267710-7a170981ca78",
            ],
            parent_category_id: null,
            sub_categories: [
                {
                    id: 8,
                    name: "Banners",
                    description: "Outdoor banners",
                    image_url: [
                        "https://images.unsplash.com/photo-1589384267710-7a170981ca78",
                    ],
                    parent_category_id: 3,
                    sub_categories: [],
                },
            ],
        },
    ]);

    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const toggleExpand = (categoryId: number) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const renderCategoryRow = (category: Category, level: number = 0) => {
        const isExpanded = expandedCategories.includes(category.id);
        const hasSubcategories = category.sub_categories.length > 0;

        return (
            <>
                <TableRow key={`${category.id}-${level}` }>
                    <TableCell>
                        <div
                            className="flex items-center"
                            style={{ paddingLeft: `${level * 2}rem` }}
                        >
                            {hasSubcategories && (
                                <button
                                    onClick={() => toggleExpand(category.id)}
                                    className="p-1 hover:bg-gray-100 rounded-full mr-2"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                            {category.name}
                        </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                        <div className="relative h-10 w-10">
                            <Image
                                src={category.image_url[0]}
                                alt={category.name}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex space-x-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Category</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                defaultValue={category.name}
                                                placeholder="Category name"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                defaultValue={
                                                    category.description || ""
                                                }
                                                placeholder="Category description"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="image">
                                                Image URL
                                            </Label>
                                            <Input
                                                id="image"
                                                defaultValue={
                                                    category.image_url[0]
                                                }
                                                placeholder="Image URL"
                                            />
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

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setSelectedCategory(category)
                                        }
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add Subcategory to {category.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Subcategory name"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Subcategory description"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="image">
                                                Image URL
                                            </Label>
                                            <Input
                                                id="image"
                                                placeholder="Image URL"
                                            />
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
                                            Create Subcategory
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
                                        setSelectedCategory(category);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <AlertDialogContent >
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the
                                            category and all its subcategories.
                                            This action cannot be undone.
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
                {isExpanded &&
                    category.sub_categories.map((subCategory) =>
                        renderCategoryRow(subCategory, level + 1),
                    )}
            </>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories Management</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Category name" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Category description"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" placeholder="Image URL" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Create Category</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) =>
                            renderCategoryRow(category),
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
