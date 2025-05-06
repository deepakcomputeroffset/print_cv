import axios from "axios";
import { z } from "zod";
import { ServerResponseType } from "@/types/types";
import { customerCategoryBaseUrl } from "../urls";
import { customerCategory } from "@prisma/client";
import { customerCategorySchema } from "@/schemas/customer.category.form.schema";

export async function fetchCustomerCategories() {
    const { data } = await axios<ServerResponseType<customerCategory[]>>(
        customerCategoryBaseUrl,
    );
    return data?.data;
}

export async function updateCustomerCategories(
    id: number,
    data: Partial<z.infer<typeof customerCategorySchema>>,
) {
    const { data: response } = await axios.patch<
        ServerResponseType<customerCategory>
    >(customerCategoryBaseUrl, { ...data, id });
    return response.data;
}

export async function createCustomerCategories(
    data: z.infer<typeof customerCategorySchema>,
) {
    const { data: response } = await axios.post<
        ServerResponseType<customerCategory>
    >(customerCategoryBaseUrl, data);
    return response;
}

export async function deleteCustomer(id: number) {
    const url = `${customerCategoryBaseUrl}?id=${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
