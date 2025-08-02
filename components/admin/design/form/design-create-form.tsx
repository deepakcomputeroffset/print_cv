"use client";
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
import { designItemSchema } from "@/schemas/design.item.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const DesignCreateForm = () => {
    const { onClose } = useModal();
    const [imageUrl, setImageUrl] = useState<string>();

    const form = useForm<z.infer<typeof designItemSchema>>({
        resolver: zodResolver(designItemSchema),
        defaultValues: {
            name: "",
        },
    });

    const {
        createDesign: { isPending, mutateAsync },
    } = useDesignItems();

    const { designCategories } = useDesignCategory({
        perpage: 100,
    });

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
        }
        form.resetField("downloadUrl");
    }, []);

    const handleSubmit = async (values: z.infer<typeof designItemSchema>) => {
        const formData = createFormData(values);

        await mutateAsync(formData);
        onClose();
        form.reset();
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            setImageUrl(undefined);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => handleSubmit(values))}
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
                                                onClick={() => handleDelete()}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Badge>
                                            <Image
                                                src={imageUrl}
                                                alt="Category Image"
                                                width={1000}
                                                height={1000}
                                                className="object-contain select-none rounded-md"
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
                                {/* <Dropzone
                                    onDrop={(files) =>
                                        handleDrop(files, "downloadUrl")
                                    }
                                    className="mt-4"
                                    maxFiles={1}
                                    maxSize={5242880}
                                /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "create"
                    )}
                </Button>
            </form>
        </Form>
    );
};
