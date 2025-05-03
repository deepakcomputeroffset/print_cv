import { QuerySchema } from "@/schemas/query.param.schema";
import {
    address,
    city,
    country,
    customer,
    attachment,
    job,
    order,
    product,
    productAttributeType,
    productAttributeValue,
    productCategory,
    productItem,
    state,
    task,
} from "@prisma/client";
import { z, ZodIssue } from "zod";

export type addressType = address & {
    city?: city & {
        state?: state & {
            country: country;
        };
    };
};

export type customerType = Omit<customer, "password"> & {
    address: addressType | null;
    wallet?: { id: number; balance: number };
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

export interface QueryParams extends z.infer<typeof QuerySchema> {}

export type ProductType = Omit<
    product,
    "minPrice" | "avgPrice" | "maxPrice" | "ogPrice"
>;
export type ProductTypeOnlyWithPrice = ProductType & {
    price: number;
};

export type ProductItemType = Omit<
    productItem,
    "minPrice" | "avgPrice" | "maxPrice" | "ogPrice"
>;
export type ProductItemTypeOnlyWithPrice = ProductItemType & {
    price: number;
    productAttributeOptions: (productAttributeValue & {
        productAttributeType: productAttributeType;
    })[];
};

export type banStatus = "true" | "false";
export type sortType = "asc" | "desc";

export type ValidationError = {
    field: string;
    message: string;
};

export interface ServerResponseType<T> {
    success: boolean;
    message?: string | undefined;
    error?: string | undefined | ZodIssue[] | ValidationError[] | any;
    data?: T | undefined;
    status: number;
}

export interface orderType extends order {
    attachment: attachment;
    job: job & { tasks: task[] };
    productItem: productItem & {
        product: product & {
            category: productCategory;
        };
        productAttributeOptions: productAttributeValue[];
    };
    customer: Pick<
        customer,
        | "businessName"
        | "customerCategory"
        | "email"
        | "gstNumber"
        | "id"
        | "name"
        | "phone"
        | "isBanned"
    > & {
        address: address & {
            city: city & {
                state: state & { country: country };
            };
        };
    };
}

export type FileLike = {
    size: number;
    type: string;
    name?: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
};
