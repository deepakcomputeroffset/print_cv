"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Dummy data for products
const dummyProducts = [
  {
    id: "1",
    name: "Premium Business Cards",
    description: "High-quality 400gsm cards with spot UV finish",
    price: 49.99,
    categoryId: "1",
    category: "Business Cards",
    imageUrl:
      "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
  },
  {
    id: "2",
    name: "Vinyl Banner",
    description: "Weather-resistant vinyl banner with grommets",
    price: 79.99,
    categoryId: "2",
    category: "Banners & Signs",
    imageUrl:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
  },
  {
    id: "3",
    name: "Tri-fold Brochure",
    description: "Professional tri-fold brochures on glossy paper",
    price: 199.99,
    categoryId: "3",
    category: "Marketing Materials",
    imageUrl:
      "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
  },
  {
    id: "4",
    name: "Custom Letterhead",
    description: "Premium letterhead with your business design",
    price: 89.99,
    categoryId: "4",
    category: "Custom Stationery",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
  },
  {
    id: "5",
    name: "Large Format Poster",
    description: "High-resolution large format poster printing",
    price: 129.99,
    categoryId: "5",
    category: "Posters",
    imageUrl:
      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=80",
  },
];

const categories = [
  { id: "1", name: "Business Cards" },
  { id: "2", name: "Banners & Signs" },
  { id: "3", name: "Marketing Materials" },
  { id: "4", name: "Custom Stationery" },
  { id: "5", name: "Posters" },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priceSort, setPriceSort] = useState("NO");

  let filteredProducts = dummyProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "ALL" || product.categoryId === categoryFilter)
  );

  if (priceSort !== "NO") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      priceSort === "asc" ? a.price - b.price : b.price - a.price
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO">No sorting</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div
              className="h-48 w-full bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-xl font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
