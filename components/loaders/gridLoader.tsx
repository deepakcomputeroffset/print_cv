import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface GridLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    length?: number;
}

export default function GridLoader({
    length = 15,
    className,
    ...props
}: GridLoaderProps) {
    return (
        <div
            className={cn(
                "container grid grid-cols-3 lg:grid-cols-5 gap-10 px-3 w-full h-full mx-auto py-10",
                className,
            )}
            {...props}
        >
            {Array.from({ length })
                .fill(null)
                .map((_, index) => (
                    <Skeleton
                        key={index}
                        className="w-full h-full min-h-40 min-w-36 rounded-lg"
                    />
                ))}
        </div>
    );
}
