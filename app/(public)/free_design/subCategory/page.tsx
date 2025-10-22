import { Prisma } from "@/lib/prisma";
import { designCategory } from "@prisma/client";
import { ArrowLeft, CalendarDays, ChevronRight } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type CategoryCardProps = {
    category: designCategory & {
        _count: {
            designs: number;
        };
    };
};

const PageHeader = ({ title }: { title: string }) => {
    const currentDate = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="relative bg-slate-50 overflow-hidden border-b border-slate-200">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[url(https://www.tailwindcss.com/img/beams.jpg)] bg-cover bg-center bg-no-repeat opacity-5"></div>

            <div className="relative container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Left side: Breadcrumbs and Title */}
                    <div>
                        {/* Breadcrumb Navigation */}
                        <nav className="flex items-center text-sm font-medium text-slate-500 mb-2">
                            <Link
                                href="/"
                                className="hover:text-cyan-600 transition-colors"
                            >
                                Home
                            </Link>
                            <ChevronRight size={16} className="mx-1" />
                            <Link
                                href="/free_design"
                                className="hover:text-cyan-600 transition-colors"
                            >
                                Free Designs
                            </Link>
                        </nav>

                        {/* Page Title */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Right side: Actions and Info */}
                    <div className="mt-6 md:mt-0 flex flex-col md:items-end space-y-4">
                        {/* Back Button */}
                        <Link
                            href="/free_design"
                            className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Categories
                        </Link>

                        {/* Current Date Display */}
                        <div className="flex items-center text-xs font-medium text-slate-500">
                            <CalendarDays size={14} className="mr-2" />
                            <span>{currentDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryCard = ({ category }: CategoryCardProps) => (
    <Link href={`/free_design/${category.id}`} className="block group">
        <div className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <img
                src={category.img}
                alt={category.name}
                className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-blue-600">
                    {category.name}
                </h3>
                <p className="text-sm text-cyan-600 font-semibold">
                    🎨 {category?._count?.designs} Designs
                </p>
            </div>
        </div>
    </Link>
);

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ parentId: string }>;
}) {
    const { parentId } = await searchParams;
    if (!parentId || isNaN(Number(parentId))) {
        redirect("/free_design");
    }

    async function getCategories() {
        return await Promise.all([
            Prisma.designCategory.findUnique({
                where: {
                    id: Number(parentId),
                },
            }),
            await Prisma.designCategory.findMany({
                where: {
                    parentCategoryId: Number(parentId),
                },
                include: {
                    _count: {
                        select: {
                            designs: true,
                        },
                    },
                },
            }),
        ]);
    }

    const cachedData = unstable_cache(getCategories, ["categories-design"], {
        revalidate: 60 * 60,
        tags: [`subCategory-${parentId}`],
    });

    const [parentCategory, categories] = await cachedData();

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <main className="flex-grow">
                <PageHeader
                    title={parentCategory?.name || "Design Categories"}
                    // description={
                    //     "Browse our collection of professional design templates. Click any category to explore and download."
                    // }
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
