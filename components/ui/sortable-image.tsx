import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Button } from "./button";
import { X, GripVertical } from "lucide-react";

interface SortableImageProps {
    id: string;
    url: string;
    onDelete: () => void;
}

export function SortableImage({ id, url, onDelete }: SortableImageProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div className="relative h-24 w-full">
                <Image
                    src={url}
                    alt="Product image"
                    fill
                    className="object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onDelete}
                >
                    <X className="h-4 w-4" />
                </Button>
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-6 w-6 text-white drop-shadow-md" />
                </div>
            </div>
        </div>
    );
}
