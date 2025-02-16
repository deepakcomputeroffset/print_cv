import { SelectItem } from "@/components/ui/select";
import { productCategoryWithSubCategory } from "@/types/types";
import { JSX } from "react";

export const getAllProductCategory = (
    productCategory: productCategoryWithSubCategory[] = [],
    level = 0,
): JSX.Element[] => {
    if (!productCategory?.length) return [];
    return productCategory.flatMap((category) => [
        <SelectItem key={category.id} value={category.id.toString()}>
            {"\u00A0".repeat(level * 2)}
            {category.name}
        </SelectItem>,
        ...getAllProductCategory(
            (category.subCategories as productCategoryWithSubCategory[]) ?? [],
            level + 1,
        ),
    ]);
};
