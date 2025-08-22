import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { orderBaseUrl } from "../urls";
import { order, product, productItem, UPLOADVIA } from "@prisma/client";

export async function fetchOrders(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: orderBaseUrl,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                data: (order & {
                    productItem: productItem & {
                        product: product;
                    };
                })[];
            }
        >
    >(url);
}

export async function createOrder(data: {
    productItemId: number;
    qty: number;
    fileOption: UPLOADVIA;
}) {
    return await axios.post<ServerResponseType<order>>(orderBaseUrl, data);
}

export async function cancelOrder(id: number, reason?: string) {
    return await axios.post(`${orderBaseUrl}/${id}`, { reason });
}
