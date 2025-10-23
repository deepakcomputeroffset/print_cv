import { Prisma } from "@/lib/prisma";
import { designCategory } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import React from "react";

type HeaderProps = {
    title: string;
    description: string;
};

type CategoryCardProps = {
    category: designCategory & {
        _count: {
            designs: number;
            subCategories: number;
        };
    };
};

const Header = ({ title, description }: HeaderProps) => (
    <header className="text-center py-6 md:py-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2 md:mb-4">
                {title}
            </h1>
            <p className="text-xs md:text-base text-gray-600 max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    </header>
);

const CategoryCard = ({ category }: CategoryCardProps) => (
    <Link
        href={
            category?._count?.subCategories > 0
                ? `/free_design/subCategory/${category.id}`
                : `/free_design/${category.id}`
        }
        className="block group"
    >
        <div className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <img
                src={category.img}
                alt={category.name}
                className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-2">
                <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-600">
                    {category.name}
                </h3>

                <p className="text-xs text-cyan-600 font-semibold">
                    🎨{" "}
                    {category?._count?.subCategories
                        ? `${category?._count?.subCategories} categories`
                        : `${category?._count?.designs} Designs`}
                </p>
            </div>
        </div>
    </Link>
);

export default async function CategoriesPage() {
    async function getCategories() {
        return await Prisma.designCategory.findMany({
            where: { parentCategoryId: null },
            include: {
                _count: {
                    select: {
                        designs: true,
                        subCategories: true,
                    },
                },
            },
        });
    }
    const cachedData = unstable_cache(getCategories, ["categories-design"], {
        revalidate: 60 * 60,
        tags: ["categories-design"],
    });

    const categories = await cachedData();

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <main className="flex-grow">
                <Header
                    title="Free Design Templates"
                    description="Browse our collection of professional design templates. Click any category to explore and download."
                />
                <section className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
