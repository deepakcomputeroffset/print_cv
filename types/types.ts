import { QuerySchema } from "@/schemas/query.param.schema";
import {
    address,
    city,
    country,
    customer,
    product,
    productAttributeType,
    productAttributeValue,
    productCategory,
    productItem,
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

export interface productCategoryWithSubCategory extends productCategory {
    subCategories: productCategory[];
}

export interface productAttributeWithOptions extends productAttributeType {
    productAttributeOptions: productAttributeValue[];
}

export interface ProductVariantType
    extends Omit<productItem, "createdAt" | "updatedAt" | "productId" | "id"> {
    productAttributeOptions: productAttributeValue[];
}

export interface QueryParams extends z.infer<typeof QuerySchema> {
    totalPages?: number;
    parentCategoryId?: string;
}

export type ProductTypeOnlyWithPrice = Omit<
    product,
    "minPrice" | "price" | "midPrice" | "ogPrice"
> & {
    price: number;
};

export type ProductItemTypeOnlyWithPrice = Omit<
    productItem,
    "minPrice" | "price" | "midPrice" | "ogPrice"
> & {
    price: number;
    productAttributeOptions: (productAttributeValue & {
        productAttributeType: productAttributeType;
    })[];
};

export type banStatus = "true" | "false";
export type sortType = "asc" | "desc";
