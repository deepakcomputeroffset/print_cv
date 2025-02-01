import axios from "axios";
import { z } from "zod";
import { ProductAttributeTypeSchema } from "@/schemas/product-attribute-type";
import { productAttributeTypeBaseUrl } from "../urls";
import queryString from "query-string";
import { productAttributeWithOptions } from "@/types/types";

export async function fetchProductAttributes(
    product_category_id?: number,
): Promise<{
    data: productAttributeWithOptions[];
}> {
    const url = queryString.stringifyUrl({
        url: productAttributeTypeBaseUrl,
        query: { product_category_id },
    });
    if (!product_category_id) return { data: [] };
    const { data } = await axios(url);
    return data;
}

export async function createProductAttributeType(
    data: z.infer<typeof ProductAttributeTypeSchema>,
) {
    const url = `${productAttributeTypeBaseUrl}`;
    const { data: response } = await axios.post(url, data);
    return response;
}

export async function deleteProductAttributeType(id: number) {
    const url = `${productAttributeTypeBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
