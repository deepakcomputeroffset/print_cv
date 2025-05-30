import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { product } from "@prisma/client";
import { ChevronRight } from "lucide-react";

export const PCard = ({
    product,
    onClickHandler,
}: {
    product: Pick<
        product,
        "name" | "description" | "id" | "imageUrl" | "isAvailable"
    >;
    onClickHandler: (id: number) => void;
}) => {
    return (
        <Card
            className={cn(
                "bg-white transition-all duration-300 overflow-hidden relative h-full border-0 rounded-2xl shadow-md hover:shadow-xl",
                product.isAvailable
                    ? "cursor-pointer group hover:-translate-y-2"
                    : "cursor-not-allowed opacity-80",
            )}
            onClick={
                product.isAvailable
                    ? () => onClickHandler(product.id)
                    : undefined
            }
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative h-32 sm:h-40 md:h-44 w-full overflow-hidden">
                {/* Premium gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-black/10 z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                        backgroundImage: `url(${product.imageUrl[0] || "/placeholder-image.jpg"})`,
                        transformOrigin: "center",
                    }}
                />

                {/* Category name overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-20">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white drop-shadow-md mb-1 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                        {product.name}
                    </h3>
                </div>

                {/* Interactive accent elements */}
                {product.isAvailable && (
                    <>
                        <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-all duration-300 z-10 rounded-2xl"></div>
                    </>
                )}
            </div>

            {!product.isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="p-2 sm:px-6 sm:py-3 rounded-full bg-white/10 border border-white/20 shadow-lg">
                        <span className="text-[10px] sm:text-sm text-white font-semibold tracking-wide">
                            Coming Soon
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
};
