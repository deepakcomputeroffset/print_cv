import { Prisma } from "@/lib/prisma";
import { design } from "@prisma/client";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

const PageHeader = ({ title }: { title: string }) => (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 py-8 border-b">
        <div className="container mx-auto px-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                {title}
            </h1>
            <Link
                href="/free_design"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Categories
            </Link>
        </div>
    </div>
);

const ItemCard = ({ item }: { item: design }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
        <div className="overflow-hidden">
            <img
                src={item.img}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="p-6">
            <h4 className="font-bold text-gray-800 text-lg mb-3">{item.id}</h4>
            <Link
                href={item.downloadUrl}
                download={true}
                className="flex items-center justify-center w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
                <Download size={18} className="mr-2" />
                Download CDR
            </Link>
        </div>
    </div>
);

const ItemGrid = ({ items }: { items: design[] }) => {
    if (items.length === 0) {
        return (
            <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-gray-500 text-xl">
                    No designs found for this category.
                </p>
                <p className="text-gray-400 mt-2">
                    Check back soon for new templates!
                </p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    );
};

const Pagination = () => {
    const buttonClasses =
        "px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md";
    return (
        <div className="flex justify-center items-center space-x-3 my-12">
            <button className={buttonClasses}>{"<<"} First</button>
            <button className={buttonClasses}>{"<"} Previous</button>
            <button className={buttonClasses}>Next {">"}</button>
            <button className={buttonClasses}>Last {">>"}</button>
        </div>
    );
};

// --- Main Page Component ---

export default async function CategoryItemsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (!id) {
        return (
            <div>
                <p>Not Found id</p>
            </div>
        );
    }
    const designs = await Prisma.designCategory.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            designs: true,
        },
    });

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            <main className="flex-grow">
                <PageHeader title={designs?.name as string} />
                <div className="container mx-auto px-6 py-12">
                    {designs?.designs && <ItemGrid items={designs?.designs} />}
                    {designs?.designs?.length && <Pagination />}
                </div>
            </main>
        </div>
    );
}
