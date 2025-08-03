import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDesignCategory } from "@/hooks/use-design-category";
import { useDesignItems } from "@/hooks/use-design-items";
import { useModal } from "@/hooks/use-modal";
import { createFormData } from "@/lib/formData";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { designItemSchema } from "@/schemas/design.item.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const DesignEditForm = () => {
    const { onClose, data } = useModal();
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        data?.design?.img,
    );
    const [downloadUrl, setDownloadUrl] = useState<string | undefined>(
        data?.design?.downloadUrl,
    );

    const form = useForm<z.infer<typeof designItemSchema>>({
        resolver: zodResolver(designItemSchema.partial()),
        defaultValues: {
            name: data?.design?.name,
            designCategoryId: data?.design?.designCategoryId?.toString(),
            // downloadUrl: data?.design?.downloadUrl,
            // img: data?.design?.img,
        },
    });

    const {
        updateDesign: { mutateAsync, isPending },
    } = useDesignItems();

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;
    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );
    const handleDrop = useCallback(
        async (
            files: FileList | File[],
            type: "img" | "downloadUrl" = "img",
        ) => {
            if (files[0] && type === "img") {
                form.setValue("img", files[0], { shouldDirty: true });
                if (imageUrl) URL.revokeObjectURL(imageUrl);
                setImageUrl(URL.createObjectURL(files[0]));
            } else if (files[0] && type === "downloadUrl") {
                form.setValue("downloadUrl", files[0], { shouldDirty: true });
            } else {
                toast.error("File size must be less 5mb");
            }
        },
        [],
    );
    const handleDelete = useCallback((type: "img" | "downloadUrl" = "img") => {
        if ((!!form.getValues("img") || imageUrl) && type === "img") {
            form.resetField("img");
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            setImageUrl(undefined);
        }

        if (type === "downloadUrl") {
            setDownloadUrl(undefined);
            form.resetField("downloadUrl");
        }
    }, []);

    const handleSubmit = async () => {
        if (data?.design?.id) {
            console.log(dirtyFieldsWithValues);
            const formData = createFormData(dirtyFieldsWithValues);
            await mutateAsync({
                id: data?.design?.id,
                data: formData,
            });
            onClose();
            form.reset();
        }
    };

    const { designCategories } = useDesignCategory({
        perpage: 100,
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => handleSubmit())}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="designCategoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    value={field?.value}
                                    onValueChange={(v) => {
                                        field.onChange(v);
                                    }}
                                    disabled
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designCategories?.map((dc) => (
                                            <SelectItem
                                                key={dc.id}
                                                value={dc.id.toString()}
                                            >
                                                {dc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="img"
                    render={() => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <div>
                                    {!!imageUrl ? (
                                        <div className="relative">
                                            <Badge
                                                variant={"destructive"}
                                                className="rounded-full py-2.5 absolute cursor-pointer top-2 right-2"
                                                onClick={() =>
                                                    handleDelete("img")
                                                }
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Badge>
                                            <Image
                                                src={imageUrl}
                                                alt="Category Image"
                                                width={1000}
                                                height={1000}
                                                className="object-contain select-none rounded-md max-h-48"
                                            />
                                        </div>
                                    ) : (
                                        <Dropzone
                                            onDrop={(files) =>
                                                handleDrop(files)
                                            }
                                            className="mt-4"
                                            maxFiles={1}
                                            maxSize={5242880}
                                        />
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="downloadUrl"
                    render={() => (
                        <FormItem>
                            <FormLabel>Download File</FormLabel>
                            <FormControl>
                                {!!downloadUrl ? (
                                    <div className="relative border rounded-lg py-2 px-2">
                                        <Badge
                                            variant={"destructive"}
                                            className="rounded-full absolute cursor-pointer 
                                            top-2/4 -translate-y-2/4 right-2"
                                            onClick={() =>
                                                handleDelete("downloadUrl")
                                            }
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Badge>
                                        <Link href={downloadUrl}>Click Me</Link>
                                    </div>
                                ) : (
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDrop(
                                                e?.target?.files as FileList,
                                                "downloadUrl",
                                            )
                                        }
                                        className="cursor-pointer bg-white hover:bg-gray-100 transition-colors"
                                        // disabled={isLoading}
                                    />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className={`w-full`}
                    disabled={isPending || !form.formState.isDirty}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
        </Form>
    );
};
