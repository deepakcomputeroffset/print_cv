import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { QueryParams } from "@/types/types";
import { orderBaseUrl } from "../urls";
import { orderFormSchema } from "@/schemas/order.form.schema";
import { order, product_item } from "@prisma/client";

export async function fetchOrders(params: QueryParams = {}): Promise<
    QueryParams & {
        data: (order & {
            product_items: product_item;
        })[];
    }
> {
    const url = queryString.stringifyUrl({
        url: orderBaseUrl,
        query: { ...params },
    });
    return await axios(url);
}

export async function createOrder(data: z.infer<typeof orderFormSchema>) {
    return await axios.post(orderBaseUrl, data);
}

export async function deleteOrder(id: number) {
    return await axios.delete(`${orderBaseUrl}/${id}`);
}
