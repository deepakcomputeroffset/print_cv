import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export const PCard = ({
    imageUrl,
    productName,
}: {
    imageUrl: string;
    productName: string;
}) => {
    return (
        <Card className="overflow-hidden h-full bg-white transition-all duration-300 border-0 rounded-xl shadow-md hover:shadow-xl group hover:-translate-y-2">
            <div className="relative h-32 sm:h-40 md:h-44 w-full overflow-hidden">
                {/* Premium gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        transformOrigin: "center",
                    }}
                />

                {/* Interactive accent element */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ChevronRight className="h-4 w-4 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-20">
                    <h3 className="text-xs sm:text-base font-semibold text-white drop-shadow-md mb-1 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                        {productName}
                    </h3>
                </div>
            </div>

            {/* <div className="p-5">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                        <span className="text-sm text-gray-500 font-medium">
                                            Product
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 mb-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {product.description ||
                                            "Premium quality printing product"}
                                    </p>
                                </div> */}
        </Card>
    );
};
