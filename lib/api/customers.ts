import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { customerFormSchema } from "@/schemas/customer-register-schema";
import { QueryParams } from "@/types/types";
import { customerBaseUrl } from "../urls";

export async function fetchCustomers(params: QueryParams = {}) {
    console.log("calling");
    const url = queryString.stringifyUrl({
        url: customerBaseUrl,
        query: { ...params },
    });
    const { data } = await axios(url);
    return data;
}

export async function updateCustomer(
    id: number,
    data: Partial<z.infer<typeof customerFormSchema>>,
) {
    const url = `${customerBaseUrl}/${id}`;
    const { data: response } = await axios.patch(url, data);
    return response;
}

export async function createCustomer(data: z.infer<typeof customerFormSchema>) {
    const url = `${customerBaseUrl}`;
    const { data: response } = await axios.post(url, data);
    return response;
}

export async function toggleCustomerBan(id: number) {
    const url = `${customerBaseUrl}/${id}/ban`;
    const { data } = await axios.post(url);
    return data;
}

export async function deleteCustomer(id: number) {
    const url = `${customerBaseUrl}/${id}`;
    const { data } = await axios.delete(url);
    return data;
}
