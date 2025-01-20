// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// // Dummy data for categories
// const dummyCategories = [
//   {
//     id: "1",
//     name: "Business Cards",
//     description: "Professional business cards with premium finishes",
//     imageUrl:
//       "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
//   },
//   {
//     id: "2",
//     name: "Banners & Signs",
//     description: "High-impact banners and signs for any occasion",
//     imageUrl:
//       "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
//   },
//   {
//     id: "3",
//     name: "Marketing Materials",
//     description: "Brochures, flyers, and promotional materials",
//     imageUrl:
//       "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
//   },
//   {
//     id: "4",
//     name: "Custom Stationery",
//     description: "Personalized letterheads and envelopes",
//     imageUrl:
//       "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
//   },
//   {
//     id: "5",
//     name: "Posters",
//     description: "Eye-catching posters in various sizes",
//     imageUrl:
//       "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=80",
//   },
// ];

// export default function CategoriesPage() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredCategories = dummyCategories.filter((category) =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Print Categories</h1>
//         <div className="relative w-64">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search categories..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCategories.map((category) => (
//           <Card key={category.id} className="hover:shadow-lg transition-shadow">
//             <div
//               className="h-48 w-full bg-cover bg-center rounded-t-lg"
//               style={{ backgroundImage: `url(${category.imageUrl})` }}
//             />
//             <CardHeader>
//               <CardTitle>{category.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">{category.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";

interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    subCategories: Category[];
    _count: {
        subCategories: number;
        products: number;
    };
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    // const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
        null,
    );
    const [breadcrumbs, setBreadcrumbs] = useState<
        { id: string; name: string }[]
    >([]);

    const fetchCategories = async (parentId?: string) => {
        try {
            const url = parentId
                ? `/api/categories?parentId=${parentId}`
                : "/api/categories";
            const response = await fetch(url);
            const data = await response.json();
            setCategories(data);
            // setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentCategoryId || undefined);
    }, [currentCategoryId]);

    const handleCategoryClick = async (category: Category) => {
        if (category._count.subCategories > 0) {
            setCurrentCategoryId(category.id);
            setBreadcrumbs([
                ...breadcrumbs,
                { id: category.id, name: category.name },
            ]);
        } else {
            // If category has no subcategories, redirect to products page
            router.push(`/products?categoryId=${category.id}`);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newBreadcrumbs);
        setCurrentCategoryId(index === -1 ? null : newBreadcrumbs[index].id);
    };

    console.log("from client" + categories);
    const filteredCategories = categories?.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => handleBreadcrumbClick(-1)}
                        >
                            Categories
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.map((crumb, index) => (
                        <BreadcrumbItem key={crumb.id}>
                            <BreadcrumbLink
                                onClick={() => handleBreadcrumbClick(index)}
                            >
                                {crumb.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    ))}
                </Breadcrumb>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <Card
                            key={category.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div
                                className="h-48 w-full bg-cover bg-center rounded-t-lg"
                                style={{
                                    backgroundImage: `url(${category.imageUrl})`,
                                }}
                            />
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{category.name}</CardTitle>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-2">
                                    {category.description}
                                </p>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    {category._count.subCategories > 0 ? (
                                        <span>
                                            {category._count.subCategories}{" "}
                                            Subcategories
                                        </span>
                                    ) : (
                                        <span>
                                            {category._count.products} Products
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
