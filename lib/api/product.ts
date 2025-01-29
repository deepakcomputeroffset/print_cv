import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { productBaseUrl } from "../urls";
import { productFormSchema } from "@/schemas/product-schema";
import { product } from "@prisma/client";

export async function fetchProducts(
    params: QueryParams = {},
): Promise<QueryParams & { data: product[] }> {
    const url = queryString.stringifyUrl({
        url: productBaseUrl,
        query: { ...params },
    });
    const { data } = await axios(url);
    return data;
}

export async function createProduct(data: z.infer<typeof productFormSchema>) {
    const url = `${productBaseUrl}`;
    const { data: response } = await axios.post(url, data);
    return response;
}

export async function updateProduct(
    id: number,
    data: Partial<z.infer<typeof productFormSchema>>,
) {
    const url = `${productBaseUrl}/${id}`;
    const { data: response } = await axios.patch(url, data);
    return response;
}

export async function deleteProduct(id: number) {
    const url = `${productBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
