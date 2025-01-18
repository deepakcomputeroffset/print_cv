"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Dummy data for categories
const dummyCategories = [
  {
    id: "1",
    name: "Business Cards",
    description: "Professional business cards with premium finishes",
    imageUrl:
      "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80",
  },
  {
    id: "2",
    name: "Banners & Signs",
    description: "High-impact banners and signs for any occasion",
    imageUrl:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80",
  },
  {
    id: "3",
    name: "Marketing Materials",
    description: "Brochures, flyers, and promotional materials",
    imageUrl:
      "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80",
  },
  {
    id: "4",
    name: "Custom Stationery",
    description: "Personalized letterheads and envelopes",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
  },
  {
    id: "5",
    name: "Posters",
    description: "Eye-catching posters in various sizes",
    imageUrl:
      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=500&q=80",
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = dummyCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Print Categories</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <div
              className="h-48 w-full bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${category.imageUrl})` }}
            />
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
