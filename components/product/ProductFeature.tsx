import { Card } from "@/components/ui/card";
import { Package, Truck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

export default function ProductFeatures() {
    return (
        <div>
            <div className="text-center mb-6">
                <h2
                    className={cn(
                        "text-xl font-bold relative inline-block",
                        sourceSerif4.className,
                    )}
                >
                    <span className="relative z-10">Premium Features</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-cyan-500/30"></span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                    <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                Premium Quality
                            </h3>
                            <p className="text-gray-500 text-xs">
                                High-quality materials and attention to detail.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                    <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                Fast Delivery
                            </h3>
                            <p className="text-gray-500 text-xs">
                                Quick processing within 3-5 business days.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                    <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                Satisfaction Guarantee
                            </h3>
                            <p className="text-gray-500 text-xs">
                                100% money-back guarantee on all products.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
