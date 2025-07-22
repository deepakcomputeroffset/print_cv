import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import { ServerResponseType } from "@/types/types";
import axios, { AxiosError } from "axios";
import { FileText, Loader2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export const UploadFileModal = () => {
    const { isOpen, modal, data, onClose } = useModal();
    const isModalOpen = modal === "uploadOrderFile" && isOpen;
    const [files, setFiles] = useState<File[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...e.target.files]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!data?.orderId || files?.length === 0) return;
            setIsLoading(true);
            const formData = new FormData();
            files?.forEach((f) => {
                formData.set("files", f);
            });

            const { data: response } = await axios.post<
                ServerResponseType<{ urls: string[] }>
            >(`/api/orders/${data?.orderId}/upload`, formData);

            if (response?.success) {
                toast.success(response?.message);
            }
        } catch (error) {
            console.log(error);
            toast.warning(
                (
                    (error as AxiosError)?.response
                        ?.data as ServerResponseType<{ urls: string[] }>
                )?.message || "Files not uploaded",
            );
        } finally {
            setIsLoading(false);

            onClose();
        }
    };
    return (
        <Modal
            title="Upload Files"
            onClose={() => {
                onClose();
            }}
            isOpen={isModalOpen}
        >
            <div className="mt-6">
                <Label className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="h-1 w-5 mr-2 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                    Upload File For #{data?.orderId}
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 group hover:border-primary/20">
                    <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>

                    {files &&
                        files?.map((file, idx) => (
                            <p key={idx} className="text-sm text-gray-600 mb-4">
                                {file.name}
                            </p>
                        ))}
                    {files?.length === 0 && (
                        <p className="text-sm text-gray-600 mb-4">
                            Drag and drop your file here or click to browse
                        </p>
                    )}

                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                        multiple
                        className="cursor-pointer bg-white hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Supported formats: PDF (Max size: 10MB)
                    </p>
                </div>
            </div>
            <Button disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                    "Upload"
                )}
            </Button>
        </Modal>
    );
};
