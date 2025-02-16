import axios from "axios";
import { z } from "zod";
import { ProductAttributeTypeSchema } from "@/schemas/product.attribute.type.form.schema";
import { productAttributeTypeBaseUrl } from "../urls";
import queryString from "query-string";
import { productAttributeType } from "@prisma/client";

export async function fetchProductAttributes(
    productCategoryId?: number,
): Promise<{
    data: productAttributeType[];
}> {
    const url = queryString.stringifyUrl({
        url: productAttributeTypeBaseUrl,
        query: { productCategoryId },
    });
    if (!productCategoryId) return { data: [] };
    const { data } = await axios(url);
    return data;
}

export async function createProductAttributeType(
    data: z.infer<typeof ProductAttributeTypeSchema>,
) {
    const { data: response } = await axios.post(
        productAttributeTypeBaseUrl,
        data,
    );
    return response;
}

export async function deleteProductAttributeType(id: number) {
    const url = `${productAttributeTypeBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
