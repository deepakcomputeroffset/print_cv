import queryString from "query-string";
import { CUSTOMER_CATEGORY } from "@prisma/client";
import axios from "axios";
import { z } from "zod";
import { customerFormSchema } from "@/schemas/customer-register-schema";

export type status = "all" | "true" | "false";
export type sortType = "asc" | "desc";

export interface CustomerQueryParams {
    page?: number;
    perpage?: number;
    search?: string;
    category?: "all" | CUSTOMER_CATEGORY;
    status?: status;
    sortby?: string;
    sortorder?: sortType;
}

const baseUrl = "/api/customer";

export async function fetchCustomers(params: CustomerQueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: baseUrl,
        query: { ...params },
    });
    const { data } = await axios(url);
    return data;
}

export async function updateCustomer(
    id: number,
    data: Partial<z.infer<typeof customerFormSchema>>,
) {
    const url = `${baseUrl}/${id}`;
    const { data: response } = await axios.patch(url, data);
    return response;
}

export async function toggleCustomerBan(id: number) {
    const url = `${baseUrl}/${id}/ban`;
    const { data } = await axios.post(url);
    return data;
}

export async function deleteCustomer(id: number) {
    const url = `${baseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
