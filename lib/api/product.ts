import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { QueryParams, ServerResponseType } from "@/types/types";
import { productBaseUrl } from "../urls";
import { productFormSchema } from "@/schemas/product.form.schema";
import { product, productCategory, productItem } from "@prisma/client";

export async function fetchProducts(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: productBaseUrl,
        query: { ...params },
    });
    const { data } = await axios<
        ServerResponseType<
            QueryParams & {
                data: (product & {
                    productItems: productItem[];
                    category: productCategory;
                })[];
            }
        >
    >(url);
    return data.data;
}

export async function createProduct(data: z.infer<typeof productFormSchema>) {
    const { data: response } = await axios.post<ServerResponseType<product>>(
        productBaseUrl,
        data,
    );
    return response;
}

export async function updateProduct(
    id: number,
    data: Partial<z.infer<typeof productFormSchema>>,
) {
    const url = `${productBaseUrl}/${id}`;
    const { data: response } = await axios.patch<ServerResponseType<product>>(
        url,
        data,
    );
    return response;
}

export async function deleteProduct(id: number) {
    const url = `${productBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}

export async function toggleAvailability(id: number) {
    const url = `${productBaseUrl}/${id}/available`;
    const { data } = await axios.get<ServerResponseType<product>>(url);
    return data;
}
