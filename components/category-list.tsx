"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

interface PrintingService {
    id: string | number;
    name: string;
    description: string;
    image: string;
}

export function CategoryList() {
    const [categories] = useState<PrintingService[]>([
        {
            id: 1,
            name: "VISITING CARDS",
            image: "https://www.printersclub.in/images/cat-images/Visiting%20Card.jpg",
            description: "Professional business cards with various designs",
        },
        {
            id: 2,
            name: "PAMPHLET / POSTERS",
            image: "https://www.printersclub.in/images/cat-images/Pamphle.jpg",
            description: "High-quality banners for events and advertising",
        },
        {
            id: 3,
            name: "GARMENTS TAGS",
            image: "https://www.printersclub.in/images/cat-images/tag%20246sa.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 4,
            name: "FILES",
            image: "https://www.printersclub.in/images/cat-images/dr%20file%204546a.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 5,
            name: "LETTER HEADS",
            image: "https://www.printersclub.in/images/cat-images/Letter%20Head.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 6,
            name: "ENVELOPES",
            image: "https://www.printersclub.in/images/cat-images/Envelope%20img.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 7,
            name: "DIGITAL PAPER PRINTING",
            image: "https://www.printersclub.in/images/cat-images/Digital%20Printing.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 8,
            name: "ATM POUCHES",
            image: "https://www.printersclub.in/images/cat-images/ATM%20Pouch.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 9,
            name: "BILL BOOKS",
            image: "https://www.printersclub.in/images/cat-images/Bill%20Book.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 10,
            name: "STICKERS & LABELS",
            image: "https://www.printersclub.in/images/cat-images/Sticker.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 11,
            name: "PENS",
            image: "https://www.printersclub.in/images/cat-images/Pen.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 12,
            name: "SHOOTING TARGETS",
            image: "https://www.printersclub.in/images/cat-images/Shooting%20Targets.jpg",
            description: "Custom flyers for promotions and events",
        },
        {
            id: 13,
            name: "SAMPLE FILES",
            image: "https://www.printersclub.in/images/cat-images/Sample%20File.jpg",
            description: "Custom flyers for promotions and events",
        },
    ]);

    // if (loading) {
    //     return (
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //             {[1, 2, 3].map((i) => (
    //                 <Card
    //                     key={i}
    //                     className="cursor-pointer hover:shadow-lg transition-shadow"
    //                 >
    //                     <Skeleton className="h-48 w-full" />
    //                     <CardHeader>
    //                         <Skeleton className="h-6 w-2/3" />
    //                     </CardHeader>
    //                     <CardContent>
    //                         <Skeleton className="h-4 w-full" />
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //         </div>
    //     );
    // }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
                <Link href={`/categories/${category.id}`} key={category.id}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                        <div
                            className="h-48 w-full bg-cover bg-center rounded-t-lg"
                            style={{
                                backgroundImage: `url(${category.image})`,
                            }}
                        />
                        <CardHeader>
                            <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {category.description}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
