import axios from "axios";
import { z } from "zod";
import { ProductAttributeTypeSchema } from "@/schemas/product.attribute.type.form.schema";
import { productAttributeTypeBaseUrl } from "../urls";
import queryString from "query-string";
import { productAttributeType } from "@prisma/client";
import { ServerResponseType } from "@/types/types";

export async function fetchProductAttributes(productCategoryId?: number) {
    const url = queryString.stringifyUrl({
        url: productAttributeTypeBaseUrl,
        query: { productCategoryId },
    });
    if (!productCategoryId) return [];
    const { data } =
        await axios<ServerResponseType<productAttributeType[]>>(url);
    return data?.data;
}

export async function createProductAttributeType(
    data: z.infer<typeof ProductAttributeTypeSchema>,
) {
    const { data: response } = await axios.post<
        ServerResponseType<productAttributeType>
    >(productAttributeTypeBaseUrl, data);
    return response;
}

export async function deleteProductAttributeType(id: number) {
    const url = `${productAttributeTypeBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
