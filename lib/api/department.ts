import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { departmentBaseUrl } from "../urls";
import { department } from "@prisma/client";
import { z } from "zod";
import { departmentFormSchema } from "@/schemas/department.form.schema";

export async function fetchDepartments(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: departmentBaseUrl,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                departments: department[];
            }
        >
    >(url);
}

export async function createDepartment(
    data: z.infer<typeof departmentFormSchema>,
) {
    return await axios.post<ServerResponseType<department>>(
        departmentBaseUrl,
        data,
    );
}
export async function updateDepartment(
    id: number,
    data: Partial<z.infer<typeof departmentFormSchema>>,
) {
    const url = `${departmentBaseUrl}/${id}`;
    return await axios.patch<ServerResponseType<department>>(url, data);
}

export async function deleteDepartment(id: number) {
    return await axios.delete(`${departmentBaseUrl}/${id}`);
}
