import { Award, Star, ThumbsUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

export default function TrustIndicators() {
    return (
        <div className="bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-xl p-4 border border-primary/10">
            <div className="max-w-2xl mx-auto text-center">
                <h3
                    className={cn(
                        "text-lg font-bold mb-4",
                        sourceSerif4.className,
                    )}
                >
                    Why Choose Our Premium Printing
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            Award Winning
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            10+ Years Experience
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                            <ThumbsUp className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            5000+ Happy Clients
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            Premium Quality
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
