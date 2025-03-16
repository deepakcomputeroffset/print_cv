import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import {
    changePasswordFormSchema,
    customerFormSchema,
} from "@/schemas/customer.form.schema";
import { customerType, QueryParams, ServerResponseType } from "@/types/types";
import { customerBaseUrl } from "../urls";
import { customer } from "@prisma/client";

export async function fetchCustomers(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: customerBaseUrl,
        query: { ...params },
    });
    const { data } =
        await axios<
            ServerResponseType<QueryParams & { customers: customerType[] }>
        >(url);
    return data?.data;
}

export async function updateCustomer(
    id: number,
    data: Partial<z.infer<typeof customerFormSchema>>,
) {
    const url = `${customerBaseUrl}/${id}`;
    const { data: response } = await axios.patch<
        ServerResponseType<customerType>
    >(url, data);
    return response.data;
}

export async function createCustomer(data: z.infer<typeof customerFormSchema>) {
    const { data: response } = await axios.post<
        ServerResponseType<customerType>
    >(customerBaseUrl, data);
    return response;
}

export async function toggleCustomerBan(id: number) {
    const url = `${customerBaseUrl}/${id}/ban`;
    const { data } = await axios.post<ServerResponseType<customer>>(url);
    return data;
}

export async function deleteCustomer(id: number) {
    const url = `${customerBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}

export async function changePassword(
    data: z.infer<typeof changePasswordFormSchema>,
) {
    const url = `${customerBaseUrl}/changePassword`;
    const { data: response } = await axios.post<ServerResponseType<null>>(
        url,
        data,
    );
    return response;
}
