import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { ordersBaseUrl } from "../urls";
import {
    attachment,
    customer,
    order,
    product,
    productAttributeValue,
    productCategory,
    productItem,
    uploadGroup,
} from "@prisma/client";

interface OrderWithDetails extends order {
    productItem: productItem & {
        productAttributeOptions: productAttributeValue[];
        product: Pick<product, "name" | "imageUrl"> & {
            category: productCategory;
        };
        uploadGroup: uploadGroup | null;
    };
    attachment: Pick<attachment, "id" | "type" | "url">[];
    customer: Pick<
        customer,
        | "businessName"
        | "name"
        | "phone"
        | "isBanned"
        | "email"
        | "gstNumber"
        | "id"
    >;
}

export async function fetchOrdersPlaced(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: `${ordersBaseUrl}/placed`,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                orders: OrderWithDetails[];
            }
        >
    >(url);
}
