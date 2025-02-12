import { QuerySchema } from "@/schemas/query-schema";
import {
    address,
    city,
    country,
    customer,
    product,
    product_attribute_type,
    product_attribute_value,
    product_category,
    product_item,
    state,
} from "@prisma/client";
import { z } from "zod";

export type customerWithAddress = customer & {
    address?: address & {
        city?: city & {
            state?: state & {
                country: country;
            };
        };
    };
};

export interface productCategoryWithSubCategory extends product_category {
    sub_categories: product_category[];
}

export interface productAttributeWithOptions extends product_attribute_type {
    product_attribute_options: product_attribute_value[];
}

export interface ProductVariantType
    extends Omit<
        product_item,
        "createdAt" | "updatedAt" | "product_id" | "id"
    > {
    product_attribute_options: product_attribute_value[];
}

export interface QueryParams extends z.infer<typeof QuerySchema> {
    totalPages?: number;
    parent_category_id?: string;
}

export type ProductTypeOnlyWithPrice = Omit<
    product,
    "min_price" | "price" | "mid_price" | "og_price"
> & {
    price: number;
};
export type banStatus = "true" | "false";
export type sortType = "asc" | "desc";
