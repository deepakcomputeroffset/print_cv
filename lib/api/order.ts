import queryString from "query-string";
import axios from "axios";
import {
    ProductTypeOnlyWithPrice,
    QueryParams,
    ServerResponseType,
} from "@/types/types";
import { orderBaseUrl } from "../urls";
import { order, productItem } from "@prisma/client";

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
                        product: ProductTypeOnlyWithPrice;
                    };
                })[];
            }
        >
    >(url);
}

export async function createOrder(data: FormData) {
    return await axios.post<ServerResponseType<order>>(orderBaseUrl, data);
}

export async function cancelOrder(id: number) {
    return await axios.delete(`${orderBaseUrl}/${id}`);
}
