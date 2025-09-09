import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

interface ProductDescriptionProps {
    description: string;
}

export default function ProductDescription({
    description,
}: ProductDescriptionProps) {
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border-0">
            <div className="border-b border-gray-100 px-4 py-3">
                <h2
                    className={cn(
                        "text-lg font-bold text-gray-800",
                        sourceSerif4.className,
                    )}
                >
                    Product Description
                </h2>
            </div>
            <div className="p-4">
                <div className="prose prose-sm prose-gray max-w-none prose-headings:font-semibold prose-h3:text-primary text-xs">
                    <Markdown>{description}</Markdown>
                </div>
            </div>
        </div>
    );
}
