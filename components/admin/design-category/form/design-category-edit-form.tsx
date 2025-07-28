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
import { useDesignCategory } from "@/hooks/use-design-category";
import { useModal } from "@/hooks/use-modal";
import { createFormData } from "@/lib/formData";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { getDesignCategorySchema } from "@/schemas/design.category.form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const DesignCategoryEditForm = () => {
    const { onClose, data } = useModal();
    const designCategorySchema = getDesignCategorySchema();
    const form = useForm<z.infer<typeof designCategorySchema>>({
        resolver: zodResolver(designCategorySchema.partial()),
        defaultValues: {
            name: data?.designCategory?.name,
        },
    });

    const [imageUrl, setImageUrl] = useState<string | undefined>(
        data?.designCategory?.img,
    );

    const {
        updateDesignCategory: { mutateAsync, isPending },
    } = useDesignCategory();

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;
    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );
    const handleDrop = useCallback(async (files: File[]) => {
        if (files[0]) {
            form.setValue("img", files[0], { shouldDirty: true });
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            setImageUrl(URL.createObjectURL(files[0]));
        } else {
            toast.error("Image size must be less 5mb");
        }
    }, []);

    const handleDelete = useCallback(() => {
        if (!!form.getValues("img") || imageUrl) {
            form.resetField("img");
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            setImageUrl(undefined);
        }
    }, []);

    const handleSubmit = async () => {
        if (data?.productCategory?.id) {
            console.log(dirtyFieldsWithValues);
            const formData = createFormData(dirtyFieldsWithValues);
            await mutateAsync({
                id: data?.productCategory?.id,
                data: formData,
            });
            onClose();
            form.reset();
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => handleSubmit())}
                className="space-y-4"
            >
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

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "update"
                    )}
                </Button>
            </form>
        </Form>
    );
};
