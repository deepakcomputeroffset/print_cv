import queryString from "query-string";
import axios from "axios";
import { orderType, QueryParams, ServerResponseType } from "@/types/types";
import { jobBaseUrl, ordersBaseUrl } from "../urls";

export async function fetchOrders(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: ordersBaseUrl,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                orders: orderType[];
            }
        >
    >(url);
}

export async function addJobToOrders(id: number, orders: number[]) {
    const url = queryString.stringifyUrl({
        url: `${jobBaseUrl}/${id}/orders`,
    });
    return axios.post<ServerResponseType<null>>(url, { orders });
}

export async function markOrderAsImproper(id: number, reason: string) {
    return await axios.post(`${ordersBaseUrl}/${id}/improper`, { reason });
}
