import { Prisma } from "@/lib/prisma";
import { design } from "@prisma/client";
import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Download,
    Frown,
    TriangleAlert,
} from "lucide-react";
import Link from "next/link";

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

const ItemCard = ({ item }: { item: design }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
        <div className="overflow-hidden py-2">
            <img
                src={item.img}
                alt={item.name}
                className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="px-6 pt-1 pb-4">
            <h4 className="font-bold text-gray-800 text-lg mb-3">
                {item.name}
            </h4>
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

const Pagination = ({
    currentPage,
    totalPages,
    categoryId,
}: {
    currentPage: number;
    totalPages: number;
    categoryId: string;
}) => {
    if (totalPages <= 1) return null; // Don't render if only one page

    const baseButtonClasses =
        "px-4 md:px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md transform hover:scale-105";
    const disabledButtonClasses = "opacity-50 pointer-events-none";

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return (
        <div className="flex justify-center items-center space-x-2 md:space-x-3 my-12">
            <Link
                href={`/free_design/${categoryId}?page=1`}
                className={`${baseButtonClasses} ${!hasPreviousPage ? disabledButtonClasses : ""}`}
            >
                {"<<"}
                <span className="hidden md:inline ml-1">First</span>
            </Link>
            <Link
                href={`/free_design/${categoryId}?page=${currentPage - 1}`}
                className={`${baseButtonClasses} ${!hasPreviousPage ? disabledButtonClasses : ""}`}
            >
                {"<"}
                <span className="hidden md:inline ml-1">Prev</span>
            </Link>

            <span className="text-gray-700 font-medium px-2">
                Page {currentPage} of {totalPages}
            </span>

            <Link
                href={`/free_design/${categoryId}?page=${currentPage + 1}`}
                className={`${baseButtonClasses} ${!hasNextPage ? disabledButtonClasses : ""}`}
            >
                <span className="hidden md:inline mr-1">Next</span>
                {">"}
            </Link>
            <Link
                href={`/free_design/${categoryId}?page=${totalPages}`}
                className={`${baseButtonClasses} ${!hasNextPage ? disabledButtonClasses : ""}`}
            >
                <span className="hidden md:inline mr-1">Last</span>
                {">>"}
            </Link>
        </div>
    );
};

const InfoMessage = ({
    title,
    message,
    icon: Icon,
}: {
    title: string;
    message: string;
    icon?: React.ElementType;
}) => (
    <div className="text-center py-20">
        <div className="flex justify-center items-center mx-auto bg-red-100 rounded-full h-20 w-20 mb-6">
            {Icon ? (
                <Icon size={48} className="text-red-500" />
            ) : (
                <Frown size={48} className="text-red-500" />
            )}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-lg">{message}</p>
    </div>
);

export default async function CategoryItemsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page: string }>;
}) {
    const { id } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const pageSize = 12; // Set number of items per page

    const categoryId = parseInt(id, 10);
    // Handles invalid ID format (e.g., /free_design/abc)
    if (isNaN(categoryId)) {
        return (
            <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
                <main className="flex-grow">
                    <PageHeader title="Invalid URL" />
                    <div className="container mx-auto px-6 py-12">
                        <InfoMessage
                            title="Invalid Category URL"
                            message="The link you followed appears to be broken or incorrect."
                            icon={TriangleAlert}
                        />
                    </div>
                </main>
            </div>
        );
    }

    // Fetch total item count and the category data with paginated designs in parallel
    const [totalDesigns, categoryData] = await Promise.all([
        Prisma.design.count({ where: { designCategoryId: categoryId } }),
        Prisma.designCategory.findUnique({
            where: { id: categoryId },
            include: {
                designs: {
                    skip: (currentPage - 1) * pageSize,
                    take: pageSize,
                    orderBy: {
                        id: "asc", // Consistent ordering is key for pagination
                    },
                },
            },
        }),
    ]);

    // If the category itself doesn't exist, show a 404 page
    if (!categoryData) {
        return (
            <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
                <main className="flex-grow">
                    <PageHeader title="Category Not Found" />
                    <div className="container mx-auto px-6 py-12">
                        <InfoMessage
                            title="Oops! Nothing to see here."
                            message="We couldn't find the design category you were looking for."
                            icon={Frown}
                        />
                    </div>
                </main>
            </div>
        );
    }

    const totalPages = Math.ceil(totalDesigns / pageSize);

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            <main className="flex-grow">
                <PageHeader title={categoryData?.name} />
                <div className="container mx-auto px-6 py-12">
                    <ItemGrid items={categoryData?.designs} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        categoryId={id}
                    />
                </div>
            </main>
        </div>
    );
}
