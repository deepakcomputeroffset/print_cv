import axios from "axios";
import { z } from "zod";
import { productAttributeValueBaseUrl } from "../urls";
import { product_attribute_value } from "@prisma/client";
import queryString from "query-string";
import { ProductAttributeValueSchema } from "@/schemas/product-attribute-type-value";

export async function fetchProductAttributeValues(
    product_attribute_type_id?: number,
): Promise<{
    data: product_attribute_value[];
}> {
    const url = queryString.stringifyUrl({
        url: productAttributeValueBaseUrl,
        query: { productAttributeId: product_attribute_type_id },
    });
    if (!product_attribute_type_id) return { data: [] };
    const { data } = await axios(url);
    return data;
}

export async function createProductAttributeValue(
    data: z.infer<typeof ProductAttributeValueSchema>,
) {
    const url = `${productAttributeValueBaseUrl}`;
    const { data: response } = await axios.post(url, data);
    return response;
}

export async function deleteProductAttributeValue(id: number) {
    const url = `${productAttributeValueBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
