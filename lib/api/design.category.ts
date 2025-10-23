import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { designCategoryBaseUrl } from "@/lib/urls";
import { designCategory } from "@prisma/client";

type ResponseType = QueryParams & {
    data: (designCategory & { subCategories: designCategory[] })[];
};

export async function fetchProductCategories(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: designCategoryBaseUrl,
        query: { ...params },
    });

    const { data } = await axios.get<ServerResponseType<ResponseType>>(url);
    return data;
}

export async function createProductCategory(data: FormData) {
    const { data: response } = await axios.post<
        ServerResponseType<designCategory>
    >(designCategoryBaseUrl, data);
    return response;
}

export async function updateProductCategory(id: number, data: FormData) {
    const url = `${designCategoryBaseUrl}/${id}`;
    const { data: response } = await axios.patch<
        ServerResponseType<designCategory>
    >(url, data);
    return response;
}

export async function deleteProductCategory(id: number) {
    const url = `${designCategoryBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
