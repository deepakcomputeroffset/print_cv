import queryString from "query-string";
import axios from "axios";
import {
    productCategoryWithSubCategory,
    QueryParams,
    ServerResponseType,
} from "@/types/types";
import { productCategoryBaseUrl } from "@/lib/urls";
import { productCategory } from "@prisma/client";

type ResponseType = QueryParams & { data: productCategoryWithSubCategory[] };

export async function fetchProductCategories(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: productCategoryBaseUrl,
        query: { ...params },
    });

    const { data } = await axios.get<ServerResponseType<ResponseType>>(url);
    return data;
}

export async function createProductCategory(data: FormData) {
    const { data: response } = await axios.post<
        ServerResponseType<productCategory>
    >(productCategoryBaseUrl, data);
    return response;
}

export async function updateProductCategory(id: number, data: FormData) {
    const url = `${productCategoryBaseUrl}/${id}`;
    const { data: response } = await axios.patch<
        ServerResponseType<productCategory>
    >(url, data);
    return response;
}

export async function deleteProductCategory(id: number) {
    const url = `${productCategoryBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
