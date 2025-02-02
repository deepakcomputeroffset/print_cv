import {
    address,
    city,
    country,
    customer,
    CUSTOMER_CATEGORY,
    product_attribute_type,
    product_attribute_value,
    product_category,
    state,
} from "@prisma/client";

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

export interface ProductVariantType {
    id: string;
    sku: string;
    og_price: number;
    min_qty: number;
    min_price: number;
    avg_price: number;
    max_price: number;
    image_url: string[];
    available: boolean;
    product_attribute_options: product_attribute_value[];
}

export interface QueryParams {
    page?: number;
    perpage?: number;
    totalPages?: number;
    search?: string;
    category?: "all" | CUSTOMER_CATEGORY;
    status?: banStatus | "all";
    sortby?: string;
    sortorder?: sortType;
}

export type banStatus = "true" | "false";
export type sortType = "asc" | "desc";
