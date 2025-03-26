import axios from "axios";
import { dispatchBaseUrl } from "../urls";
import { orderType, QueryParams, ServerResponseType } from "@/types/types";
import queryString from "query-string";

export const getOrdersToDispatch = async (params: QueryParams = {}) => {
    const url = queryString.stringifyUrl({
        url: dispatchBaseUrl,
        query: { ...params },
    });
    console.log(url);
    console.log(params);
    const { data } =
        await axios<ServerResponseType<QueryParams & { orders: orderType[] }>>(
            url,
        );
    return data;
};

export const updateOrderDispatch = async (id: number) => {
    const { data } = await axios.post(`${dispatchBaseUrl}`, { id });
    return data;
};
