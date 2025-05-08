import axios from "axios";
import { distributionBaseUrl } from "../urls";
import { orderType, QueryParams, ServerResponseType } from "@/types/types";
import queryString from "query-string";
import { distribution } from "@prisma/client";

export const getDistributionOrder = async (params: QueryParams = {}) => {
    const url = queryString.stringifyUrl({
        url: distributionBaseUrl,
        query: { ...params },
    });
    const { data } = await axios<
        ServerResponseType<
            (distribution & {
                order: orderType;
            })[]
        >
    >(url);
    return data;
};

export const updatedDistributionOrder = async (orderId: number) => {
    const { data } = await axios.patch<ServerResponseType<distribution>>(
        distributionBaseUrl,
        { orderId },
    );
    return data;
};
