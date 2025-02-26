import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { orderBaseUrl } from "../urls";
import { order, productItem } from "@prisma/client";

export async function fetchOrders(params: QueryParams = {}): Promise<
    QueryParams & {
        data: (order & {
            productItems: productItem;
        })[];
    }
> {
    const url = queryString.stringifyUrl({
        url: orderBaseUrl,
        query: { ...params },
    });
    return await axios(url);
}

export async function createOrder(data: FormData) {
    return await axios.post<ServerResponseType<order>>(orderBaseUrl, data);
}

export async function deleteOrder(id: number) {
    return await axios.delete(`${orderBaseUrl}/${id}`);
}
