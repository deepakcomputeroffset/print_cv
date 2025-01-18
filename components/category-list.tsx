"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch categories
    // This is just mock data for now
    const mockCategories = [
      {
        id: "1",
        name: "Business Cards",
        description: "Professional business cards with various designs",
        imageUrl: "https://images.unsplash.com/photo-1589041127168-bf8039d9d9cc?w=500&q=80"
      },
      {
        id: "2",
        name: "Banners",
        description: "High-quality banners for events and advertising",
        imageUrl: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&q=80"
      },
      {
        id: "3",
        name: "Flyers",
        description: "Custom flyers for promotions and events",
        imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=500&q=80"
      },
    ];
    
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link href={`/categories/${category.id}`} key={category.id}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
        </Link>
      ))}
    </div>
  );
}