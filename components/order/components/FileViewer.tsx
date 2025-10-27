import { Button } from "@/components/ui/button";
import { OrderDetailsPageProps } from "@/types/types";
import { ExternalLink, ImageIcon } from "lucide-react";

export function FileViewer({ order }: OrderDetailsPageProps) {
    // Helper to detect simple file types from URL
    const isImage = (url: string) =>
        /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?.*)?$/i.test(url);
    const isPdf = (url: string) => /\.pdf(\?.*)?$/i.test(url);

    const attachments = order.attachment ?? [];

    if (attachments.length === 0) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {new Array(4).fill(0).map((_, idx) => (
                    <EmptyCard key={idx} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file) => (
                    <div
                        key={file.id}
                        className="border rounded-md overflow-hidden bg-white shadow-sm"
                    >
                        <div className="w-full h-44 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {isImage(file.url) ? (
                                <img
                                    src={file.url}
                                    alt={`attachment-${file.id}`}
                                    className="max-h-44 object-contain w-full"
                                />
                            ) : isPdf(file.url) ? (
                                <iframe
                                    src={file.url}
                                    title={`attachment-${file.id}`}
                                    className="w-full h-44 overflow-hidden"
                                />
                            ) : (
                                // fallback: try iframe which handles many file-hosting previewers
                                <iframe
                                    src={file.url}
                                    title={`attachment-${file.id}`}
                                    className="w-full h-44"
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-between p-2">
                            <div className="text-xs text-gray-700 truncate">
                                {file.type}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    asChild
                                    className="flex items-center gap-2"
                                >
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Open attachment ${file.id} in new tab`}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyCard() {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md text-center text-sm text-gray-500">
            <div className="p-6 rounded-md bg-gray-50 mb-3">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
            <div>No attachments uploaded</div>
            <div className="text-xs text-gray-400">
                Customer did not upload any files for this order.
            </div>
        </div>
    );
}
