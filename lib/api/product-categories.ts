import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { productCategoryBaseUrl } from "../urls";
import { productCategorySchema } from "@/schemas/product-category-schema";

export async function fetchProductCategories(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: productCategoryBaseUrl,
        query: { ...params },
    });
    const { data } = await axios(url);
    return data;
}

export async function createProductCategory(
    data: z.infer<typeof productCategorySchema>,
) {
    const url = `${productCategoryBaseUrl}`;
    const { data: response } = await axios.post(url, data);
    return response;
}

export async function updateProductCategory(
    id: number,
    data: Partial<z.infer<typeof productCategorySchema>>,
) {
    const url = `${productCategoryBaseUrl}/${id}`;
    const { data: response } = await axios.patch(url, data);
    return response;
}

export async function deleteProductCategory(id: number) {
    const url = `${productCategoryBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
