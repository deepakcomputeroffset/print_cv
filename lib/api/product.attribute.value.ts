import axios from "axios";
import { z } from "zod";
import { productAttributeValueBaseUrl } from "../urls";
import { productAttributeValue } from "@prisma/client";
import queryString from "query-string";
import { ProductAttributeValueSchema } from "@/schemas/product.attribute.value.form.schema";

export async function fetchProductAttributeValues(
    productAttributeTypeId?: number,
): Promise<{
    data: productAttributeValue[];
}> {
    const url = queryString.stringifyUrl({
        url: productAttributeValueBaseUrl,
        query: { productAttributeId: productAttributeTypeId },
    });
    if (!productAttributeTypeId) return { data: [] };
    const { data } = await axios(url);
    return data;
}

export async function createProductAttributeValue(
    data: z.infer<typeof ProductAttributeValueSchema>,
) {
    const { data: response } = await axios.post(
        productAttributeValueBaseUrl,
        data,
    );
    return response;
}

export async function deleteProductAttributeValue(id: number) {
    const url = `${productAttributeValueBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
