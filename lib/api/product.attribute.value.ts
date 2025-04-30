import axios from "axios";
import { z } from "zod";
import { productAttributeValueBaseUrl } from "../urls";
import { productAttributeValue } from "@prisma/client";
import queryString from "query-string";
import { ProductAttributeValueSchema } from "@/schemas/product.attribute.value.form.schema";
import { ServerResponseType } from "@/types/types";

export async function fetchProductAttributeValues(
    productAttributeTypeId?: number,
) {
    const url = queryString.stringifyUrl({
        url: productAttributeValueBaseUrl,
        query: { productAttributeId: productAttributeTypeId },
    });
    if (!productAttributeTypeId) return [];
    const { data } =
        await axios<ServerResponseType<productAttributeValue[]>>(url);
    return data?.data;
}

export async function createProductAttributeValue(
    data: z.infer<typeof ProductAttributeValueSchema>,
) {
    const { data: response } = await axios.post<
        ServerResponseType<productAttributeValue>
    >(productAttributeValueBaseUrl, data);
    return response;
}

export async function deleteProductAttributeValue(id: number) {
    const url = `${productAttributeValueBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
