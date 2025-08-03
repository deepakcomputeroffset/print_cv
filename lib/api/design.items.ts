import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { designBaseUrl } from "../urls";
import { design, designCategory } from "@prisma/client";

export async function fetchDesigns(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: designBaseUrl,
        query: { ...params },
    });
    const { data } = await axios<
        ServerResponseType<
            QueryParams & {
                data: (design & { designCategory: designCategory })[];
            }
        >
    >(url);
    return data.data;
}

export async function createDesign(data: FormData) {
    const { data: response } = await axios.post<ServerResponseType<design>>(
        designBaseUrl,
        data,
    );
    return response;
}

export async function updateDesign(id: number, data: FormData) {
    const url = `${designBaseUrl}/${id}`;
    const { data: response } = await axios.patch<ServerResponseType<design>>(
        url,
        data,
    );
    return response;
}

export async function deleteDesign(id: number) {
    const url = `${designBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
